"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const lofiChannels = [
  {
    id: "jfKfPfyJRdk",
    title: "Lofi Hip Hop Radio",
    channel: "Lofi Girl",
    subtitle: "beats to relax/study to",
    thumbnail: "https://img.youtube.com/vi/jfKfPfyJRdk/maxresdefault.jpg",
    color: "from-violet-500 to-purple-600",
    viewers: "25K watching",
  },
  {
    id: "4xDzrJKXOOY",
    title: "Coffee Shop Vibes",
    channel: "Lofi Girl",
    subtitle: "cozy autumn lo-fi beats",
    thumbnail: "https://img.youtube.com/vi/4xDzrJKXOOY/maxresdefault.jpg",
    color: "from-amber-500 to-orange-600",
    viewers: "12K watching",
  },
  {
    id: "7nos9jL0-Ys",
    title: "Night Study Beats",
    channel: "Lofi Dreamy",
    subtitle: "late night study music",
    thumbnail: "https://img.youtube.com/vi/7nos9jL0-Ys/maxresdefault.jpg",
    color: "from-blue-500 to-indigo-600",
    viewers: "8K watching",
  },
  {
    id: "h61z-bJ6M",
    title: "Peaceful Piano",
    channel: "Relaxing Music",
    subtitle: "calm piano for focus",
    thumbnail: "https://img.youtube.com/vi/h61z-bJ6M/maxresdefault.jpg",
    color: "from-teal-500 to-emerald-600",
    viewers: "5K watching",
  },
  {
    id: "hkJa4b2qTxQ",
    title: "Rainy Day Jazz",
    channel: "Jazz Vibes",
    subtitle: "smooth jazz & bossa nova",
    thumbnail: "https://img.youtube.com/vi/hkJa4b2qTxQ/maxresdefault.jpg",
    color: "from-sky-500 to-cyan-600",
    viewers: "6K watching",
  },
  {
    id: "DWcJ4R7cq0M",
    title: "Chill Beats Radio",
    channel: "Chill Music",
    subtitle: "relaxing hip hop beats",
    thumbnail: "https://img.youtube.com/vi/DWcJ4R7cq0M/maxresdefault.jpg",
    color: "from-pink-500 to-rose-600",
    viewers: "4K watching",
  },
];

export default function LofiPage() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const current = lofiChannels[currentVideo];

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="min-h-screen w-full">
      <div className="container py-8 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-500">LIVE</span>
            </div>
            <span className="text-sm text-muted-foreground">{current.viewers}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Lofi Radio
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Chill beats to relax, study, or focus
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          <motion.div 
            className="lg:col-span-8 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${current.id}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&controls=1&modestbranding=1&rel=0&playsinline=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={current.title}
              />
              
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-white font-medium">LIVE</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-4 rounded-xl bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </div>
                <a 
                  href={`https://youtube.com/watch?v=${current.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in YouTube
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-card to-card/80 border">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg`}>
                  <Radio className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{current.title}</h3>
                  <p className="text-sm text-muted-foreground">{current.channel} • {current.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="rounded-full"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Super Chat
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-4 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">More Stations</h3>
              <span className="text-xs text-muted-foreground">{lofiChannels.length} live</span>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {lofiChannels.map((video, index) => (
                <motion.button
                  key={video.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => {
                    setCurrentVideo(index);
                    setIsPlaying(true);
                  }}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                    index === currentVideo
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-md"
                      : "bg-card hover:bg-muted/50 border-border hover:border-primary/20"
                  } border`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        {index === currentVideo && isPlaying ? (
                          <div className="flex gap-0.5">
                            <motion.div 
                              className="w-0.5 bg-white rounded-full"
                              animate={{ height: [6, 12, 8, 14, 6] }}
                              transition={{ repeat: Infinity, duration: 0.5 }}
                            />
                            <motion.div 
                              className="w-0.5 bg-white rounded-full"
                              animate={{ height: [10, 6, 12, 8, 10] }}
                              transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                            />
                            <motion.div 
                              className="w-0.5 bg-white rounded-full"
                              animate={{ height: [8, 10, 6, 12, 8] }}
                              transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                            />
                          </div>
                        ) : (
                          <Play className="w-4 h-4 text-white fill-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${index === currentVideo ? "text-primary" : ""}`}>
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{video.channel}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>Live</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Listening Tips</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use headphones for the best experience</li>
                <li>• Volume at 50% for background focus</li>
                <li>• Close your eyes and breathe deeply</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
