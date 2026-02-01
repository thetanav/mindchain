"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Radio, Heart } from "lucide-react";
import { motion } from "framer-motion";

const LOFI_VIDEOS = [
  { 
    id: "jfKfPfyJRdk", 
    title: "Lofi Hip Hop Radio", 
    subtitle: "beats to relax/study to",
    channel: "Lofi Girl",
    color: "from-violet-500 to-purple-600"
  },
  { 
    id: "4xDzrJKXOOY", 
    title: "Coffee Shop Vibes", 
    subtitle: "cozy autumn lo-fi",
    channel: "Lofi Girl",
    color: "from-amber-500 to-orange-600"
  },
  { 
    id: "hkJa4b2qTxQ", 
    title: "Rainy Day Jazz", 
    subtitle: "smooth jazz & bossa nova",
    channel: "Relax Jazz",
    color: "from-sky-500 to-blue-600"
  },
  { 
    id: "7NosKcLvh4w", 
    title: "Peaceful Piano", 
    subtitle: "slow music for stress relief",
    channel: "Relax Music",
    color: "from-teal-500 to-emerald-600"
  },
];

export default function LofiPage() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const current = LOFI_VIDEOS[currentVideo];

  return (
    <div className="min-h-screen w-full">
      <div className="container py-8 max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Live Now</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Lofi Radio
          </h1>
          <p className="text-muted-foreground text-lg">
            Chill beats to relax, study, or focus
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div 
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${current.id}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&controls=1&modestbranding=1&rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={current.title}
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-white font-medium">LIVE</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-card to-card/80 border">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg`}>
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{current.title}</h3>
                  <p className="text-sm text-muted-foreground">{current.channel} • {current.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full hover:bg-muted"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">More Stations</h3>
              <span className="text-xs text-muted-foreground">{LOFI_VIDEOS.length} available</span>
            </div>
            <div className="space-y-3">
              {LOFI_VIDEOS.map((video, index) => (
                <motion.button
                  key={video.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => {
                    setCurrentVideo(index);
                    setIsPlaying(true);
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    index === currentVideo
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-md"
                      : "bg-card hover:bg-muted/50 border-border hover:border-primary/20"
                  } border`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${video.color} flex items-center justify-center flex-shrink-0 ${
                      index === currentVideo ? "ring-2 ring-primary/30" : ""
                    }`}>
                      {index === currentVideo && isPlaying ? (
                        <div className="flex gap-0.5">
                          <motion.div 
                            className="w-1 bg-white rounded-full"
                            animate={{ height: [8, 16, 10, 14, 8] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                          />
                          <motion.div 
                            className="w-1 bg-white rounded-full"
                            animate={{ height: [14, 8, 16, 10, 14] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                          />
                          <motion.div 
                            className="w-1 bg-white rounded-full"
                            animate={{ height: [10, 14, 8, 16, 10] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                          />
                        </div>
                      ) : (
                        <Play className="w-4 h-4 text-white fill-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${index === currentVideo ? "text-primary" : ""}`}>
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{video.subtitle}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Tip</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Use headphones for the best lofi experience. Close your eyes and let the beats transport you.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
