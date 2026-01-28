"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Award, Clock, Coins, Sparkles, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
import SummaryPieChart from "@/components/summary-pie-chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  const [mentalHealthData, setMentalHealthData] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);
  
  // Load mental health scores from localStorage
  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem('mentalHealthScores') || '{}');
    const data = Object.entries(scores)
      .map(([date, score]) => ({ date, score: Number(score) }))
      .sort((a, b) => a.date.localeCompare(b.date));
    setMentalHealthData(data);
  }, []);
  
  // Sync user with Convex
  useEffect(() => {
    if (user) {
      storeUser({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.username || "User",
      });
    }
  }, [user, storeUser]);

  // Fetch User Data
  const userData = useQuery(api.users.get, user ? { userId: user.id } : "skip");
  const journalStats = useQuery(api.journal.getStats, user ? { userId: user.id } : "skip");

  const streak = userData?.streak || 0;
  const coins = userData?.coins || 0;
  const totalEntries = journalStats?.totalEntries || 0;

  return (
    <div className="container py-8 max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight font-serif bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {greeting}, {user?.firstName || "Friend"}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Here's an overview of your mental wellness journey.
            </p>
          </div>
          <Button asChild className="rounded-full shadow-lg hover:shadow-xl transition-all">
             <Link href="/journal">
               <Sparkles className="mr-2 h-4 w-4" />
               New Entry
             </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card h-full border-none bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Journal Streak
                </CardTitle>
                <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{streak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
                <p className="text-xs text-muted-foreground mt-1">Keep the momentum going!</p>
                <div className="mt-4">
                  <Progress value={Math.min((streak / 30) * 100, 100)} className="h-2 bg-blue-200 dark:bg-blue-900" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card h-full border-none bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Coins Earned</CardTitle>
                <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold">{coins}</div>
                  <Image src="/coin.png" alt="coins" width={24} height={24} className="animate-pulse" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Redeem for rewards soon</p>
                <div className="mt-4">
                  <Progress value={Math.min(coins / 100, 100)} className="h-2 bg-amber-200 dark:bg-amber-900" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card h-full border-none bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Total Entries
                </CardTitle>
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalEntries}</div>
                <p className="text-xs text-muted-foreground mt-1">Moments captured</p>
                <div className="mt-4">
                  <Progress value={Math.min(totalEntries * 2, 100)} className="h-2 bg-purple-200 dark:bg-purple-900" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card h-full border-none bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Expert Support
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent>
                 <div className="flex flex-col gap-2">
                    <Button asChild variant={"secondary"} size="sm" className="w-full justify-start bg-white/50 hover:bg-white/80 dark:bg-black/20">
                      <a href="https://cal.com/tanav-poswal-lvtupv" target="_blank" rel="noopener noreferrer">
                        <Calendar className="mr-2 h-3.5 w-3.5" />
                        Book Session
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground">Available slots today</p>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
         </div>

         {/* Mental Health Trends */}
         <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
           <Card className="glass-card border-none shadow-md">
             <CardHeader>
               <CardTitle>Mental Health Trends</CardTitle>
               <CardDescription>Track your daily check-in scores over time</CardDescription>
             </CardHeader>
             <CardContent className="h-[300px]">
               {mentalHealthData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={mentalHealthData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="date" />
                     <YAxis domain={[0, 3]} />
                     <Tooltip />
                     <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
                   </LineChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center">
                   <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                   <p className="text-muted-foreground">No check-in data yet.</p>
                   <p className="text-sm text-muted-foreground mt-1">Start with your first daily check-in to see trends!</p>
                   <Button asChild className="mt-4" size="sm">
                     <Link href="/check">
                       Start Check-in <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                   </Button>
                 </div>
               )}
             </CardContent>
           </Card>
         </motion.div>

         {/* Charts & Actions Section */}
        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4 glass-card border-none shadow-md">
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>Based on your recent journal entries</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <SummaryPieChart />
            </CardContent>
          </Card>

          <div className="md:col-span-3 flex flex-col gap-6">
             <Card className="glass-card border-none shadow-md flex-1 flex flex-col justify-center">
                <CardHeader>
                   <CardTitle>AI Companion</CardTitle>
                   <CardDescription>Feeling overwhelmed? Let's chat.</CardDescription>
                </CardHeader>
                <CardFooter>
                   <Button className="w-full" asChild>
                      <Link href="/chat">
                        Start Conversation <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                   </Button>
                </CardFooter>
             </Card>

             <Card className="glass-card border-none shadow-md flex-1 flex flex-col justify-center">
                <CardHeader>
                   <CardTitle>Daily Check-in</CardTitle>
                   <CardDescription>Take 2 minutes to reflect on your day.</CardDescription>
                </CardHeader>
                <CardFooter>
                   <Button variant="outline" className="w-full" asChild>
                      <Link href="/check">
                        Start Check-in <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                   </Button>
                </CardFooter>
             </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
