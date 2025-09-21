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

const UsageLineChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="w-full mb-8" style={{ minHeight: 320 }}>
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis
          allowDecimals={false}
          label={{
            value: "Requests",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          formatter={(_, __, props) =>
            [`Types: ${props.payload.types.join(", ")}`]
          }
          labelFormatter={(label) => `Time: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default UsageLineChart;
