"use client";

import { useMemo, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2, Calendar, Save, PenLine, Trash2, Edit } from "lucide-react";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { postSseJson } from "@/lib/sse";

function formatDate(createdAt: number) {
  const d = new Date(createdAt);
  return d.toLocaleDateString(undefined, {
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
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [editContent, setEditContent] = useState("");

  const entries = useQuery(api.journal.getEntries, user ? { userId: user.id } : "skip");
  const createEntry = useMutation(api.journal.createEntry);
  const deleteEntry = useMutation(api.journal.deleteEntry);
  const updateEntry = useMutation(api.journal.updateEntry);

  const hasTodaysEntry = useMemo(() => {
    if (!entries || entries.length === 0) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const latestEntry = entries[0]; // Since ordered by desc, first is most recent
    return latestEntry.createdAt >= today.getTime() && latestEntry.createdAt < tomorrow.getTime();
  }, [entries]);

  const canSave = useMemo(() => draft.trim().length > 0 && !hasTodaysEntry, [draft, hasTodaysEntry]);

  const handleSave = async () => {
    if (!canSave || !user) return;

    try {
      await createEntry({
        userId: user.id,
        content: draft.trim(),
        sentiment: currentAnalysis ? "AI Reflection Included" : "Standard Entry",
        moodScore: 5, // Default or parsed from AI
      });

      setDraft("");
      setCurrentAnalysis("");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDelete = async (entryId: any) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await deleteEntry({ userId: user.id, entryId });
      } catch (error: any) {
        console.error(error);
        alert(error.message);
      }
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setEditContent(entry.content);
  };

  const handleSaveEdit = async () => {
    if (!editingEntry || !editContent.trim() || !user) return;

    try {
      await updateEntry({
        userId: user.id,
        entryId: editingEntry._id,
        content: editContent.trim(),
        sentiment: editingEntry.sentiment,
        moodScore: editingEntry.moodScore,
      });
      setEditingEntry(null);
      setEditContent("");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const isEntryEditable = (createdAt: number) => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    return createdAt > now - oneDayMs;
  };

  const analyzeEntry = async () => {
    if (!draft.trim()) return;
    setIsAnalyzing(true);
    setCurrentAnalysis("");

    try {
      const stream = postSseJson<{ type: string; content?: string }>(
        "/api/analysis",
        { prompt: draft }
      );

      let fullText = "";
      for await (const chunk of stream) {
        if (chunk.type === "text-delta") {
          fullText += chunk.content ?? "";
          setCurrentAnalysis(fullText);
        }
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
            {hasTodaysEntry && (
              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-200/50 dark:border-amber-800/50">
                <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  You've already created a journal entry today. You can only have one entry per day.
                </p>
              </div>
            )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {entries.map((entry, index) => (
              <Dialog key={entry._id}>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="cursor-pointer hover:bg-accent/40 transition-all duration-300 h-full flex flex-col hover:shadow-lg hover:-translate-y-1 group">
                      <CardHeader className="pb-3">
                        <CardDescription className="font-medium text-primary/80 group-hover:text-primary transition-colors text-md">
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
                        {isEntryEditable(entry.createdAt) && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(entry);
                              }}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(entry._id);
                              }}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
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
                    {editingEntry && editingEntry._id === entry._id ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[200px] text-lg leading-loose"
                          placeholder="Edit your journal entry..."
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setEditingEntry(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-lg leading-loose text-foreground/90">
                          {entry.content}
                        </p>
                      </div>
                    )}
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