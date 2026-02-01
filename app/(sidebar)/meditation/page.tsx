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
import { Play, Pause, Timer, Sparkles, Wind, Heart } from "lucide-react";

interface Meditation {
  title: string;
  duration: number;
  description: string;
  audio: string;
  icon: typeof Sparkles;
  color: string;
}

const meditations: Meditation[] = [
  {
    title: "Mindful Breathing",
    duration: 5,
    description: "Focus on your breath to calm your mind and find inner peace.",
    audio: "/meditations/mindful-breathing.mp3",
    icon: Wind,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Body Scan",
    duration: 10,
    description: "Bring awareness to different parts of your body and release tension.",
    audio: "/meditations/body-scan.mp3",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Loving-Kindness",
    duration: 15,
    description: "Cultivate feelings of love and compassion for yourself and others.",
    audio: "/meditations/loving-kindness.mp3",
    icon: Heart,
    color: "from-rose-500 to-red-500",
  },
];

export default function MeditationPage() {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-serif flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          Guided Meditations
        </h1>
        <p className="text-muted-foreground mt-1">
          Find your inner peace with our professionally guided meditation sessions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meditations.map((meditation) => (
          <Card
            key={meditation.title}
            onClick={() => setSelectedMeditation(meditation)}
            className="cursor-pointer border-0 bg-gradient-to-br from-background to-muted/30 h-full"
          >
            <CardHeader className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meditation.color} text-white shadow-lg`}>
                  <meditation.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Timer className="w-4 h-4 mr-1" />
                  {meditation.duration} min
                </div>
              </div>
              <CardTitle className="text-lg">{meditation.title}</CardTitle>
              <CardDescription className="text-sm">
                {meditation.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="w-10 h-10 rounded-full bg-primary/10 text-primary"
              >
                <Play className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMeditation && (
        <div className="mt-8">
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedMeditation.color} text-white`}>
                  <selectedMeditation.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">{selectedMeditation.title}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {selectedMeditation.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="text-5xl font-bold font-mono">
                {Math.floor(time / 60)}:{(("0" + Math.floor(time % 60)).slice(-2))}
              </div>
              <div className="flex items-center gap-4">
                <Button size="icon" onClick={handlePlayPause} className="w-14 h-14 rounded-full">
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
