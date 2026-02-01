import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { defineTable } from "convex/server";

export const challenges = defineTable({
  title: v.string(),
  description: v.string(),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  duration: v.number(),
  coinsReward: v.optional(v.number()),
  streakReward: v.optional(v.number()),
});

export const userChallenges = defineTable({
  userId: v.string(),
  challengeId: v.id("challenges"),
  progress: v.number(),
  completedDays: v.array(v.number()),
  startedAt: v.number(),
  lastCompletedAt: v.optional(v.number()),
  isCompleted: v.boolean(),
}).index("by_userId", ["userId"])
  .index("by_user_challenge", ["userId", "challengeId"]);

export const getChallenges = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("challenges").collect();
  },
});

export const getChallengeWithProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const challenges = await ctx.db.query("challenges").collect();
    const userChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return challenges.map((c) => {
      const uc = userChallenges.find((uc) => uc.challengeId === c._id);
      return {
        _id: c._id,
        title: c.title,
        description: c.description,
        duration: c.duration,
        icon: c.icon,
        color: c.color,
        coinsReward: c.coinsReward,
        isJoined: !!uc,
        progress: uc?.progress || 0,
        completedDays: uc?.completedDays || [],
        isCompleted: uc?.isCompleted || false,
        userChallengeId: uc?._id,
      };
    });
  },
});

export const joinChallenge = mutation({
  args: { userId: v.string(), challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userChallenges")
      .withIndex("by_user_challenge", (q) => 
        q.eq("userId", args.userId).eq("challengeId", args.challengeId)
      )
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("userChallenges", {
      userId: args.userId,
      challengeId: args.challengeId,
      progress: 0,
      completedDays: [],
      startedAt: Date.now(),
      isCompleted: false,
    });
  },
});

export const updateProgress = mutation({
  args: { 
    userChallengeId: v.id("userChallenges"), 
    day: v.number(),
    challengeDuration: v.number(),
    coinsReward: v.optional(v.number()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const uc = await ctx.db.get(args.userChallengeId);
    if (!uc || uc.isCompleted) return null;

    const alreadyCompleted = uc.completedDays.includes(args.day);
    if (alreadyCompleted) return { newProgress: uc.progress, isCompleted: false };

    const newCompletedDays = [...uc.completedDays, args.day];
    const newProgress = newCompletedDays.length;
    const isCompleted = newProgress >= args.challengeDuration;

    await ctx.db.patch(args.userChallengeId, {
      progress: newProgress,
      completedDays: newCompletedDays,
      lastCompletedAt: Date.now(),
      isCompleted,
    });

    if (isCompleted && args.coinsReward) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .first();

      if (user) {
        await ctx.db.patch(user._id, {
          coins: (user.coins || 0) + args.coinsReward,
          streak: (user.streak || 0) + 1,
        });
      }
    }

    return { newProgress, isCompleted };
  },
});
