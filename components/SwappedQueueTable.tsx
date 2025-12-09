'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProcessInfo } from "@/lib/process";

interface SwappedQueueTableProps {
  processes: ProcessInfo[];
}

export function SwappedQueueTable({ processes }: SwappedQueueTableProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Swapped Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>CPU Time</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>CPU Demand</TableHead>
                <TableHead>Memory Need</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No processes in swap
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
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${(process.done / process.cpuTime) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {((process.done / process.cpuTime) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{process.cpuDemand}%</TableCell>
                    <TableCell>{process.memNeed} MB</TableCell>
                    <TableCell>
                      <Badge variant={
                        process.status === "IO" ? "secondary" :
                        "outline"
                      }>
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
