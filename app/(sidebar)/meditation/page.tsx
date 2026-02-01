"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Timer, Sparkles, Wind, Heart, Volume2, VolumeX, RefreshCw, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Meditation {
  title: string;
  duration: number;
  description: string;
  icon: typeof Sparkles;
  color: string;
  youtubeId: string;
}

const meditations: Meditation[] = [
  {
    title: "Mindful Breathing",
    duration: 5,
    description: "Focus on your breath to calm your mind and find inner peace.",
    icon: Wind,
    color: "from-blue-500 to-cyan-500",
    youtubeId: "UfcAVejslrU",
  },
  {
    title: "Body Scan",
    duration: 10,
    description: "Bring awareness to different parts of your body and release tension.",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    youtubeId: "5jca-sWgemI",
  },
  {
    title: "Loving-Kindness",
    duration: 15,
    description: "Cultivate feelings of love and compassion for yourself and others.",
    icon: Heart,
    color: "from-rose-500 to-red-500",
    youtubeId: "Gqfk5sr9fpw",
  },
];

export default function MeditationPage() {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(5);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && time < duration * 60) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev >= duration * 60 - 1) {
            setIsPlaying(false);
            return duration * 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, time, duration]);

  useEffect(() => {
    if (selectedMeditation) {
      setDuration(selectedMeditation.duration);
      setTime(0);
      setIsPlaying(false);
    }
  }, [selectedMeditation]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (iframeRef.current) {
      const command = isPlaying ? "pauseVideo" : "playVideo";
      (iframeRef.current as any).contentWindow?.postMessage(
        `{"event":"command","func":"${command}","args":""}`,
        "*"
      );
    }
  };

  const handleReset = () => {
    setTime(0);
    setIsPlaying(false);
    if (iframeRef.current) {
      (iframeRef.current as any).contentWindow?.postMessage(
        '{"event":"command","func":"seekTo","args":[0]}',
        "*"
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (time / (duration * 60)) * 100;

  return (
    <div className="container py-8 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight font-serif flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          Guided Meditations
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Find your inner peace with our guided meditation sessions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {meditations.map((meditation, index) => (
          <motion.div
            key={meditation.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              key={meditation.title}
              onClick={() => setSelectedMeditation(meditation)}
              className={`cursor-pointer border-0 bg-gradient-to-br from-card to-card/50 h-full transition-all duration-300 hover:shadow-xl ${
                selectedMeditation?.title === meditation.title
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <CardHeader className="relative">
                {selectedMeditation?.title === meditation.title && (
                  <div className="absolute top-4 right-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${meditation.color} text-white shadow-lg`}>
                    <meditation.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    <Timer className="w-4 h-4 mr-1" />
                    {meditation.duration} min
                  </div>
                </div>
                <CardTitle className="text-xl font-serif">{meditation.title}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {meditation.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${meditation.color} flex items-center justify-center shadow-lg`}>
                  <Play className="w-5 h-5 text-white fill-white ml-1" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedMeditation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden">
            <div className="aspect-video w-full">
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedMeditation.youtubeId}?enablejsapi=1&mute=0&autoplay=${
                  isPlaying ? 1 : 0
                }&loop=1&controls=1&modestbranding=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedMeditation.title}
                className="w-full h-full"
              />
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedMeditation.color} text-white`}>
                    <selectedMeditation.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedMeditation.title}</CardTitle>
                    <CardDescription>{selectedMeditation.description}</CardDescription>
                  </div>
                </div>
                <a
                  href={`https://youtube.com/watch?v=${selectedMeditation.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  YouTube
                </a>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {formatTime(time)} / {formatTime(duration * 60)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="rounded-full"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/25"
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7" />
                  ) : (
                    <Play className="h-7 w-7 fill-white ml-1" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <div className="flex justify-center gap-2 text-sm text-muted-foreground">
                <span>Click play when you're ready to begin</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
