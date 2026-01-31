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
import dynamic from "next/dynamic";

const SummaryPieChart = dynamic(() => import("@/components/summary-pie-chart"), {
  loading: () => <div>Loading chart...</div>,
});

const LineChart = dynamic(() => import("recharts").then(mod => ({ default: mod.LineChart })), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
});
const Line = dynamic(() => import("recharts").then(mod => ({ default: mod.Line })), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then(mod => ({ default: mod.XAxis })), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then(mod => ({ default: mod.YAxis })), {
  ssr: false,
});
const CartesianGrid = dynamic(() => import("recharts").then(mod => ({ default: mod.CartesianGrid })), {
  ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then(mod => ({ default: mod.Tooltip })), {
  ssr: false,
});
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => ({ default: mod.ResponsiveContainer })), {
  ssr: false,
});

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
    <div className="relative min-h-screen w-full overflow-hidden bg-background/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/10 blur-[100px] pointer-events-none" />
      
      <div className="container relative py-8 max-w-7xl mx-auto space-y-8 z-10 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight font-serif text-foreground">
              {greeting}, {user?.firstName || "Friend"}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide">
              Your mind is a garden. Let's tend to it today.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 bg-foreground text-background hover:bg-foreground/90">
             <Link href="/journal">
               <Sparkles className="mr-2 h-5 w-5" />
               New Entry
             </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card h-full border-none bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Journal Streak
                </CardTitle>
                <Award className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-serif font-medium mb-1">{streak} <span className="text-sm font-sans font-normal text-muted-foreground">days</span></div>
                <div className="mt-4">
                  <Progress value={Math.min((streak / 30) * 100, 100)} className="h-1.5 bg-blue-100 dark:bg-blue-950/50" indicatorClassName="bg-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card h-full border-none bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Coins Earned</CardTitle>
                <Coins className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-4xl font-serif font-medium">{coins}</div>
                  <Image src="/coin.png" alt="coins" width={24} height={24} className="animate-pulse opacity-80" />
                </div>
                <div className="mt-4">
                  <Progress value={Math.min(coins / 100, 100)} className="h-1.5 bg-amber-100 dark:bg-amber-950/50" indicatorClassName="bg-amber-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card h-full border-none bg-white/40 dark:bg-black/20 hover:bg-white/60 dark:hover:bg-black/30 transition-colors duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Total Entries
                </CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-serif font-medium mb-1">{totalEntries}</div>
                <div className="mt-4">
                  <Progress value={Math.min(totalEntries * 2, 100)} className="h-1.5 bg-purple-100 dark:bg-purple-950/50" indicatorClassName="bg-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-card h-full border-none bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30 transition-colors duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Expert Support
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent className="flex flex-col justify-end h-[calc(100%-3rem)]">
                 <div className="flex flex-col gap-3">
                    <p className="text-sm text-emerald-800/80 dark:text-emerald-200/80 leading-snug">Need to talk to someone?</p>
                    <Button asChild variant={"secondary"} size="sm" className="w-full justify-center bg-white hover:bg-white/90 dark:bg-emerald-900/50 dark:hover:bg-emerald-900/70 shadow-sm text-emerald-900 dark:text-emerald-100 font-medium">
                      <a href="https://cal.com/tanav-poswal-lvtupv" target="_blank" rel="noopener noreferrer">
                        <Calendar className="mr-2 h-3.5 w-3.5" />
                        Book Session
                      </a>
                    </Button>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
         </div>

         {/* Main Content Grid */}
         <div className="grid gap-6 md:grid-cols-12">
            {/* Mental Health Trends - Large Card */}
           <motion.div className="md:col-span-8" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
             <Card className="glass-card border-none shadow-sm h-full flex flex-col">
               <CardHeader>
                 <CardTitle className="font-serif text-2xl">Wellness Trends</CardTitle>
                 <CardDescription>Your emotional journey over time</CardDescription>
               </CardHeader>
               <CardContent className="flex-1 min-h-[300px]">
                 {mentalHealthData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={mentalHealthData}>
                       <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                       <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis domain={[0, 3]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                       <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '4 4' }}
                       />
                       <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6 }}
                       />
                     </LineChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-secondary/30 rounded-xl border border-dashed border-secondary-foreground/20">
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
           </motion.div>

           {/* Side Column */}
           <div className="md:col-span-4 flex flex-col gap-6">
              {/* Mood Distribution */}
              <Card className="glass-card border-none shadow-sm flex-1">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Mood Mix</CardTitle>
                  <CardDescription>Your recent emotional palette</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <SummaryPieChart />
                </CardContent>
              </Card>

              {/* Action Cards */}
               <Card className="glass-card border-none shadow-sm bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10">
                  <CardHeader className="pb-2">
                     <CardTitle className="font-serif text-lg">AI Companion</CardTitle>
                     <CardDescription>Feeling overwhelmed? I'm here.</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                     <Button className="w-full shadow-md bg-indigo-600 hover:bg-indigo-700 text-white border-none" asChild>
                        <Link href="/chat">
                          Start Conversation <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                     </Button>
                  </CardFooter>
               </Card>

               <Card className="glass-card border-none shadow-sm">
                  <CardHeader className="pb-2">
                     <CardTitle className="font-serif text-lg">Daily Check-in</CardTitle>
                     <CardDescription>Reflect on your day in 2 mins.</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                     <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
                        <Link href="/check">
                          Begin Check-in <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                     </Button>
                  </CardFooter>
               </Card>
           </div>
         </div>
      </motion.div>
      </div>
    </div>
  );
}
