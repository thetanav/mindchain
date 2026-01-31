
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const meditations = defineTable({
  title: v.string(),
  duration: v.number(),
  description: v.string(),
  audio: v.string(),
});
