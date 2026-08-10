"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#c6a04a", "#d4af5f", "#a9832f", "#8a6a26", "#ecd9a6", "#e2c583"];

export default function RankedBarChart({ data, dataKey, nameKey }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#26262d" horizontal={false} />
        <XAxis type="number" stroke="#86847e" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis dataKey={nameKey} type="category" stroke="#86847e" fontSize={11} tickLine={false} axisLine={false} width={110} />
        <Tooltip contentStyle={{ background: "#131317", border: "1px solid #26262d", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "rgba(198,160,74,0.06)" }} />
        <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} isAnimationActive={false}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
