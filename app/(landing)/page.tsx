"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Brain, Users, MessageCircle, PenTool, Wind, Activity } from "lucide-react";
import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { AnimatedGradient } from "@/components/animated-gradient";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripedPattern } from "@/components/magicui/striped-pattern";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-28 md:py-36 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="flex items-center w-full justify-center">
            <AnimatedGradient />
          </div>
          <h1
            className={
              "text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 " +
              serif.className
            }
          >
            Real Tools for <br />
            <span className="text-blue-600">Mental Wellness</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
            A complete suite of tools to support your journey. From AI-powered conversations to guided breathing and mood tracking, we're here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 text-base" asChild>
              <Link href="/chat">
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Start Your Journey
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base" asChild>
              <Link href="#tools">
                <ArrowDown className="mr-2 h-5 w-5" />
                Explore Tools
              </Link>
            </Button>
          </div>
        </motion.div>

        <StripedPattern className="[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] -z-10 opacity-40" />
      </section>

      {/* Tools Section */}
      <section className="py-24 px-4 bg-muted/30" id="tools">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${serif.className}`}>Everything You Need</h2>
            <p className="text-lg text-muted-foreground">Comprehensive features designed for your well-being</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="p-3 w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">AI Companion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Chat with an empathetic AI that remembers your journal entries and provides personalized support based on your context.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="p-3 w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <PenTool className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Smart Journaling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Record your thoughts and feelings. Our system analyzes your entries to help you understand your emotional patterns over time.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="p-3 w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Wind className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Calm Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access guided breathing exercises, focus timers, and streak tracking to build healthy relaxation habits.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="p-3 w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Community Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join specialized support groups for Anxiety, Depression, Mindfulness, and more to connect with peers who understand.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="p-3 w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Health Check-ins</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Take regular mental health assessments to monitor your well-being and receive AI-generated insights and recommendations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="p-3 w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Mood Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualize your emotional journey with interactive charts that track mood, anxiety, and sleep quality over time.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-blue-600 text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${serif.className}`}>
            Ready to Prioritize Your Mind?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of others who have found clarity and support through MindChain.
          </p>
          <Button size="lg" variant="secondary" className="rounded-full px-8 h-12 text-blue-700 font-semibold" asChild>
            <Link href="/chat">
              Get Started Now
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
