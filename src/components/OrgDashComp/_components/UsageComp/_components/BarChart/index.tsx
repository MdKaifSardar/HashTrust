import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e42",
  "#ef4444",
  "#a21caf",
  "#0ea5e9",
];

const UsageBarChart: React.FC<{ data: any[]; typeFilter: string }> = ({
  data,
  typeFilter,
}) => (
  <div className="w-full mb-8" style={{ minHeight: 240 }}>
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data.filter((d) => typeFilter === "All" || d.type === typeFilter)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count">
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default UsageBarChart;
