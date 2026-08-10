"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FORMATTERS = {
  number: (v) => v,
  lakh: (v) => `₹${Math.round(v / 100000)}L`,
};

export default function TrendChart({ data, dataKey, xKey, color = "#c6a04a", format = "number" }) {
  const formatValue = FORMATTERS[format] || FORMATTERS.number;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#26262d" vertical={false} />
        <XAxis dataKey={xKey} stroke="#86847e" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#86847e" fontSize={11} tickLine={false} axisLine={false} width={48} tickFormatter={formatValue} />
        <Tooltip
          contentStyle={{ background: "#131317", border: "1px solid #26262d", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#f2f1ee" }}
          formatter={(value) => [formatValue(value), ""]}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#fill-${dataKey})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
