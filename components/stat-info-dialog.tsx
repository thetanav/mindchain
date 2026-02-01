"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface StatInfoDialogProps {
  type: "streak" | "coins" | "entries";
}

export function StatInfoDialog({ type }: StatInfoDialogProps) {
  const content = {
    streak: {
      title: "Journal Streak",
      icon: "🔥",
      description: "Your consecutive days of journaling. Every day you write an entry, your streak increases.",
      howToIncrease: "Write at least one journal entry every day to maintain and grow your streak.",
    },
    coins: {
      title: "Coins",
      icon: "🪙",
      description: "Earn coins by completing wellness activities. Use them to unlock rewards and features.",
      howToIncrease: "Earn coins by writing journal entries (+5), completing check-ins (+5), maintaining streaks, and participating in challenges.",
    },
    entries: {
      title: "Journal Entries",
      icon: "📝",
      description: "Total number of journal entries you've written. Each entry helps track your emotional patterns.",
      howToIncrease: "Write about your thoughts, feelings, and experiences. The more consistent you are, the better insights you'll receive.",
    },
  };

  const data = content[type];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <Info className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{data.icon}</span>
            {data.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{data.description}</p>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-medium text-sm mb-1">How to Increase</p>
            <p className="text-xs text-muted-foreground">{data.howToIncrease}</p>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <p className="font-medium text-sm text-blue-600 dark:text-blue-400">Privacy Note</p>
            <p className="text-xs text-muted-foreground mt-1">Your data is private and never shared. It's used only to provide personalized insights.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
