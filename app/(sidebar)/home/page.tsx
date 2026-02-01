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
import dynamic from "next/dynamic";

const SummaryPieChart = dynamic(() => import("@/components/summary-pie-chart"), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-muted-foreground">Loading chart...</div>,
});

const LineChart = dynamic(() => import("recharts").then(mod => mod.LineChart), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center text-muted-foreground">Loading chart...</div>,
});
const Line = dynamic(() => import("recharts").then(mod => mod.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);
  const [greeting, setGreeting] = useState("Hello");

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

  const streak = userData?.streak || 0;
  const coins = userData?.coins || 0;
  const totalEntries = journalStats?.totalEntries || 0;
  const pieChartData = sentimentData?.filter(d => d.value > 0) || [];

  return (
    <div className="min-h-screen w-full">
      <DailyQuizDialog />
      <div className="container py-8 max-w-7xl mx-auto space-y-8 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-serif">
              {greeting}, {user?.firstName || "Friend"}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide">
              Your mind is a garden. Let&apos;s tend to it today.
            </p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Journal Streak
              </CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-serif font-medium mb-1">{streak} <span className="text-sm font-sans font-normal text-muted-foreground">days</span></div>
              <Progress value={Math.min((streak / 30) * 100, 100)} className="h-1.5 mt-4" />
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Coins</CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Entries
              </CardTitle>
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
              <CardTitle className="font-serif text-2xl">Wellness Trends</CardTitle>
              <CardDescription>Your emotional journey over time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
              {wellnessData && wellnessData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wellnessData}>
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
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-secondary/30 rounded-xl">
                  <TrendingUp className="h-10 w-10 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground font-medium">No check-in data yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">Start your first daily check-in to unlock these insights!</p>
                  <Button asChild className="mt-6 rounded-full" size="sm" variant="outline">
                    <Link href="/check">
                      Start Check-in <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="md:col-span-4 flex flex-col gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Mood Mix</CardTitle>
                <CardDescription>Your recent emotional palette</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center">
                {pieChartData.length > 0 ? (
                  <SummaryPieChart data={pieChartData} />
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
                {heatmapData && heatmapData.length > 0 ? (
                  <CheckinHeatmap data={heatmapData} />
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
