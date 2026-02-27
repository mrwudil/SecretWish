export * from "./models/auth";
import { pgTable, text, varchar, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey(),
  senderId: varchar("sender_id").references(() => users.id),
  receiverEmail: varchar("receiver_email").notNull(),
  eventType: varchar("event_type").notNull().default("Birthday"),
  revealOption: varchar("reveal_option").notNull().default("After Purchase"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  questionId: varchar("question_id").references(() => questions.id).notNull(),
  itemName: text("item_name").notNull(),
  itemLink: text("item_link"),
  price: integer("price"),
  status: varchar("status").notNull().default("pending"), 
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(),
  receiverEmail: varchar("receiver_email").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  sender: one(users, {
    fields: [questions.senderId],
    references: [users.id],
  }),
  wishes: many(wishes),
}));

export const wishesRelations = relations(wishes, ({ one }) => ({
  question: one(questions, {
    fields: [wishes.questionId],
    references: [questions.id],
  }),
}));

export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true, createdAt: true });
export const insertWishSchema = createInsertSchema(wishes).omit({ id: true, status: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, sentAt: true });

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type Wish = typeof wishes.$inferSelect;
export type InsertWish = z.infer<typeof insertWishSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type CreateQuestionRequest = Omit<InsertQuestion, "senderId">;
export type SubmitWishesRequest = {
  wishes: Omit<InsertWish, "questionId">[];
};
export type UpdateWishStatusRequest = {
  status: "pending" | "surprise_in_progress" | "not_this_time";
};

export type QuestionResponse = Question;
export type WishResponse = Wish;
export type QuestionWithWishesResponse = Question & { wishes: Wish[] };
