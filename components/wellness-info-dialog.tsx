"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function WellnessInfoDialog() {
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
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Wellness Score Insights
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your wellness score is calculated from your daily check-ins and reflects your overall mental health.
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium text-sm mb-2">Score Range (0-3)</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>2.5 - 3.0: Excellent mental wellness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>1.5 - 2.5: Good mental wellness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>0.75 - 1.5: Fair - room for improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>0 - 0.75: Consider reaching out for support</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <p className="font-medium text-sm text-blue-600 dark:text-blue-400">How to Improve Your Score</p>
              <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                <li>• Complete daily check-ins honestly</li>
                <li>• Write journal entries regularly</li>
                <li>• Practice mindfulness and meditation</li>
                <li>• Maintain consistent sleep patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
