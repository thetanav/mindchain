
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const challenges = defineTable({
  title: v.string(),
  description: v.string(),
  participants: v.array(v.string()),
  duration: v.number(),
});
