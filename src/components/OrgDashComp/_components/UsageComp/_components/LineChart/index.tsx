import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

const UsageLineChart: React.FC<{ data: any[] }> = ({ data }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full mb-8" style={{ minHeight: 320 }}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
          <XAxis
            dataKey="time"
            stroke={isDark ? "#94a3b8" : "#64748b"}
            tick={{ fill: isDark ? "#94a3b8" : "#64748b" }}
          />
          <YAxis
            allowDecimals={false}
            stroke={isDark ? "#94a3b8" : "#64748b"}
            tick={{ fill: isDark ? "#94a3b8" : "#64748b" }}
            label={{
              value: "Requests",
              angle: -90,
              position: "insideLeft",
              fill: isDark ? "#94a3b8" : "#64748b",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              borderColor: isDark ? "#334155" : "#e2e8f0",
              color: isDark ? "#f8fafc" : "#0f172a",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
            }}
            formatter={(_, __, props) =>
              [`Types: ${props.payload.types.join(", ")}`]
            }
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={{ r: 4, fill: "#0284c7" }}
            activeDot={{ r: 6, fill: "#38bdf8" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageLineChart;
