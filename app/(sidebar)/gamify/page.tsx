
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Medal, Trophy, Zap } from "lucide-react";

export default function Gamify() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Gamify</h1>
      <p className="text-muted-foreground">
        Stay motivated on your mental wellness journey with our gamified
        experience.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Points
            </CardTitle>
            <CardDescription>
              Earn points for completing activities and check-ins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,250</div>
            <p className="text-sm text-muted-foreground">
              +50 points today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-blue-500" />
              Badges
            </CardTitle>
            <CardDescription>
              Unlock badges for achieving milestones.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Trophy className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-xs">Mindful Master</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <Trophy className="h-6 w-6 text-gray-500" />
              </div>
              <span className="text-xs">Journaling Pro</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <Trophy className="h-6 w-6 text-gray-500" />
              </div>
              <span className="text-xs">Meditation Mogul</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              See how you stack up against the community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-bold">1.</div>
                <div>You</div>
              </div>
              <div className="font-bold">1,250 pts</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-bold">2.</div>
                <div>Alex</div>
              </div>
              <div>1,100 pts</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-bold">3.</div>
                <div>Sarah</div>
              </div>
              <div>950 pts</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Quests</CardTitle>
          <CardDescription>
            Complete these tasks to earn extra points.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Mindful Moment</div>
              <div className="text-sm text-muted-foreground">
                Complete a 5-minute breathing exercise.
              </div>
            </div>
            <div className="text-lg font-bold text-green-500">+25 pts</div>
          </div>
          <Progress value={20} className="w-full" />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Journal Entry</div>
              <div className="text-sm text-muted-foreground">
                Write a journal entry about your day.
              </div>
            </div>
            <div className="text-lg font-bold text-green-500">+50 pts</div>
          </div>
          <Progress value={0} className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
