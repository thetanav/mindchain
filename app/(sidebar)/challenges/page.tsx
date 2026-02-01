"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Check, Flame, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ChallengeData {
  _id: string;
  title: string;
  description: string;
  duration: number;
  icon?: string;
  color?: string;
  coinsReward?: number;
  isJoined: boolean;
  progress: number;
  completedDays: number[];
  isCompleted: boolean;
  userChallengeId?: string;
}

const defaultChallenges: ChallengeData[] = [
  {
    _id: "meditation-7",
    title: "7-Day Meditation Challenge",
    description: "Meditate for at least 5 minutes every day for 7 days.",
    duration: 7,
    icon: "meditation",
    color: "from-orange-500 to-red-500",
    coinsReward: 50,
    isJoined: false,
    progress: 0,
    completedDays: [],
    isCompleted: false,
  },
  {
    _id: "journaling-30",
    title: "30-Day Journaling Challenge",
    description: "Write a journal entry every day for 30 days.",
    duration: 30,
    icon: "journal",
    color: "from-blue-500 to-indigo-500",
    coinsReward: 100,
    isJoined: false,
    progress: 0,
    completedDays: [],
    isCompleted: false,
  },
  {
    _id: "walking-7",
    title: "Mindful Walking Challenge",
    description: "Go for a 15-minute mindful walk every day for a week.",
    duration: 7,
    icon: "walking",
    color: "from-emerald-500 to-teal-500",
    coinsReward: 40,
    isJoined: false,
    progress: 0,
    completedDays: [],
    isCompleted: false,
  },
  {
    _id: "gratitude-14",
    title: "14-Day Gratitude Challenge",
    description: "Write down 3 things you're grateful for each day.",
    duration: 14,
    icon: "gratitude",
    color: "from-pink-500 to-rose-500",
    coinsReward: 60,
    isJoined: false,
    progress: 0,
    completedDays: [],
    isCompleted: false,
  },
];

export default function ChallengesPage() {
  const { user, isLoaded } = useUser();
  const [challenges, setChallenges] = useState<ChallengeData[]>(defaultChallenges);

  const challengeData = useQuery(
    api.challenges.getChallengeWithProgress,
    isLoaded && user ? { userId: user.id } : "skip"
  );
  const joinChallenge = useMutation(api.challenges.joinChallenge);
  const updateProgress = useMutation(api.challenges.updateProgress);

  useEffect(() => {
    if (challengeData) {
      setChallenges((prev) =>
        prev.map((c) => {
          const data = challengeData.find((d) => d._id === c._id);
          if (data) {
            return {
              ...c,
              isJoined: data.isJoined,
              progress: data.progress,
              completedDays: data.completedDays || [],
              isCompleted: data.isCompleted,
              userChallengeId: data.userChallengeId ? String(data.userChallengeId) : undefined,
              coinsReward: data.coinsReward ?? c.coinsReward,
            };
          }
          return c;
        })
      );
    }
  }, [challengeData]);

  const handleJoin = async (challenge: ChallengeData) => {
    if (!user) return;
    await joinChallenge({
      userId: user.id,
      challengeId: challenge._id as any,
    });
  };

  const handleCompleteDay = async (challenge: ChallengeData, day: number) => {
    if (!user || !challenge.userChallengeId) return;
    await updateProgress({
      userChallengeId: challenge.userChallengeId as any,
      day,
      challengeDuration: challenge.duration,
      coinsReward: challenge.coinsReward || 0,
      userId: user.id,
    });
  };

  const today = new Date().getDate();

  return (
    <div className="container py-8 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight font-serif flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          Wellness Challenges
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Join community challenges to build healthy habits and earn rewards
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${challenge.color}`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${challenge.color} text-white shadow-lg`}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{challenge.duration} days</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-serif">{challenge.title}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {challenge.description}
                </CardDescription>
                {challenge.coinsReward && (
                  <div className="flex items-center gap-1 mt-2 text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">{challenge.coinsReward} coins reward</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                {challenge.isJoined ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {challenge.progress}/{challenge.duration} days
                        </span>
                      </div>
                      <Progress
                        value={(challenge.progress / challenge.duration) * 100}
                        className="h-2"
                      />
                    </div>

                    {challenge.isCompleted ? (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center">
                        <Trophy className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                        <p className="font-semibold text-amber-600 dark:text-amber-400">
                          Challenge Completed!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You earned {challenge.coinsReward} coins!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: challenge.duration }, (_, i) => {
                          const day = i + 1;
                          const isCompleted = challenge.completedDays.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => handleCompleteDay(challenge, day)}
                              disabled={isCompleted}
                              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                                isCompleted
                                  ? "bg-green-500 text-white"
                                  : day === today
                                  ? `bg-gradient-to-br ${challenge.color} text-white hover:scale-105`
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                day
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => handleJoin(challenge)}
                    className="w-full"
                    size="lg"
                  >
                    Join Challenge
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
