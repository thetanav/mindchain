import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveResult = mutation({
  args: {
    userId: v.string(),
    answers: v.any(),
    insight: v.string(),
  },
  handler: async (ctx, args) => {
    // Save the check-in
    await ctx.db.insert("checkins", {
      userId: args.userId,
      answers: args.answers,
      insight: args.insight,
      createdAt: Date.now(),
    });

    // Update user coins/streak if needed?
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
      
    if (user) {
        await ctx.db.patch(user._id, {
            coins: (user.coins || 0) + 5, // Reward for check-in
        });
    }
  },
});

export const getHistory = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("checkins")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    }
});
