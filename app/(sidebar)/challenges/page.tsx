"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, ArrowRight } from "lucide-react";

const challenges = [
  {
    title: "7-Day Meditation Challenge",
    description: "Meditate for at least 5 minutes every day for 7 days.",
    participants: 120,
    progress: 3,
    days: 7,
    icon: Trophy,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "30-Day Journaling Challenge",
    description: "Write a journal entry every day for 30 days.",
    participants: 80,
    progress: 10,
    days: 30,
    icon: Trophy,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Mindful Walking Challenge",
    description: "Go for a 15-minute mindful walk every day for a week.",
    participants: 200,
    progress: 5,
    days: 7,
    icon: Trophy,
    color: "from-amber-500 to-orange-500",
  },
];

interface Challenge {
  title: string;
  description: string;
  participants: number;
  progress: number;
  days: number;
  icon: typeof Trophy;
  color: string;
}

export default function ChallengesPage() {
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);

  const handleJoinChallenge = (challenge: Challenge) => {
    if (!joinedChallenges.includes(challenge.title)) {
      setJoinedChallenges([...joinedChallenges, challenge.title]);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-serif flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          Wellness Challenges
        </h1>
        <p className="text-muted-foreground mt-1">
          Join community challenges to build healthy habits and stay motivated
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.title} className="border-0 bg-gradient-to-br from-background to-muted/30 h-full">
            <CardHeader className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${challenge.color} text-white shadow-lg`}>
                  <challenge.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  {challenge.participants}
                </div>
              </div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <CardDescription className="text-sm">
                {challenge.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              {joinedChallenges.includes(challenge.title) ? (
                <div className="space-y-3">
                  <Progress
                    value={(challenge.progress / challenge.days) * 100}
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {challenge.progress}/{challenge.days} days
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      Keep going!
                    </span>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => handleJoinChallenge(challenge)}
                  className="w-full"
                >
                  Join Challenge
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
