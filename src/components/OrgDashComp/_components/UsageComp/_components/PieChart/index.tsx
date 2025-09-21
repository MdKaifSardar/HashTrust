import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e42",
  "#ef4444",
  "#a21caf",
  "#0ea5e9",
];

const UsagePieChart: React.FC<{ data: any[]; typeFilter: string }> = ({
  data,
  typeFilter,
}) => (
  <div className="w-full flex justify-center" style={{ minHeight: 240 }}>
    <ResponsiveContainer width={320} height={240}>
      <PieChart>
        <Pie
          data={data.filter((d) => typeFilter === "All" || d.type === typeFilter)}
          dataKey="count"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-pie-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default UsagePieChart;
