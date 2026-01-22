import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardTab = ({ records }) => {
  const healthyCount = records.filter(
    (r) => r.diagnosis.isHealthy
  ).length;

  const issueCount = records.length - healthyCount;

  const pieData = [
    { name: "Healthy", value: healthyCount, color: "#10b981" },
    { name: "Issue Detected", value: issueCount, color: "#f43f5e" },
  ];

  // Last 7 days labels
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  }).reverse();

  const chartData = last7Days.map((day) => {
    const count = records.filter((r) => {
      const recordDay = new Date(r.timestamp).toLocaleDateString(
        "en-US",
        { weekday: "short" }
      );
      return recordDay === day;
    }).length;

    return { day, scans: count };
  });

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No data yet
        </h3>
        <p className="text-gray-500">
          Start scanning your plants to see insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
            Total Scans
          </p>
          <h3 className="text-3xl font-black text-gray-900">
            {records.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
            Health Rate
          </p>
          <h3 className="text-3xl font-black text-emerald-600">
            {records.length > 0
              ? Math.round((healthyCount / records.length) * 100)
              : 0}
            %
          </h3>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-6">
          Health Distribution
        </h4>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          {pieData.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: d.color }}
              ></div>
              <span className="text-sm font-medium text-gray-600">
                {d.name} ({d.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-6">
          Activity (Last 7 Days)
        </h4>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="scans"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
