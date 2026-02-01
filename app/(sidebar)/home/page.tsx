"use client";

import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Award, Clock, Coins, Sparkles, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DailyQuizDialog } from "@/components/daily-quiz-dialog";
import { CheckinHeatmap } from "@/components/checkin-heatmap";
import { WellnessInfoDialog } from "@/components/wellness-info-dialog";
import { StatInfoDialog } from "@/components/stat-info-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer
} from "recharts";
import { SummaryPieChart } from "@/components/summary-pie-chart";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const mockWellnessData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    score: 1.5 + Math.random() * 1.5,
  };
});

const mockSentimentData = [
  { name: "Positive", value: 12 },
  { name: "Neutral", value: 5 },
  { name: "Negative", value: 2 },
];

const mockHeatmapData = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  const hasData = Math.random() > 0.4;
  return {
    date: date.toISOString().split("T")[0],
    intensity: hasData ? Math.floor(Math.random() * 100) : 0,
    hasData,
  };
});

export default function DashboardPage() {
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);
  const [greeting, setGreeting] = useState("Hello");
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    if (user) {
      storeUser({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.username || "User",
      });
    }
  }, [user, storeUser]);

  const userData = useQuery(api.users.get, user ? { userId: user.id } : "skip");
  const journalStats = useQuery(api.journal.getStats, user ? { userId: user.id } : "skip");
  const wellnessData = useQuery(api.checkins.getWellnessTrends, user ? { userId: user.id } : "skip");
  const sentimentData = useQuery(api.journal.getSentimentDistribution, user ? { userId: user.id } : "skip");
  const heatmapData = useQuery(api.checkins.getHeatmapData, user ? { userId: user.id } : "skip");

  const isLoading = wellnessData === undefined || heatmapData === undefined || sentimentData === undefined;

  useEffect(() => {
    if (user && isLoading && !useMockData) {
      const timer = setTimeout(() => {
        setUseMockData(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, useMockData]);

  const streak = userData && typeof userData.streak === "number" ? userData.streak : (useMockData ? 7 : 0);
  const coins = userData && typeof userData.coins === "number" ? userData.coins : (useMockData ? 45 : 0);
  const totalEntries = journalStats && typeof journalStats.totalEntries === "number" ? journalStats.totalEntries : (useMockData ? 19 : 0);
  
  const displayWellnessData = (wellnessData && wellnessData.length > 0 ? wellnessData : (useMockData ? mockWellnessData : [])) || [];
  const displaySentimentData = (sentimentData && sentimentData.filter(d => d.value > 0).length > 0 ? sentimentData : (useMockData ? mockSentimentData : [])) || [];
  const displayHeatmapData = (heatmapData && heatmapData.length > 0 ? heatmapData : (useMockData ? mockHeatmapData : [])) || [];

  return (
    <div className="min-h-screen w-full">
      <DailyQuizDialog />
      <div className="container py-8 max-w-7xl mx-auto space-y-8 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Mindchain Logo" width={60} height={60} className="w-12 h-12 md:w-16 md:h-16" />
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-serif">
                {greeting}, {user?.firstName || "Friend"}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide">
                Your mind is a garden. Let&apos;s tend to it today.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
            <Link href="/journal">
              <Sparkles className="mr-2 h-5 w-5" />
              New Entry
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Journal Streak
                </CardTitle>
                <StatInfoDialog type="streak" />
              </div>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-medium mb-1">{streak} <span className="text-sm font-sans font-normal text-muted-foreground">days</span></div>
              <Progress value={Math.min((streak / 30) * 100, 100)} className="h-1.5 mt-4" />
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Coins</CardTitle>
                <StatInfoDialog type="coins" />
              </div>
              <Coins className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-1">
                <div className="text-4xl font-serif font-medium">{coins}</div>
                <Image src="/coin.png" alt="coins" width={24} height={24} />
              </div>
              <Progress value={Math.min(coins / 100, 100)} className="h-1.5 mt-4" />
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Entries
                </CardTitle>
                <StatInfoDialog type="entries" />
              </div>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-medium mb-1">{totalEntries}</div>
              <Progress value={Math.min(totalEntries * 2, 100)} className="h-1.5 mt-4" />
            </CardContent>
          </Card>

          <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium uppercase tracking-wider">
                Expert Support
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="flex flex-col justify-end h-[calc(100%-3rem)]">
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-snug">Need to talk to someone?</p>
                <Button asChild variant="secondary" size="sm" className="w-full justify-center">
                  <a href="https://cal.com/tanav-poswal-lvtupv" target="_blank" rel="noopener noreferrer">
                    <Calendar className="mr-2 h-3.5 w-3.5" />
                    Book Session
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="font-serif text-2xl">Wellness Trends</CardTitle>
                <WellnessInfoDialog />
              </div>
              <CardDescription>Your quiz scores over time (based on daily check-ins)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="h-full w-full">
                {!isLoading && displayWellnessData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayWellnessData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 3]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="score" stroke="transparent" fill="url(#colorScore)" />
                      <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }} animationDuration={0} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : isLoading && !useMockData ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-secondary/30 rounded-xl">
                    <TrendingUp className="h-10 w-10 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground font-medium">No check-in data yet</p>
                    <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">Start your first daily check-in to unlock these insights!</p>
                    <Button asChild className="mt-4 rounded-full" size="sm" variant="outline">
                      <Link href="/check">
                        Start Check-in <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-4 flex flex-col gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Mood Mix</CardTitle>
                <CardDescription>Your recent emotional palette</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center">
                {displaySentimentData && displaySentimentData.length > 0 ? (
                  <SummaryPieChart data={displaySentimentData} />
                ) : (
                  <div className="text-center text-muted-foreground">No mood data yet.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Activity Heatmap</CardTitle>
                <CardDescription>Your daily check-in consistency</CardDescription>
              </CardHeader>
              <CardContent>
                {displayHeatmapData && displayHeatmapData.length > 0 ? (
                  <CheckinHeatmap data={displayHeatmapData} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-muted-foreground mb-2">No check-in data yet</div>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/check">
                        Start Check-in <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-lg">AI Companion</CardTitle>
                <CardDescription>Feeling overwhelmed? I&apos;m here.</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button className="w-full" asChild>
                  <Link href="/chat">
                    Start Conversation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
