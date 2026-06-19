import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const PRIORITY_COLORS = {
  High:   "#ef4444",
  Medium: "#f59e0b",
  Low:    "#22c55e",
};

function PriorityChart({ tasks }) {
  const counts = { High: 0, Medium: 0, Low: 0 };
  tasks.forEach((t) => {
    if (counts[t.priority] !== undefined) counts[t.priority]++;
  });

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <div className="chart-card" data-testid="priority-chart">
      <div className="chart-card-title">Tasks by Priority</div>
      <div className="chart-card-value">{tasks.length} Tasks</div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="35%">
          <XAxis
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#0d0d22",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "#f1f5f9",
              fontSize: "0.8rem",
            }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriorityChart;