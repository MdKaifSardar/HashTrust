import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
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

const UsagePieChart: React.FC<{ data: any[]; typeFilter: string }> = ({
  data,
  typeFilter,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
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
            stroke={isDark ? "#0f172a" : "#ffffff"}
            strokeWidth={2}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-pie-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            formatter={(value) => (
              <span style={{ color: isDark ? "#cbd5e1" : "#334155" }}>{value}</span>
            )}
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsagePieChart;
