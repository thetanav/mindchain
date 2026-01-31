
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

const exercises = [
  {
    title: "Thought Record",
    description:
      "Identify and challenge your negative automatic thoughts.",
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
    steps: [
      "Activity: What is an activity you used to enjoy?",
      "Plan: When and how will you do this activity?",
      "Prediction: How much enjoyment and sense of accomplishment do you expect?",
      "Outcome: How much enjoyment and sense of accomplishment did you actually experience?",
    ],
  },
];

export default function CBT() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (step, value) => {
    setAnswers({ ...answers, [step]: value });
  };

-   "Evidence against: What evidence contradicts the hot thought?",
-   "Alternative Thought: What is a more balanced or realistic thought?",
-   "Outcome: How do you feel now?",
- ],
-},
- {
- title: "Behavioral Activation",
- description:
- "Increase your engagement in positive and meaningful activities.",
- steps: [
- "Activity: What is an activity you used to enjoy?",
- "Plan: When and how will you do this activity?",
- "Prediction: How much enjoyment and sense of accomplishment do you expect?",
- "Outcome: How much enjoyment and sense of accomplishment did you actually experience?",
- ],
- },
-];
-
-export default function CBT() {
- const [selectedExercise, setSelectedExercise] = useState(null);
- const [answers, setAnswers] = useState({});
-
- const handleAnswerChange = (step, value) => {
- setAnswers({ ...answers, [step]: value });
- };
-
  const handleSubmit = () => {
    // Save answers to the database
    console.log(answers);
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">CBT Exercises</h1>
      <p className="text-muted-foreground">
        Challenge negative thoughts and build healthier habits.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <Card
            key={exercise.title}
            onClick={() => setSelectedExercise(exercise)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{exercise.title}</CardTitle>
              <CardDescription>{exercise.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedExercise && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedExercise.title}</CardTitle>
            <CardDescription>
              {selectedExercise.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedExercise.steps.map((step) => (
              <div key={step}>
                <label className="text-sm font-medium">{step}</label>
                <Textarea
                  value={answers[step] || ""}
                  onChange={(e) => handleAnswerChange(step, e.target.value)}
                  className="mt-1"
                />
              </div>
            ))}
            <Button onClick={handleSubmit}>Complete Exercise</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
