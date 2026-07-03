"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "#22c55e",
  pending: "#eab308",
  cancelled: "#ef4444",
};

type AdminChartsProps = {
  statusBreakdown: Record<string, number>;
  trend: { day: string; count: number }[];
};

export function AdminCharts({ statusBreakdown, trend }: AdminChartsProps) {
  const pieData = Object.entries(statusBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-md border border-dark-500 bg-dark-400 p-6">
        <h3 className="text-lg font-semibold mb-4">Appointment Status</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {pieData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={STATUS_COLORS[entry.name.toLowerCase()] || "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-dark-600 mt-2">
          {total} total appointments
        </p>
      </div>

      <div className="rounded-md border border-dark-500 bg-dark-400 p-6">
        <h3 className="text-lg font-semibold mb-4">Last 30 Days</h3>
        {trend.length === 0 ? (
          <p className="text-dark-600 text-center py-12">No appointments in the last 30 days</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
              />
              <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
