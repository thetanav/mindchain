"use client";

import { useEffect, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Sparkles, Loader2, Calendar } from "lucide-react";

type JournalEntry = {
  id: string;
  content: string;
  analysis?: string;
  dateISO: string; // YYYY-MM-DD for display/grouping
  createdAt: number; // epoch ms
};

const STORAGE_KEY = "journalEntries:v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function makeId() {
  try {
    const g: any =
      typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
    const uuid = g?.crypto?.randomUUID?.();
    if (uuid) return uuid;
  } catch { }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function Page() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const data = safeParse<JournalEntry[]>(
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null,
      []
    );
    // sort newest first
    data.sort((a, b) => b.createdAt - a.createdAt);
    setEntries(data);
    setMounted(true);
  }, []);

  // Persist to localStorage when entries change
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore storage errors
    }
  }, [entries, mounted]);

  const canSave = useMemo(() => draft.trim().length > 0, [draft]);

  const handleSave = () => {
    if (!canSave) return;
    const now = new Date();
    const entry: JournalEntry = {
      id: makeId(),
      content: draft.trim(),
      analysis: currentAnalysis,
      dateISO: now.toISOString().slice(0, 10),
      createdAt: now.getTime(),
    };
    setEntries((prev) => [entry, ...prev]);
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
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        const lines = chunkValue.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.textDelta) {
                setCurrentAnalysis((prev) => prev + parsed.textDelta);
              } else if (typeof parsed === 'string') {
                setCurrentAnalysis((prev) => prev + parsed);
              }
            } catch (e) { }
          }
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-serif">Journal</h1>
        <p className="text-muted-foreground">
          Capture your thoughts, find clarity.
        </p>
      </div>

      <div className="grid gap-4">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="How are you feeling today?"
          className="min-h-[200px] text-lg p-4 resize-y"
        />

        {currentAnalysis && (
          <Alert className="bg-primary/5 border-primary/20">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>AI Reflection</AlertTitle>
            <AlertDescription className="mt-2 whitespace-pre-wrap leading-relaxed">
              {currentAnalysis}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {draft.length > 0 ? `${draft.length} characters` : ""}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={analyzeEntry}
              disabled={isAnalyzing || draft.length < 10}
            >
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analyze
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              Save Note
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <section>
        {mounted && entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Your journal is empty. Start writing above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <Dialog key={entry.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-full flex flex-col">
                    <CardHeader>
                      <CardDescription>
                        {formatDate(entry.dateISO)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </CardContent>
                    {entry.analysis && (
                      <CardFooter>
                        <Badge variant="secondary" className="gap-1">
                          <Sparkles className="h-3 w-3" /> AI Analyzed
                        </Badge>
                      </CardFooter>
                    )}
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{formatDate(entry.dateISO)}</DialogTitle>
                    <DialogDescription>
                      Journal Entry
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-base leading-relaxed">
                        {entry.content}
                      </p>
                    </div>
                    {entry.analysis && (
                      <Alert className="bg-muted">
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>AI Reflection</AlertTitle>
                        <AlertDescription className="mt-2 whitespace-pre-wrap">
                          {entry.analysis}
                        </AlertDescription>
                      </Alert>
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