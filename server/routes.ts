import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./replit_integrations/auth/replitAuth";
import { registerAuthRoutes } from "./replit_integrations/auth/routes";
import { isAuthenticated } from "./replit_integrations/auth/replitAuth";
import { randomBytes } from "crypto";

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Mock email service with Resend integration
async function sendEmail(to: string, subject: string, text: string) {
  console.log(`\n================================`);
  console.log(`[EMAIL] To: ${to}`);
  console.log(`Subject: ${subject}`);
  if (resend) {
    try {
      await resend.emails.send({
        from: 'SecretWish <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        text: text,
      });
      console.log(`[RESEND] Email sent successfully via Resend API`);
    } catch (error) {
      console.error(`[RESEND ERROR]`, error);
    }
  } else {
    console.log(`[MOCK] Body: ${text}`);
    console.log(`(Set RESEND_API_KEY to send real emails)`);
  }
  console.log(`================================\n`);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.post(api.questions.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.questions.create.input.parse(req.body);
      
      // Generate unique short ID
      const shortId = randomBytes(4).toString('hex');
      
      const question = await storage.createQuestion({
        id: shortId,
        senderId: req.user.claims.sub,
        receiverEmail: input.receiverEmail,
        receiverName: input.receiverName || null,
        eventType: input.eventType || "Birthday",
        revealOption: input.revealOption,
      });

      // Send email to receiver
      const link = `${req.protocol}://${req.get('host')}/r/${question.id}`;
      await sendEmail(
        question.receiverEmail,
        "Someone wants to know your wish!",
        `🎁 ${question.receiverName || 'Someone'} wants to know your birthday wish. Tap the link: ${link}`
      );

      res.status(201).json(question);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.questions.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const questions = await storage.getQuestionsBySender(req.user.claims.sub);
      const qIds = questions.map(q => q.id);
      const wishes = await storage.getWishesForQuestions(qIds);
      
      const response = questions.map(q => ({
        ...q,
        wishes: wishes.filter(w => w.questionId === q.id),
      }));
      
      res.json(response);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.questions.get.path, async (req, res) => {
    try {
      const question = await storage.getQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const wishes = await storage.getWishesForQuestion(question.id);
      res.json({ ...question, wishes });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.wishes.submit.path, async (req, res) => {
    try {
      const question = await storage.getQuestion(req.params.id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const input = api.wishes.submit.input.parse(req.body);
      
      const wishesData = input.wishes.map(w => ({
        ...w,
        questionId: question.id,
        price: w.price !== undefined ? w.price : null,
      }));
      
      const wishes = await storage.createWishes(wishesData);

      await sendEmail(
        "sender@secretwish.com", // Mock sender email
        "Your secret question has been answered",
        `Your secret question has been answered. View wishes: ${req.protocol}://${req.get('host')}/`
      );

      res.status(201).json(wishes);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.wishes.updateStatus.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.wishes.updateStatus.input.parse(req.body);
      
      const wish = await storage.updateWishStatus(Number(req.params.wishId), input.status);
      if (!wish) {
        return res.status(404).json({ message: "Wish not found" });
      }

      // Send status update notification to receiver
      const question = await storage.getQuestion(wish.questionId);
      if (question) {
        const statusText = input.status === 'surprise_in_progress' ? 'confirmed' : 'passed on';
        await sendEmail(
          question.receiverEmail,
          "Update on your wishes!",
          `Someone has ${statusText} one of your wishes! Check back for more updates.`
        );
      }
      
      res.json(wish);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}