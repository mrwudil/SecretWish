import { questions, wishes, notifications, type InsertQuestion, type Question, type InsertWish, type Wish, type InsertNotification, type Notification } from "@shared/schema";
import { db } from "./db";
import { eq, inArray } from "drizzle-orm";

export interface IStorage {
  createQuestion(q: InsertQuestion): Promise<Question>;
  getQuestion(id: string): Promise<Question | undefined>;
  getQuestionsBySender(senderId: string): Promise<Question[]>;
  createWishes(w: InsertWish[]): Promise<Wish[]>;
  getWishesForQuestion(questionId: string): Promise<Wish[]>;
  getWishesForQuestions(questionIds: string[]): Promise<Wish[]>;
  updateWishStatus(id: number, status: string): Promise<Wish | undefined>;
  createNotification(n: InsertNotification): Promise<Notification>;
}

export class DatabaseStorage implements IStorage {
  async createQuestion(q: InsertQuestion): Promise<Question> {
    const [question] = await db.insert(questions).values(q).returning();
    return question;
  }
  async getQuestion(id: string): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question;
  }
  async getQuestionsBySender(senderId: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.senderId, senderId));
  }
  async createWishes(w: InsertWish[]): Promise<Wish[]> {
    if (w.length === 0) return [];
    return await db.insert(wishes).values(w).returning();
  }
  async getWishesForQuestion(questionId: string): Promise<Wish[]> {
    return await db.select().from(wishes).where(eq(wishes.questionId, questionId));
  }
  async getWishesForQuestions(questionIds: string[]): Promise<Wish[]> {
    if (questionIds.length === 0) return [];
    return await db.select().from(wishes).where(inArray(wishes.questionId, questionIds));
  }
  async updateWishStatus(id: number, status: string): Promise<Wish | undefined> {
    const [wish] = await db.update(wishes).set({ status }).where(eq(wishes.id, id)).returning();
    return wish;
  }
  async createNotification(n: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(n).returning();
    return notification;
  }
}

export const storage = new DatabaseStorage();