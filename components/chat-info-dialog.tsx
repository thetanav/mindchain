"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function ChatInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            How I Use Your Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            I use your personal data to provide personalized, empathetic responses tailored to your wellness journey.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-sm">Journal Entries</p>
                <p className="text-xs text-muted-foreground">Your recent journal entries help me understand your thoughts and emotional patterns.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-sm">Daily Check-ins</p>
                <p className="text-xs text-muted-foreground">Your wellness assessments help me gauge your current mental state.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-sm">Mood & Sentiment</p>
                <p className="text-xs text-muted-foreground">Analyzed sentiment from your entries helps me understand your emotional trends.</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">Private</Badge>
              <span>Your data is never shared and is only used to improve our conversations.</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
