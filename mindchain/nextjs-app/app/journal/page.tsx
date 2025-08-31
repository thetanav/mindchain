"use client";

import { useEffect, useMemo, useState } from "react";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../../components/ui/dialog";

type JournalEntry = {
  id: string;
  content: string;
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
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function makeId() {
  try {
    const g: any =
      typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
    const uuid = g?.crypto?.randomUUID?.();
    if (uuid) return uuid;
  } catch {}
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function Page() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [draft, setDraft] = useState("");
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
      dateISO: now.toISOString().slice(0, 10),
      createdAt: now.getTime(),
    };
    setEntries((prev) => [entry, ...prev]);
    setDraft("");
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Journal</h1>
      <p className="text-muted-foreground mt-1">
        Reflect on your thoughts and feelings
      </p>

      <div className="mt-6 grid gap-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write today's thoughts…"
          className="min-h-[140px]"
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {draft.length > 0 ? `${draft.length} characters` : ""}
          </div>
          <Button onClick={handleSave} disabled={!canSave}>
            Save Note
          </Button>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Your notes</h2>
        {mounted && entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No entries yet. Your saved notes will appear here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <Dialog key={entry.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-base font-medium line-clamp-1">
                        {entry.content.split("\n")[0]}
                      </CardTitle>
                      <div>
                        <Badge variant="secondary" className="text-[10px]">
                          {formatDate(entry.dateISO)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Journal entry</DialogTitle>
                    <DialogDescription>
                      {formatDate(entry.dateISO)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">
                      {entry.content}
                    </pre>
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
