"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Calendar, Save, RotateCw, PenLine } from "lucide-react";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

function formatDate(createdAt: number) {
  const d = new Date(createdAt);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Page() {
  const { user } = useUser();
  const [draft, setDraft] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const entries = useQuery(api.journal.getEntries, user ? { userId: user.id } : "skip");
  const createEntry = useMutation(api.journal.createEntry);

  const canSave = useMemo(() => draft.trim().length > 0, [draft]);

  const handleSave = async () => {
    if (!canSave || !user) return;
    
    await createEntry({
      userId: user.id,
      content: draft.trim(),
      sentiment: currentAnalysis ? "AI Reflection Included" : "Standard Entry",
      moodScore: 5, // Default or parsed from AI
    });
    
    setDraft("");
    setCurrentAnalysis("");
  };

  const analyzeEntry = async () => {
    if (!draft.trim()) return;
    setIsAnalyzing(true);
    setCurrentAnalysis("");

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: draft }),
      });

      if (!response.ok) throw new Error("Analysis failed");
      
      const reader = response.body?.getReader();
      if (!reader) return;
      
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        setCurrentAnalysis(prev => prev + text);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold tracking-tight font-serif bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Journal</h1>
        <p className="text-muted-foreground text-lg">
          Capture your thoughts, find clarity, and track your growth.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-none shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden ring-1 ring-border/50">
          <CardContent className="p-0">
             <div className="relative">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="How are you feeling right now?"
                  className="min-h-[250px] text-lg p-6 resize-none border-none focus-visible:ring-0 bg-transparent leading-relaxed placeholder:text-muted-foreground/40"
                />
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-full backdrop-blur-xs">
                  {draft.length} chars
                </div>
             </div>

             <AnimatePresence>
               {currentAnalysis && (
                 <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t bg-blue-50/50 dark:bg-blue-950/20"
                 >
                   <div className="p-6">
                      <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                         <Sparkles className="h-4 w-4" />
                         <span className="font-medium text-sm">AI Reflection</span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">{currentAnalysis}</p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="p-4 bg-muted/30 border-t flex justify-between items-center">
                <div className="flex gap-2">
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDraft("")}
                    disabled={!canSave}
                    className="text-muted-foreground hover:text-destructive"
                   >
                     Clear
                   </Button>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={analyzeEntry}
                    disabled={isAnalyzing || draft.length < 10}
                    className="bg-background shadow-sm hover:bg-accent border"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                    )}
                    {isAnalyzing ? "Reflecting..." : "AI Reflect"}
                  </Button>
                  <Button onClick={handleSave} disabled={!canSave} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-105">
                    <Save className="mr-2 h-4 w-4" />
                    Save Entry
                  </Button>
                </div>
             </div>
          </CardContent>
        </Card>
      </motion.div>

      <Separator className="my-8 opacity-50" />

      <section>
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold font-serif">Past Entries</h2>
         </div>
        {entries === undefined ? (
           <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-muted-foreground h-8 w-8" /></div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl opacity-50">
            <PenLine className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              Your journal is empty. Start writing above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry, index) => (
              <Dialog key={entry._id}>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="cursor-pointer hover:bg-accent/40 transition-all duration-300 h-full flex flex-col glass-card border-none hover:shadow-lg hover:-translate-y-1 group">
                      <CardHeader className="pb-3">
                        <CardDescription className="font-medium text-primary/80 group-hover:text-primary transition-colors">
                          {formatDate(entry.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-wrap group-hover:text-foreground/80 transition-colors">
                          {entry.content}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4 text-xs text-muted-foreground flex justify-between">
                         <span>{new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         {/* {entry.sentiment && <Badge variant="outline" className="text-[10px] font-normal">{entry.sentiment}</Badge>} */}
                      </CardFooter>
                    </Card>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto glass-card border-white/20">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">{formatDate(entry.createdAt)}</DialogTitle>
                    <DialogDescription>
                      {new Date(entry.createdAt).toLocaleTimeString()}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-8 mt-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-lg leading-loose font-serif text-foreground/90">
                        {entry.content}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}