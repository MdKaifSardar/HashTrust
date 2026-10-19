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
import { useTheme } from "@/context/ThemeContext";

const COLORS = [
  "#38bdf8",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#c084fc",
  "#818cf8",
];

const UsageBarChart: React.FC<{ data: any[]; typeFilter: string }> = ({
  data,
  typeFilter,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full mb-8" style={{ minHeight: 240 }}>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data.filter((d) => typeFilter === "All" || d.type === typeFilter)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
          <XAxis
            dataKey="type"
            stroke={isDark ? "#94a3b8" : "#64748b"}
            tick={{ fill: isDark ? "#94a3b8" : "#64748b" }}
          />
          <YAxis
            allowDecimals={false}
            stroke={isDark ? "#94a3b8" : "#64748b"}
            tick={{ fill: isDark ? "#94a3b8" : "#64748b" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              borderColor: isDark ? "#334155" : "#e2e8f0",
              color: isDark ? "#f8fafc" : "#0f172a",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageBarChart;
