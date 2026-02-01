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
import { Textarea } from "@/components/ui/textarea";
import { Brain, CheckCircle2, ArrowRight } from "lucide-react";

const exercises = [
  {
    title: "Thought Record",
    description:
      "Identify and challenge your negative automatic thoughts.",
    icon: Brain,
    color: "from-blue-500 to-indigo-500",
    steps: [
      "Situation: What was the situation that led to the unpleasant emotion?",
      "Automatic Thoughts: What thoughts went through your mind?",
      "Emotions: What emotions did you feel?",
      "Evidence for: What evidence supports the hot thought?",
      "Evidence against: What evidence contradicts the hot thought?",
      "Alternative Thought: What is a more balanced or realistic thought?",
      "Outcome: How do you feel now?",
    ],
  },
  {
    title: "Behavioral Activation",
    description:
      "Increase your engagement in positive and meaningful activities.",
    icon: CheckCircle2,
    color: "from-green-500 to-emerald-500",
    steps: [
      "Activity: What is an activity you used to enjoy?",
      "Plan: When and how will you do this activity?",
      "Prediction: How much enjoyment and sense of accomplishment do you expect?",
      "Outcome: How much enjoyment and sense of accomplishment did you actually experience?",
    ],
  },
];

export default function CBTPage() {
  const [selectedExercise, setSelectedExercise] = useState<typeof exercises[0] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (step: string, value: string) => {
    setAnswers({ ...answers, [step]: value });
  };

  const handleSubmit = () => {
    console.log(answers);
  };

  const resetExercise = () => {
    setSelectedExercise(null);
    setAnswers({});
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-serif flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          CBT Exercises
        </h1>
        <p className="text-muted-foreground mt-1">
          Evidence-based techniques to challenge negative thoughts and build healthier habits
        </p>
      </div>

      {!selectedExercise ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.map((exercise) => (
            <Card
              key={exercise.title}
              onClick={() => setSelectedExercise(exercise)}
              className="cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 h-full"
            >
              <CardHeader className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${exercise.color} text-white shadow-lg w-fit mb-4`}>
                  <exercise.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{exercise.title}</CardTitle>
                <CardDescription className="text-base">
                  {exercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-center text-sm text-primary font-medium">
                  Start Exercise
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedExercise.color} text-white`}>
                <selectedExercise.icon className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl">{selectedExercise.title}</CardTitle>
            </div>
            <CardDescription className="text-base">
              {selectedExercise.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedExercise.steps.map((step) => (
              <div key={step} className="space-y-2">
                <label className="text-sm font-medium leading-relaxed">
                  {step}
                </label>
                <Textarea
                  value={answers[step] || ""}
                  onChange={(e) => handleAnswerChange(step, e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="min-h-[80px] resize-none"
                />
              </div>
            ))}
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSubmit} className="flex-1">
                Complete Exercise
              </Button>
              <Button variant="outline" onClick={resetExercise}>
                Back to Exercises
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
