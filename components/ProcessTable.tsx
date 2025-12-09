'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProcessInfo } from "@/lib/process";

interface ProcessTableProps {
  title: string;
  processes: ProcessInfo[];
  emptyMessage?: string;
  showMetrics?: boolean;
}

export function ProcessTable({ title, processes, emptyMessage = "No processes", showMetrics = false }: ProcessTableProps) {
  const calculateTurnaroundTime = (process: ProcessInfo) => {
    if (process.endedAt && process.createdAt) {
      return ((process.endedAt - process.createdAt) / 1000).toFixed(2);
    }
    return "N/A";
  };

  const calculateWaitingTime = (process: ProcessInfo) => {
    if (process.endedAt && process.createdAt) {
      const turnaroundTime = (process.endedAt - process.createdAt) / 1000;
      const cpuTime = process.cpuTime * 0.8; // Approximate actual CPU time in seconds
      const ioTime = process.ioTime ? process.ioTime / 1000 : 0;
      const waitingTime = turnaroundTime - cpuTime - ioTime;
      return waitingTime > 0 ? waitingTime : 0;
    }
    return 0;
  };

  const getRowColorClass = (process: ProcessInfo) => {
    if (!showMetrics) return "";
    
    const waitTime = calculateWaitingTime(process);
    if (waitTime === 0) return "";
    
    // Color gradient based on waiting time
    // 0-5s: no color, 5-10s: yellow, 10-20s: orange, 20+s: red
    if (waitTime < 5) return "";
    if (waitTime < 10) return "bg-yellow-50 hover:bg-yellow-100";
    if (waitTime < 20) return "bg-orange-50 hover:bg-orange-100";
    return "bg-red-50 hover:bg-red-100";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {processes.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                {showMetrics && (
                  <>
                    <TableHead>TAT (s)</TableHead>
                    <TableHead>WT (s)</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showMetrics ? 7 : 5} className="text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                processes.map((process) => {
                  const waitTime = calculateWaitingTime(process);
                  return (
                  <TableRow key={process.id} className={getRowColorClass(process)}>
                    <TableCell className="font-medium">{process.id}</TableCell>
                    <TableCell>{process.name}</TableCell>
                    <TableCell>{process.priority}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!showMetrics && <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(process.done / process.cpuTime) * 100}%` }}
                          />
                        </div>}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {((process.done / process.cpuTime) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          process.status === "Completed" ? "default" :
                          process.status === "Running" ? "default" :
                          process.status === "IO" ? "secondary" :
                          process.status === "Preempted" ? "destructive" :
                          process.status === "Terminated" ? "destructive" :
                          "secondary"
                        }
                      >
                        {process.status}
                      </Badge>
                    </TableCell>
                    {showMetrics && (
                      <>
                        <TableCell className="font-mono text-sm">{calculateTurnaroundTime(process)}</TableCell>
                        <TableCell className="font-mono text-sm">{waitTime.toFixed(2)}</TableCell>
                      </>
                    )}
                  </TableRow>
                );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
