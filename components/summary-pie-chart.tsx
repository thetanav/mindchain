"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";

type Slice = {
  name: string;
  value: number;
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

function TooltipContent({ active, payload }: any) {
  if (active && payload && payload.length) {
    const { name, value, fill } = payload[0];
    return (
      <div className="rounded-md border bg-background p-2 text-sm shadow-sm">
        <div className="font-medium" style={{ color: fill }}>
          {name}: {value}
        </div>
      </div>
    );
  }
  return null;
}

export function SummaryPieChart({ data }: { data: Slice[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <RechartsTooltip content={<TooltipContent />} />
        <RechartsLegend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default SummaryPieChart;
