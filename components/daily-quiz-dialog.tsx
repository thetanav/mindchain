"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How have you been feeling emotionally over the past week?",
    options: ["Very good", "Good", "Neutral", "Not so good"],
  },
  {
    id: 2,
    text: "How would you rate your sleep quality?",
    options: ["Excellent", "Good", "Fair", "Poor"],
  },
  {
    id: 3,
    text: "How often have you felt stressed or anxious lately?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
  },
];

export function DailyQuizDialog() {
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  const checkinStatus = useQuery(
    api.checkins.hasCheckedInToday,
    user ? { userId: user.id } : "skip"
  );

  useEffect(() => {
    if (user && checkinStatus !== undefined) {
      if (!checkinStatus.hasCheckedIn) {
        setIsOpen(true);
      }
    }
  }, [user, checkinStatus]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsOpen(false);
      router.push("/check");
    }
  };

  const skipQuiz = () => {
    setIsOpen(false);
  };

  const startQuiz = () => {
    setShowWelcome(false);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showWelcome ? "Daily Check-in" : `Question ${currentQuestion + 1} of ${questions.length}`}
          </DialogTitle>
          <DialogDescription>
            {showWelcome
              ? "Take a quick moment to reflect on how you're doing today."
              : questions[currentQuestion].text}
          </DialogDescription>
        </DialogHeader>

        {showWelcome ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This short quiz helps us understand how you're feeling and provides personalized insights.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={skipQuiz}>
                Maybe Later
              </Button>
              <Button onClick={startQuiz}>Start Check-in</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <button onClick={() => setShowWelcome(true)} className="hover:text-foreground">
                Back
              </button>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
