'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

interface PieChartProps {
  title: string;
  used: number;
  total: number;
  unit?: string;
}

export function PieChart({ title, used, total, unit = "MB" }: PieChartProps) {
  const available = total - used;
  const data = [
    { name: "Used", value: used, color: "#ef4444" },
    { name: "Available", value: available, color: "#22c55e" }
  ];

  const percentage = ((used / total) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(0)} ${unit}`} />
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">
            {used.toFixed(0)} / {total} {unit} ({percentage}%)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
