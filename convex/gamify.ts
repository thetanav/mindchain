import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addPoints = mutation({
  args: { userId: v.string(), points: v.number() },
  handler: async (ctx, { userId, points }) => {
    const gamify = await ctx.db
      .query("gamify")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (gamify) {
      await ctx.db.patch(gamify._id, { points: gamify.points + points });
    } else {
      await ctx.db.insert("gamify", {
        userId,
        points,
        badges: [],
        dailyQuests: [],
      });
    }
  },
});

export const addBadge = mutation({
  args: { userId: v.string(), badge: v.string() },
  handler: async (ctx, { userId, badge }) => {
    const gamify = await ctx.db
      .query("gamify")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (gamify) {
      await ctx.db.patch(gamify._id, { badges: [...gamify.badges, badge] });
    } else {
      await ctx.db.insert("gamify", {
        userId,
        points: 0,
        badges: [badge],
        dailyQuests: [],
      });
    }
  },
});

export const completeQuest = mutation({
  args: { userId: v.string(), quest: v.string() },
  handler: async (ctx, { userId, quest }) => {
    const gamify = await ctx.db
      .query("gamify")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    if (gamify) {
      const dailyQuests = gamify.dailyQuests.map((q) => {
        if (q.quest === quest) {
          return { ...q, completed: true };
        }
        return q;
      });
      await ctx.db.patch(gamify._id, { dailyQuests });
    }
  },
});