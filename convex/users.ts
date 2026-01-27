import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const store = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (user) {
      // Update name if changed
      if (user.name !== args.name) {
        await ctx.db.patch(user._id, { name: args.name });
      }
      return user._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      coins: 0,
      streak: 0,
      lastCheckIn: undefined,
    });
  },
});

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
  },
});

export const updateCoins = mutation({
  args: { userId: v.string(), amount: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) throw new Error("User not found");

    const newBalance = (user.coins || 0) + args.amount;
    await ctx.db.patch(user._id, { coins: newBalance });
    return newBalance;
  },
});
