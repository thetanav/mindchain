
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getChats = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), chatId))
      .collect();
  },
});

export const createChat = mutation({
  args: { userId: v.string(), title: v.string() },
  handler: async (ctx, { userId, title }) => {
    return await ctx.db.insert("chats", {
      userId,
      title,
      createdAt: Date.now(),
    });
  },
});

export const addMessage = mutation({
  args: {
    chatId: v.id("chats"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { chatId, role, content }) => {
    await ctx.db.insert("messages", {
      chatId,
      role,
      content,
      createdAt: Date.now(),
    });
  },
});
