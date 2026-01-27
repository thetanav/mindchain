"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCw, Sparkles, CheckCircle2 } from "lucide-react";
import { Confetti, ConfettiRef } from "@/components/magicui/confetti";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

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
  {
    id: 4,
    text: "How would you rate your energy levels?",
    options: ["Very high", "High", "Moderate", "Low"],
  },
  {
    id: 5,
    text: "How connected do you feel with friends, family, or your community?",
    options: [
      "Very connected",
      "Somewhat connected",
      "Neutral",
      "Very isolated",
    ],
  },
  {
    id: 6,
    text: "How motivated have you felt to do daily tasks or activities?",
    options: [
      "Motivated",
      "Neutral",
      "Slightly unmotivated",
      "Not motivated at all",
    ],
  },
  {
    id: 7,
    text: "How often have you been able to relax or take breaks for yourself?",
    options: ["Daily", "A few times a week", "Once a week", "Rarely"],
  },
  {
    id: 8,
    text: "How would you rate your concentration or focus recently?",
    options: ["Excellent", "Good", "Average", "Poor"],
  },
  {
    id: 9,
    text: "How satisfied are you with your ability to manage your emotions?",
    options: [
      "Satisfied",
      "Neutral",
      "Somewhat dissatisfied",
      "Very dissatisfied",
    ],
  },
  {
    id: 10,
    text: "How often have you engaged in activities you enjoy (hobbies, exercise, reading, etc.)?",
    options: ["Very often", "Often", "Sometimes", "Rarely"],
  },
];

export default function CheckPage() {
  const { user } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiData, setAiData] = useState<string | null>(null);
  
  // Fetch journal context
  const journalEntries = useQuery(api.journal.getEntries, user ? { userId: user.id } : "skip");
  const saveCheckIn = useMutation(api.checkins.saveResult);
  
  const [journalContext, setJournalContext] = useState("");

  useEffect(() => {
    if (journalEntries) {
      const recent = journalEntries.slice(0, 8);
      const context = recent.map(e => `[${new Date(e.createdAt).toLocaleDateString()}] ${e.content}`).join("\n");
      setJournalContext(context);
    }
  }, [journalEntries]);

  const confettiRef = useRef<ConfettiRef>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setAiData(null);
    setAiError(null);
  };

  const calculateResult = () => {
    // Map answers to a severity score 0..3 (0 best, 3 worst)
    // Reverse scoring for negatively phrased questions (currently index 2: stress/anxiety)
    const reverseIndexes = new Set([2]);

    const severities = answers.map((answer, index) => {
      const options = questions[index]?.options ?? [];
      const pos = Math.max(0, options.indexOf(answer));
      const base = Math.min(Math.max(pos, 0), 3); // clamp 0..3
      return reverseIndexes.has(index) ? 3 - base : base;
    });

    const count = severities.length || 1;
    const avg = severities.reduce((a, b) => a + b, 0) / count; // 0..3

    if (avg <= 0.75) {
      return {
        status: "Excellent",
        message:
          "Your responses suggest you're doing well! Keep maintaining your healthy habits and positive mindset.",
        color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200",
      } as const;
    } else if (avg <= 1.5) {
      return {
        status: "Good",
        message:
          "You're doing okay, but there might be some areas where you could use some self-care and attention.",
        color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200",
      } as const;
    } else if (avg <= 2.25) {
      return {
        status: "Fair",
        message:
          "Your responses indicate you might be experiencing some challenges. Consider talking to friends, family, or a counselor about how you're feeling.",
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200",
      } as const;
    } else {
      return {
        status: "Concerning",
        message:
          "Your responses suggest you might be going through a difficult time. We strongly recommend reaching out to a mental health professional for support.",
        color: "text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200",
      } as const;
    }
  };

  // Compute result memoized for render
  const result = useMemo(
    () => (showResults ? calculateResult() : null),
    [showResults, answers]
  );

  // Trigger AI insights when results are shown the first time
  useEffect(() => {
    if (!showResults || aiData || loadingAI || !user) return;
    const run = async () => {
      try {
        setLoadingAI(true);
        setAiError(null);
        const res = await fetch("/api/quiz-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            questions: questions.map((q) => q.text),
            journalContext,
          }),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        // Ensure we store a string to display
        const text =
          typeof json === "string"
            ? json
            : json?.insights ?? JSON.stringify(json);
        setAiData(text);
        
        // Save to Convex
        await saveCheckIn({
            userId: user.id,
            answers: answers,
            insight: text,
        });
        
      } catch (err: any) {
        setAiError(err?.message ?? "Something went wrong");
      } finally {
        setLoadingAI(false);
      }
    };
    run();
  }, [showResults]); // Dependent only on showResults (and user existence) to run once

  // Fire confetti exactly when results are shown to the user
  useEffect(() => {
    if (!showResults) return;
    // Defer to ensure ref is attached after the results view mounts
    const id = requestAnimationFrame(() => {
      confettiRef.current?.fire?.({});
    });
    return () => cancelAnimationFrame(id);
  }, [showResults]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 relative">
        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full pointer-events-none"
        />

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative z-10"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-serif">
              Check-in Complete
            </h2>
            <Button onClick={resetQuiz} variant={"outline"} className="gap-2">
              <RotateCw className="h-4 w-4" />
              Start Over
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
               {result && (
                  <div className={`p-6 rounded-2xl border ${result.color} mb-6 shadow-sm`}>
                    <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6" />
                      Status: {result.status}
                    </h3>
                    <p className="text-lg leading-relaxed opacity-90">{result.message}</p>
                  </div>
                )}
                
                <div
                  className="relative rounded-2xl border overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-background p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">
                      AI Insights
                    </h3>
                  </div>

                  {loadingAI && (
                    <div className="flex flex-col gap-3">
                       <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                       <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                       <p className="text-sm text-muted-foreground mt-2">Analyzing your patterns...</p>
                    </div>
                  )}
                  {aiError && <p className="text-sm text-red-500">{aiError}</p>}
                  {aiData && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">{aiData}</p>
                    </motion.div>
                  )}
                </div>
            </div>

            <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar">
               <h4 className="font-semibold mb-4 text-muted-foreground sticky top-0 bg-background/95 backdrop-blur z-10 py-2">Response Summary</h4>
               <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div key={question.id} className="p-4 rounded-xl bg-muted/30 border text-sm">
                      <p className="font-medium mb-1 text-foreground/80">{question.text}</p>
                      <p className="text-primary font-medium">
                        {answers[index]}
                      </p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 py-12 flex flex-col justify-center min-h-[80vh]">
      <div className="mb-8">
         <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
         </div>
         <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 font-serif leading-tight">
             {questions[currentQuestion].text}
          </h2>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-accent hover:scale-[1.01] hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                   <span className="text-lg">{option}</span>
                   <div className="w-4 h-4 rounded-full border border-primary/30 group-hover:border-primary group-hover:bg-primary/10 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
