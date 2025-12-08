'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ProcessInfo } from "@/lib/process";

interface ProcessMemoryPieChartProps {
  processes: ProcessInfo[];
  runningProcess: ProcessInfo | null;
  memoryUsed: number;
  maxMemory: number;
  title?: string;
}

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", 
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#14b8a6"
];

export function ProcessMemoryPieChart({ processes, runningProcess, memoryUsed, maxMemory, title = "Process Memory Distribution" }: ProcessMemoryPieChartProps) {
  // Combine all processes including running process
  const allProcesses = runningProcess 
    ? [runningProcess, ...processes]
    : processes;

  const data = allProcesses.map((process, index) => ({
    name: process.name,
    value: process.memNeed,
    color: COLORS[index % COLORS.length],
    id: process.id
  }));
  
  // Add free memory
  const freeMemory = maxMemory - memoryUsed;
  if (freeMemory > 0) {
    data.push({
      name: "Free Memory",
      value: freeMemory,
      color: "#9ca3af",
      id: -1
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            No processes in memory
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string, props: any) => [`${value.toFixed(0)} MB`, props.payload.name]} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
