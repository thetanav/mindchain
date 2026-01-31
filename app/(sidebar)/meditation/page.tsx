
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
import { Play, Pause, Timer } from "lucide-react";

const meditations = [
  {
    title: "Mindful Breathing",
    duration: 5,
    description: "Focus on your breath to calm your mind.",
    audio: "/meditations/mindful-breathing.mp3",
  },
  {
    title: "Body Scan",
    duration: 10,
    description: "Bring awareness to different parts of your body.",
    audio: "/meditations/body-scan.mp3",
  },
  {
    title: "Loving-Kindness",
    duration: 15,
    description: "Cultivate feelings of love and compassion.",
    audio: "/meditations/loving-kindness.mp3",
  },
];

export default function Meditation() {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Guided Meditations</h1>
      <p className="text-muted-foreground">
        Find a moment of peace with our guided meditations.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {meditations.map((meditation) => (
          <Card
            key={meditation.title}
            onClick={() => setSelectedMeditation(meditation)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{meditation.title}</CardTitle>
              <CardDescription>{meditation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <span>{meditation.duration} min</span>
                </div>
                <Button size="icon" variant="ghost">
                  <Play className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMeditation && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedMeditation.title}</CardTitle>
            <CardDescription>
              {selectedMeditation.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="text-4xl font-bold">
              {Math.floor(time / 60)}:
              {("0" + Math.floor(time % 60)).slice(-2)}
            </div>
            <div className="flex items-center gap-4">
              <Button size="icon" onClick={handlePlayPause}>
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
