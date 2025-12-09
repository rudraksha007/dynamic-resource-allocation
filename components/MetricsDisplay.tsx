'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsDisplayProps {
  avgTAT: number;
  avgWT: number;
  readyQueueLength: number;
  swappedQueueLength: number;
  completedCount: number;
}

export function MetricsDisplay({ 
  avgTAT, 
  avgWT, 
  readyQueueLength, 
  swappedQueueLength,
  completedCount 
}: MetricsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Real-Time Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg Turnaround Time</p>
            <p className="text-2xl font-bold">
              {isNaN(avgTAT) ? "N/A" : `${avgTAT.toFixed(2)}s`}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg Waiting Time</p>
            <p className="text-2xl font-bold">
              {isNaN(avgWT) ? "N/A" : `${avgWT.toFixed(2)}s`}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Ready Queue</p>
            <p className="text-2xl font-bold">{readyQueueLength}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Swapped Queue</p>
            <p className="text-2xl font-bold">{swappedQueueLength}</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-sm text-muted-foreground">Ended Processes</p>
            <p className="text-2xl font-bold">{completedCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
