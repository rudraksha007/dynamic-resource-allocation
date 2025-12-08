'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProcessInfo } from "@/lib/process";

interface ReadyQueueTableProps {
  processes: ProcessInfo[];
  runningProcess: ProcessInfo | null;
}

export function ReadyQueueTable({ processes, runningProcess }: ReadyQueueTableProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Ready Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {runningProcess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-semibold text-sm mb-2 text-green-800">Currently Running</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Process:</span> <strong>{runningProcess.name}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span> <strong>{runningProcess.priority}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Progress:</span> <strong>{((runningProcess.done / runningProcess.cpuTime) * 100).toFixed(1)}%</strong>
              </div>
              <div>
                <span className="text-muted-foreground">CPU Demand:</span> <strong>{runningProcess.cpuDemand}%</strong>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>CPU Time</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>CPU Demand</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No processes in ready queue
                  </TableCell>
                </TableRow>
              ) : (
                processes.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell className="font-medium">{process.id}</TableCell>
                    <TableCell>{process.name}</TableCell>
                    <TableCell>{process.priority}</TableCell>
                    <TableCell>{process.cpuTime}ms</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(process.done / process.cpuTime) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {((process.done / process.cpuTime) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{process.cpuDemand}%</TableCell>
                    <TableCell>
                      <Badge variant={process.status === "Waiting" ? "secondary" : "default"}>
                        {process.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
