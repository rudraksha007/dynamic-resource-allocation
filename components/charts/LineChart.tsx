'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartesianGrid, Legend, Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DataPoint {
  timestamp: number;
  value: number;
}

interface LineChartProps {
  title: string;
  memoryData: DataPoint[];
  swapData: DataPoint[];
  cpuData: DataPoint[];
  maxMemory: number;
  maxSwap: number;
}

export function LineChart({ title, memoryData, swapData, cpuData, maxMemory, maxSwap }: LineChartProps) {
  // Combine all data points by timestamp
  const timestamps = new Set([
    ...memoryData.map(d => d.timestamp),
    ...swapData.map(d => d.timestamp),
    ...cpuData.map(d => d.timestamp)
  ]);

  const data = Array.from(timestamps).sort((a, b) => a - b).map(timestamp => {
    const memory = memoryData.find(d => d.timestamp === timestamp)?.value || 0;
    const swap = swapData.find(d => d.timestamp === timestamp)?.value || 0;
    const cpu = cpuData.find(d => d.timestamp === timestamp)?.value || 0;
    
    return {
      time: new Date(timestamp).toLocaleTimeString(),
      memory: (memory / maxMemory) * 100,
      swap: (swap / maxSwap) * 100,
      cpu
    };
  });

  // Keep only last 20 data points for readability
  const displayData = data.slice(-20);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Legend />
            <Line type="monotone" dataKey="memory" stroke="#3b82f6" name="Memory (%)" strokeWidth={2} />
            <Line type="monotone" dataKey="swap" stroke="#f59e0b" name="Swap (%)" strokeWidth={2} />
            <Line type="monotone" dataKey="cpu" stroke="#8b5cf6" name="CPU (%)" strokeWidth={2} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
