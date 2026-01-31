
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

const challenges = [
  {
    title: "7-Day Meditation Challenge",
    description: "Meditate for at least 5 minutes every day for 7 days.",
    participants: 120,
    progress: 3,
  },
  {
    title: "30-Day Journaling Challenge",
    description: "Write a journal entry every day for 30 days.",
    participants: 80,
    progress: 10,
  },
  {
    title: "Mindful Walking Challenge",
    description: "Go for a 15-minute mindful walk every day for a week.",
    participants: 200,
    progress: 5,
  },
];

export default function Challenges() {
  const [joinedChallenges, setJoinedChallenges] = useState([]);

  const handleJoinChallenge = (challenge) => {
    setJoinedChallenges([...joinedChallenges, challenge]);
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Social Challenges</h1>
      <p className="text-muted-foreground">
        Join challenges with the community to stay motivated.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.title}>
            <CardHeader>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-bold">{challenge.participants}</span>{" "}
                participants
              </div>
              {joinedChallenges.includes(challenge.title) ? (
                <div>
                  <Progress
                    value={(challenge.progress / 7) * 100}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    {challenge.progress}
                    /7 days completed
                  </div>
                </div>
              ) : (
                <Button onClick={() => handleJoinChallenge(challenge.title)}>
                  Join Challenge
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
