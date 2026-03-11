"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TransactionsChart({ data }: { data: Array<{ date: string; value: number }> }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="#bae6fd" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
