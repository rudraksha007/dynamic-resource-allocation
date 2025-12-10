'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DataPoint {
  timestamp: number;
  value: number;
}

interface ThroughputChartProps {
  throughputData: DataPoint[];
}

export function ThroughputChart({ throughputData }: ThroughputChartProps) {
  const data = throughputData.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    throughput: d.value
  }));

  // Keep only last 50 data points
  const displayData = data.slice(-50);

  const maxValue = Math.max(...displayData.map(d => d.throughput), 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Throughput Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, maxValue * 1.1]} />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Line type="monotone" dataKey="throughput" stroke="#3b82f6" name="Throughput (proc/min)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface WaitTimeChartProps {
  avgTatData: DataPoint[];
  avgWtData: DataPoint[];
}

export function WaitTimeChart({ avgTatData, avgWtData }: WaitTimeChartProps) {
  // Combine data points by timestamp
  const timestamps = new Set([
    ...avgTatData.map(d => d.timestamp),
    ...avgWtData.map(d => d.timestamp)
  ]);

  const data = Array.from(timestamps).sort((a, b) => a - b).map(timestamp => {
    const avgTat = avgTatData.find(d => d.timestamp === timestamp)?.value || 0;
    const avgWt = avgWtData.find(d => d.timestamp === timestamp)?.value || 0;
    
    return {
      time: new Date(timestamp).toLocaleTimeString(),
      avgTat,
      avgWt
    };
  });

  // Keep only last 50 data points
  const displayData = data.slice(-50);

  const maxValue = Math.max(
    ...displayData.map(d => Math.max(d.avgTat, d.avgWt)),
    10
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Wait Time Metrics Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, maxValue * 1.1]} />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Line type="monotone" dataKey="avgTat" stroke="#f59e0b" name="Avg TAT (s)" strokeWidth={2} />
            <Line type="monotone" dataKey="avgWt" stroke="#8b5cf6" name="Avg WT (s)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
