"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, Heart, Zap, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  text: string;
  options: string[];
  icon: React.ReactNode;
}

const questions: Question[] = [
  {
    id: 1,
    text: "How have you been feeling emotionally over the past week?",
    options: ["Very good", "Good", "Neutral", "Not so good"],
    icon: <Heart className="w-5 h-5 text-rose-500" />,
  },
  {
    id: 2,
    text: "How would you rate your sleep quality?",
    options: ["Excellent", "Good", "Fair", "Poor"],
    icon: <Moon className="w-5 h-5 text-indigo-500" />,
  },
  {
    id: 3,
    text: "How often have you felt stressed or anxious lately?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
    icon: <Zap className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 4,
    text: "How would you rate your energy levels?",
    options: ["Very high", "High", "Moderate", "Low"],
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: 5,
    text: "How connected do you feel with friends, family, or your community?",
    options: ["Very connected", "Somewhat connected", "Neutral", "Very isolated"],
    icon: <Heart className="w-5 h-5 text-pink-500" />,
  },
];

const statusConfig = {
  Excellent: {
    color: "from-emerald-500/20 to-green-500/10 border-emerald-200 dark:border-emerald-800",
    icon: "🌟",
    gradient: "bg-gradient-to-br from-emerald-400 to-green-600",
  },
  Good: {
    color: "from-blue-500/20 to-cyan-500/10 border-blue-200 dark:border-blue-800",
    icon: "😊",
    gradient: "bg-gradient-to-br from-blue-400 to-indigo-600",
  },
  Fair: {
    color: "from-amber-500/20 to-orange-500/10 border-amber-200 dark:border-amber-800",
    icon: "🤔",
    gradient: "bg-gradient-to-br from-amber-400 to-orange-600",
  },
  "Take Care": {
    color: "from-red-500/20 to-rose-500/10 border-red-200 dark:border-red-800",
    icon: "💙",
    gradient: "bg-gradient-to-br from-red-400 to-rose-600",
  },
};

export function QuizModal() {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const today = new Date().toISOString().split("T")[0];
    const lastQuizDate = localStorage.getItem("mindchain_quiz_date");
    const hasCompletedToday = lastQuizDate === today;

    if (!hasCompletedToday) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, user]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("mindchain_quiz_date", today);
      setShowResults(true);
    }
  };

  const calculateResult = () => {
    const reverseIndexes = new Set([2]);
    const severities = answers.map((answer, index) => {
      const options = questions[index]?.options ?? [];
      const pos = Math.max(0, options.indexOf(answer));
      const base = Math.min(Math.max(pos, 0), 3);
      return reverseIndexes.has(index) ? 3 - base : base;
    });

    const avg = severities.reduce((a, b) => a + b, 0) / (severities.length || 1);

    if (avg <= 0.75) return { status: "Excellent" as const, message: "You're doing great! Keep maintaining your healthy habits and positive mindset. Your self-care routine is really paying off." };
    if (avg <= 1.5) return { status: "Good" as const, message: "You're doing okay. You're on the right track, but there's always room for more self-care. Maybe try a relaxing activity today?" };
    if (avg <= 2.25) return { status: "Fair" as const, message: "You might be facing some challenges right now. Remember to be kind to yourself. Consider talking to someone you trust or taking a small break." };
    return { status: "Take Care" as const, message: "We want you to know that it's okay to not be okay. Please consider reaching out to someone you trust – a friend, family member, or a professional. You don't have to go through this alone." };
  };

  const result = useMemo(
    () => (showResults ? calculateResult() : null),
    [showResults, answers]
  );

  const handleClose = () => {
    if (showResults) {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("mindchain_quiz_date", today);
    }
    setIsOpen(false);
  };

  const progress = showResults ? 100 : ((currentQuestion + 1) / questions.length) * 100;
  const config = result ? statusConfig[result.status] : null;

  if (!isLoaded || !user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-background rounded-3xl shadow-2xl overflow-hidden border"
          >
            {!showResults && (
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold font-serif">
                    {showResults ? "Your Check-in" : "Daily Check-in"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {showResults ? "Here's your summary" : `${currentQuestion + 1} of ${questions.length} questions`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {showResults && result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className={`relative overflow-hidden rounded-2xl border ${config?.color} bg-gradient-to-br p-6`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-2xl ${config?.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                            {config?.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{result.status}</h3>
                            <p className="text-sm opacity-80">Based on your responses</p>
                          </div>
                        </div>
                        <p className="text-base leading-relaxed opacity-90">{result.message}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleClose} className="flex-1 rounded-xl py-6 text-base font-medium" size="lg">
                        Continue to Dashboard
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      {questions[currentQuestion].icon}
                      <span>Question {currentQuestion + 1}</span>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-medium leading-snug">
                      {questions[currentQuestion].text}
                    </h3>
                    
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, idx) => (
                        <motion.button
                          key={option}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleAnswer(option)}
                          className="w-full text-left p-4 rounded-xl border border-border/60 bg-background hover:bg-accent hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base">{option}</span>
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
