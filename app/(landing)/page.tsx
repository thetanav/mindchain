"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Brain, Users, MessageCircle, PenTool, Wind, Activity, Heart, Music, Zap, BookOpen, CheckCircle, Trophy, Sparkles, Flame, Bot, ListChecks, Gamepad2 } from "lucide-react";
import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

const features = [
  {
    icon: Bot,
    title: "AI Companion",
    description: "Chat with an empathetic AI that remembers your journal entries and provides personalized support.",
    href: "/chat",
    color: "from-blue-500 to-indigo-600",
    hrefLabel: "Chat Now",
  },
  {
    icon: PenTool,
    title: "Smart Journal",
    description: "Record thoughts and feelings with AI-powered sentiment analysis and emotional pattern insights.",
    href: "/journal",
    color: "from-emerald-500 to-teal-600",
    hrefLabel: "Start Writing",
  },
  {
    icon: Music,
    title: "Lofi Radio",
    description: "Chill beats to relax, study, or focus. Curated lofi streams for your productivity.",
    href: "/lofi",
    color: "from-purple-500 to-pink-600",
    hrefLabel: "Listen Now",
  },
  {
    icon: Wind,
    title: "Calm Room",
    description: "Guided breathing exercises, focus timers, and streak tracking for relaxation habits.",
    href: "/relaxo",
    color: "from-cyan-500 to-blue-600",
    hrefLabel: "Relax",
  },
  {
    icon: CheckCircle,
    title: "Daily Check-in",
    description: "Quick wellness assessments with AI insights to monitor your mental health.",
    href: "/check",
    color: "from-amber-500 to-orange-600",
    hrefLabel: "Check In",
  },
  {
    icon: Heart,
    title: "Meditation",
    description: "Guided meditation sessions for stress relief and mindfulness practice.",
    href: "/meditation",
    color: "from-rose-500 to-pink-600",
    hrefLabel: "Meditate",
  },
  {
    icon: Brain,
    title: "CBT Exercises",
    description: "Cognitive Behavioral Therapy techniques to reframe negative thoughts.",
    href: "/cbt",
    color: "from-violet-500 to-purple-600",
    hrefLabel: "Practice",
  },
  {
    icon: Trophy,
    title: "Challenges",
    description: "Join wellness challenges, build streaks, and earn rewards for healthy habits.",
    href: "/challenges",
    color: "from-amber-500 to-yellow-600",
    hrefLabel: "Join Now",
  },
  {
    icon: ListChecks,
    title: "Task Manager",
    description: "Organize your day with built-in todos to reduce stress and increase productivity.",
    href: "/todo",
    color: "from-slate-500 to-gray-600",
    hrefLabel: "Organize",
  },
  {
    icon: Activity,
    title: "Mood Tracking",
    description: "Visualize emotional trends with interactive charts tracking mood, anxiety, and sleep.",
    href: "/home",
    color: "from-green-500 to-emerald-600",
    hrefLabel: "View Stats",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with peers in support groups for anxiety, depression, mindfulness and more.",
    href: "/community",
    color: "from-sky-500 to-cyan-600",
    hrefLabel: "Connect",
  },
  {
    icon: Gamepad2,
    title: "Wellness Games",
    description: "Fun mini-games designed to improve focus, memory, and emotional awareness.",
    href: "/games",
    color: "from-red-500 to-rose-600",
    hrefLabel: "Play",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative flex flex-col items-center justify-center px-4 py-28 md:py-36 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/30 via-background to-background dark:from-indigo-950/20 dark:via-background dark:to-background" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto space-y-8 z-10"
        >
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Mindchain Logo" width={100} height={100} className="w-24 h-24 md:w-32 md:h-32" />
          </div>



          <h1 className={`text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 ${serif.className}`}>
            Your Mind, <br />
            <span className="text-foreground">Your Way</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
            A complete wellness companion with AI support, mood tracking, meditation,
            and community features—all designed to help you thrive.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-8 h-12 text-base shadow-lg shadow-indigo-500/25" asChild>
              <Link href="/home">
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Enter Mindchain
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base" asChild>
              <Link href="#features">
                <ArrowDown className="mr-2 h-5 w-5" />
                Explore Features
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Daily Streaks</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>AI Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Gamified Goals</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-24 px-4 bg-muted/30" id="features">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${serif.className}`}>
              Everything for Your Wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tools and features thoughtfully designed to support your mental health journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={feature.href}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 bg-card/50 backdrop-blur">
                    <CardHeader className="pb-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">
                        {feature.description}
                      </p>
                      <span className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${feature.color} group-hover:underline`}>
                        {feature.hrefLabel} →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${serif.className}`}>
              Start Your Wellness Journey Today
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of others who have found clarity, balance, and support through Mindchain's comprehensive tools.
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-10 h-14 text-lg font-semibold shadow-2xl" asChild>
              <Link href="/home">
                Get Started Free
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
