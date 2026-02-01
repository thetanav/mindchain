import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveResult = mutation({
  args: {
    userId: v.string(),
    answers: v.array(v.string()),
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

export const getWellnessTrends = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const checkins = await ctx.db
      .query("checkins")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect();

    const trends = checkins.map(checkin => {
      const answers = checkin.answers as string[];
      // This logic should mirror the client-side calculation
      const reverseIndexes = new Set([2]);
      const severities = answers.map((answer, index) => {
        const options = questions[index]?.options ?? [];
        const pos = Math.max(0, options.indexOf(answer));
        const base = Math.min(Math.max(pos, 0), 3);
        return reverseIndexes.has(index) ? 3 - base : base;
      });
      const avg = severities.reduce((a, b) => a + b, 0) / (severities.length || 1);
      const score = 3 - avg; // Invert: higher is better

      return {
        date: new Date(checkin.createdAt).toISOString().split('T')[0],
        score: parseFloat(score.toFixed(2)),
      };
    });

    // Deduplicate to have one score per day, taking the latest one
    const dailyScores = new Map<string, number>();
    for (const trend of trends) {
      dailyScores.set(trend.date, trend.score);
    }
    
    return Array.from(dailyScores.entries()).map(([date, score]) => ({ date, score }));
  },
});

export const hasCheckedInToday = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const checkins = await ctx.db
      .query("checkins")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Check if there's a check-in today (after start of day)
    const hasToday = checkins.some(checkin => checkin.createdAt >= startOfDay.getTime());
    
    return { hasCheckedIn: hasToday };
  },
});

export const getHeatmapData = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const checkins = await ctx.db
      .query("checkins")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect();

    // Get last 90 days of data
    const today = new Date();
    const heatmapData = [];
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find check-ins for this day
      const dayCheckins = checkins.filter(c => 
        new Date(c.createdAt).toISOString().split('T')[0] === dateStr
      );
      
      let intensity = 0;
      if (dayCheckins.length > 0) {
        // Calculate average score for the day
        const scores = dayCheckins.map(checkin => {
          const answers = checkin.answers as string[];
          const severities = answers.map((answer, index) => {
            const options = questions[index]?.options ?? [];
            const pos = Math.max(0, options.indexOf(answer));
            const base = Math.min(Math.max(pos, 0), 3);
            return base;
          });
          const avg = severities.reduce((a, b) => a + b, 0) / (severities.length || 1);
          return 3 - avg;
        });
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        intensity = Math.round((avgScore / 3) * 100);
      }
      
      heatmapData.push({
        date: dateStr,
        intensity,
        hasData: dayCheckins.length > 0,
      });
    }
    
    return heatmapData;
  },
});

// We need the questions here to calculate the score
const questions = [
  { id: 1, text: "How have you been feeling emotionally over the past week?", options: ["Very good", "Good", "Neutral", "Not so good"] },
  { id: 2, text: "How would you rate your sleep quality?", options: ["Excellent", "Good", "Fair", "Poor"] },
  { id: 3, text: "How often have you felt stressed or anxious lately?", options: ["Never", "Rarely", "Sometimes", "Often"] },
  { id: 4, text: "How would you rate your energy levels?", options: ["Very high", "High", "Moderate", "Low"] },
  { id: 5, text: "How connected do you feel with friends, family, or your community?", options: ["Very connected", "Somewhat connected", "Neutral", "Very isolated"] },
  { id: 6, text: "How motivated have you felt to do daily tasks or activities?", options: ["Motivated", "Neutral", "Slightly unmotivated", "Not motivated at all"] },
  { id: 7, text: "How often have you been able to relax or take breaks for yourself?", options: ["Daily", "A few times a week", "Once a week", "Rarely"] },
  { id: 8, text: "How would you rate your concentration or focus recently?", options: ["Excellent", "Good", "Average", "Poor"] },
  { id: 9, text: "How satisfied are you with your ability to manage your emotions?", options: ["Satisfied", "Neutral", "Somewhat dissatisfied", "Very dissatisfied"] },
  { id: 10, text: "How often have you engaged in activities you enjoy (hobbies, exercise, reading, etc.)?", options: ["Very often", "Often", "Sometimes", "Rarely"] },
];
