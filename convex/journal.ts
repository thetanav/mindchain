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

    // Streak Logic
    const now = Date.now();
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
