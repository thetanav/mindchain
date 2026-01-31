
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const cbtExercises = defineTable({
  userId: v.string(),
  exercise: v.string(),
  answers: v.any(),
  createdAt: v.number(),
}).index("by_userId", ["userId"]);
