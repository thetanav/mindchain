import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createEntry = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
    sentiment: v.optional(v.string()),
    moodScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) throw new Error("User not found");

    const now = Date.now();

    // Check if user already has an entry for today
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingEntry = await ctx.db
      .query("journal")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.and(
        q.gte(q.field("createdAt"), today.getTime()),
        q.lt(q.field("createdAt"), tomorrow.getTime())
      ))
      .first();
    
    if (existingEntry) {
      throw new Error("You can only create one journal entry per day");
    }

    // Streak Logic
    const oneDay = 24 * 60 * 60 * 1000;
    let newStreak = user.streak;
    
    if (user.lastCheckIn) {
      const daysSinceLast = Math.floor(now / oneDay) - Math.floor(user.lastCheckIn / oneDay);
      if (daysSinceLast === 1) {
        newStreak += 1;
      } else if (daysSinceLast > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Update User
    await ctx.db.patch(user._id, {
      streak: newStreak,
      lastCheckIn: now,
      coins: user.coins + 10, // Reward for journaling
    });

    // Create Entry
    const entryId = await ctx.db.insert("journal", {
      userId: args.userId,
      content: args.content,
      sentiment: args.sentiment,
      moodScore: args.moodScore,
      createdAt: now,
    });

    return entryId;
  },
});

export const deleteEntry = mutation({
  args: {
    userId: v.string(),
    entryId: v.id("journal"),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    
    if (!entry || entry.userId !== args.userId) {
      throw new Error("Entry not found or access denied");
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (entry.createdAt < now - oneDayMs) {
      throw new Error("You can only delete journal entries that are less than 1 day old");
    }

    await ctx.db.delete(args.entryId);
  },
});

export const updateEntry = mutation({
  args: {
    userId: v.string(),
    entryId: v.id("journal"),
    content: v.string(),
    sentiment: v.optional(v.string()),
    moodScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    
    if (!entry || entry.userId !== args.userId) {
      throw new Error("Entry not found or access denied");
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (entry.createdAt < now - oneDayMs) {
      throw new Error("You can only edit journal entries that are less than 1 day old");
    }

    await ctx.db.patch(args.entryId, {
      content: args.content,
      sentiment: args.sentiment,
      moodScore: args.moodScore,
    });
  },
});

export const getEntries = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("journal")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("journal")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
      
    // Calculate simple stats
    // In a real app, you might want to aggregate this more efficiently
    const totalEntries = entries.length;
    
    return {
      totalEntries,
      // You could add mood averages here
    };
  },
});
