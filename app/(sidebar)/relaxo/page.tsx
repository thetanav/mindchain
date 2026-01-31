"use client";

import { useState, useEffect, useRef } from "react";
import { BreathingCircle } from "@/components/breathing-circle";
import { Timer } from "@/components/timer";
import { PhaseIndicator } from "@/components/phase-indicator";
import { StreakTracker } from "@/components/streak-tracker";
import { SessionComplete } from "@/components/session-complete";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

type BreathingPhase = "inhale" | "hold" | "exhale";

const PHASE_DURATION = 4000;
const TOTAL_SESSION_TIME = 120;
const PHASES: BreathingPhase[] = ["inhale", "hold", "exhale"];

export default function CalmRoom() {
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(TOTAL_SESSION_TIME);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const phaseTimerRef = useRef<NodeJS.Timeout>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearAllTimers = () => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastSession = localStorage.getItem("lastSession");
    const currentStreak = Number.parseInt(
      localStorage.getItem("streak") || "0",
    );

    if (lastSession !== today) {
      localStorage.setItem("lastSession", today);
      localStorage.setItem("streak", (currentStreak + 1).toString());
    }
  };

  const startPhaseTimer = () => {
    setPhaseProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setPhaseProgress((prev) =>
        Math.min(prev + 100 / (PHASE_DURATION / 100), 100),
      );
    }, 100);

    phaseTimerRef.current = setTimeout(() => {
      setCurrentPhase((prev) => {
        const currentIndex = PHASES.indexOf(prev);
        return PHASES[(currentIndex + 1) % PHASES.length];
      });
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }, PHASE_DURATION);
  };

  useEffect(() => {
    if (isActive && !isSessionComplete) {
      startPhaseTimer();

      sessionTimerRef.current = setInterval(() => {
        setSessionTime((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsSessionComplete(true);
            updateStreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return clearAllTimers;
  }, [isActive, currentPhase, isSessionComplete]);

  const handleStart = () => {
    setIsActive(true);
    setIsSessionComplete(false);
  };

  const handlePause = () => setIsActive(false);

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setPhaseProgress(0);
    setSessionTime(TOTAL_SESSION_TIME);
    setIsSessionComplete(false);
  };

  const handleNewSession = () => {
    handleReset();
    handleStart();
  };

  if (isSessionComplete) {
    return <SessionComplete onNewSession={handleNewSession} />;
  }

  return (
    <div className="relative h-full flex flex-col overflow-hidden bg-gradient-to-b from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 flex justify-between items-center p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-medium font-serif tracking-tight text-foreground/90">
            CalmRoom
          </h1>
          <StreakTracker />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="mb-12">
           <PhaseIndicator phase={currentPhase} isActive={isActive} />
        </div>

        <div className="my-8 relative">
          {/* Glow effect behind the circle */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-400/20 blur-[60px] rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
          <BreathingCircle
            phase={currentPhase}
            progress={phaseProgress}
            isActive={isActive}
          />
        </div>

        <div className="mt-8">
           <Timer timeRemaining={sessionTime} />
        </div>

        <div className="flex items-center gap-6 mt-12">
          {!isActive ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="h-16 px-10 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg font-medium bg-gradient-to-r from-blue-600 to-emerald-600 border-none"
            >
              <Play className="w-6 h-6 mr-3 fill-current" />
              Start Session
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size="lg"
              variant="secondary"
              className="h-16 px-10 rounded-full shadow-lg text-lg font-medium bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Pause className="w-6 h-6 mr-3" />
              Pause
            </Button>
          )}

          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full shadow-md border-2 border-foreground/5 hover:border-foreground/10 hover:bg-foreground/5 p-0 flex items-center justify-center"
          >
            <RotateCcw className="w-6 h-6 opacity-70" />
          </Button>
        </div>

        {!isActive && sessionTime === TOTAL_SESSION_TIME && (
          <div className="mt-12 text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              Take a moment to ground yourself.
              <br />
              <span className="font-medium text-foreground block mt-2">
                Inhale (4s) • Hold (4s) • Exhale (4s)
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
