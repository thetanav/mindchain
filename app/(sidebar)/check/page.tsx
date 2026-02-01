"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { RotateCw, Sparkles, CheckCircle2, ChevronDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";

const Streamdown = dynamic(() => import("streamdown").then(mod => ({ default: mod.Streamdown })), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";

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
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(true);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [saved, setSaved] = useState(false);
  
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

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/quiz-insights"),
    body: {
      journalContext,
    }
  });

  const aiData = messages[1]?.parts.map(p => p.type === "text" ? p.content : "").join("") || null;

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
    setIsSummaryCollapsed(true);
    setHasTriggered(false);
    setSaved(false);
  };

  const calculateResult = () => {
    const reverseIndexes = new Set([2]);

    const severities = answers.map((answer, index) => {
      const options = questions[index]?.options ?? [];
      const pos = Math.max(0, options.indexOf(answer));
      const base = Math.min(Math.max(pos, 0), 3);
      return reverseIndexes.has(index) ? 3 - base : base;
    });

    const count = severities.length || 1;
    const avg = severities.reduce((a, b) => a + b, 0) / count;

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

  const result = useMemo(
    () => (showResults ? calculateResult() : null),
    [showResults, answers]
  );

  useEffect(() => {
    if (showResults && !hasTriggered) {
      const paired = answers
        .map(
          (a, i) => `Q${i + 1}: ${questions[i].text}\nA${i + 1}: ${a}`
        )
        .join("\n\n");
      const userPrompt = `User Responses:
      
${paired}

${journalContext ? `Recent Journal Context:\n${journalContext}\n-- End of Journal Context --` : ''}

Analyze the user's mental health check responses. Provide empathetic, practical insights. Be concise, warm, and actionable. Avoid diagnosis; focus on encouragement and next steps.`;
      sendMessage(userPrompt);
      setHasTriggered(true);

      const reverseIndexes = new Set([2]);
      const severities = answers.map((answer, index) => {
        const options = questions[index]?.options ?? [];
        const pos = Math.max(0, options.indexOf(answer));
        const base = Math.min(Math.max(pos, 0), 3);
        return reverseIndexes.has(index) ? 3 - base : base;
      });
      const avg = severities.reduce((a, b) => a + b, 0) / severities.length;
      const score = 3 - avg;
      const today = new Date().toISOString().split('T')[0];
      const existingScores = JSON.parse(localStorage.getItem('mentalHealthScores') || '{}');
      existingScores[today] = score;
      localStorage.setItem('mentalHealthScores', JSON.stringify(existingScores));
    }
  }, [showResults, hasTriggered, sendMessage, answers, questions, journalContext]);

  useEffect(() => {
    if (!isLoading && messages.length > 1 && !saved && user) {
      const assistantMessage = messages[1];
      const fullText = assistantMessage.parts.map(p => p.type === "text" ? p.content : "").join("");
      if (fullText) {
        saveCheckIn({
          userId: user.id,
          answers: answers,
          insight: fullText,
        });
        setSaved(true);
      }
    }
  }, [isLoading, messages, saved, saveCheckIn, user, answers]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-serif">
            Check-in Complete
          </h2>
          <Button onClick={resetQuiz} variant={"outline"} className="gap-2">
            <RotateCw className="h-4 w-4" />
            Start Over
          </Button>
        </div>

        <div className="flex flex-col gap-6">
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
            
            <div className="relative rounded-2xl border overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-background p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  AI Insights
                </h3>
              </div>

              {isLoading && !aiData && (
                <div className="flex flex-col gap-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <p className="text-sm text-muted-foreground mt-2">Analyzing your patterns...</p>
                </div>
              )}
              {aiData && (
                <div>
                  <div className="leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    <Streamdown>{aiData}</Streamdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <button onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)} className="flex items-center gap-2 mb-4 font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className={`h-4 w-4 ${isSummaryCollapsed ? '' : 'rotate-180'}`} />
              Response Summary
            </button>
            {!isSummaryCollapsed && (
              <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar">
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
            )}
          </div>
        </div>
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

      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 font-serif leading-tight">
          {questions[currentQuestion].text}
        </h2>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, idx) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-accent transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{option}</span>
                <div className="w-4 h-4 rounded-full border border-primary/30 group-hover:border-primary group-hover:bg-primary/10 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
