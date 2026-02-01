"use client";

import { useMemo } from "react";

interface HeatmapData {
  date: string;
  intensity: number;
  hasData: boolean;
}

interface CheckinHeatmapProps {
  data: HeatmapData[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getIntensityColor(intensity: number): string {
  if (intensity === 0) return "bg-muted/30";
  if (intensity <= 25) return "bg-emerald-500/20";
  if (intensity <= 50) return "bg-emerald-500/40";
  if (intensity <= 75) return "bg-emerald-500/60";
  return "bg-emerald-500";
}

export function CheckinHeatmap({ data }: CheckinHeatmapProps) {
  const weeks = useMemo(() => {
    if (data.length === 0) return [];

    const result: (HeatmapData | null)[][] = [];
    let currentWeek: (HeatmapData | null)[] = [];

    data.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();

      if (index === 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push(null);
        }
      }

      currentWeek.push(day);

      if (dayOfWeek === 6 || index === data.length - 1) {
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    return result;
  }, [data]);

  const totalCheckins = data.filter((d) => d.hasData).length;
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].hasData) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [data]);

  const averageIntensity = useMemo(() => {
    const withData = data.filter((d) => d.hasData);
    if (withData.length === 0) return 0;
    const sum = withData.reduce((acc, d) => acc + d.intensity, 0);
    return Math.round(sum / withData.length);
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Check-in Activity</h3>
          <p className="text-sm text-muted-foreground">Last 90 days</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-muted/30" />
            <span className="text-muted-foreground">0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-500/20" />
            <span className="text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-muted-foreground">High</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          <div className="flex flex-col gap-1 pt-6">
            {days.map((day, i) => (
              <div key={day} className="h-3 text-xs text-muted-foreground">
                {i % 2 === 0 ? day : ""}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                  }

                  const date = new Date(day.date);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm cursor-pointer ${getIntensityColor(
                        day.intensity
                      )} ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
                      title={`${formatDate(day.date)}: ${day.hasData ? `${day.intensity}%` : "No check-in"}`}
                    />
                  );
                })}

                {weekIndex % 4 === 0 && (
                  <div className="h-3 text-xs text-muted-foreground -mt-1">
                    {months[new Date(week[6]?.date || Date.now()).getMonth()]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold">{totalCheckins}</p>
            <p className="text-xs text-muted-foreground">Total Check-ins</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{averageIntensity}%</p>
            <p className="text-xs text-muted-foreground">Avg. Wellness</p>
          </div>
        </div>
      </div>
    </div>
  );
}
