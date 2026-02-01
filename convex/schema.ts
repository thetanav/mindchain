import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { cbtExercises } from "./cbt";
import { challenges } from "./challenges";
import { meditations } from "./meditation";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Clerk ID
    email: v.string(),
    name: v.optional(v.string()),
    coins: v.number(),
    streak: v.number(),
    lastCheckIn: v.optional(v.number()), // Timestamp
  }).index("by_userId", ["userId"]),

  journal: defineTable({
    userId: v.string(),
    content: v.string(),
    sentiment: v.optional(v.string()), // "Positive", "Neutral", "Negative"
    moodScore: v.optional(v.number()), // 1-10
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  checkins: defineTable({
    userId: v.string(),
    answers: v.array(v.string()), // JSON of answers
    insight: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  messages: defineTable({
    chatId: v.id("chats"),
    role: v.string(), // "user" or "assistant"
    content: v.string(),
    createdAt: v.number(),
  }).index("by_chatId", ["chatId"]),
  gamify: defineTable({
    userId: v.string(),
    points: v.number(),
    badges: v.array(v.string()),
    dailyQuests: v.array(v.object({ quest: v.string(), completed: v.boolean() })),
  }).index("by_userId", ["userId"]),
  meditations,
  cbtExercises,
  challenges,
});
