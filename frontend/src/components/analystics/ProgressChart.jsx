import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#6366f1", "#f59e0b"];

function ProgressChart({ tasks }) {
  const done     = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.filter((t) => t.status === "inprogress").length;
  const todo     = tasks.filter((t) => t.status === "todo").length;
  const total    = tasks.length;
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0;

  const data = [
    { name: "Done",        value: done     },
    { name: "In Progress", value: progress },
    { name: "To Do",       value: todo     },
  ].filter((d) => d.value > 0);

  return (
    <div className="chart-card" data-testid="progress-chart">
      <div className="chart-card-title">Task Completion</div>
      <div className="chart-card-value">{pct}%</div>

      <div className="completion-pill">
        ✅ {done} / {total} done
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%` }}
          data-testid="progress-fill"
        />
      </div>

      {total > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={75}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#0d0d22",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "0.8rem",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "0.78rem", color: "#94a3b8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>
          No tasks yet — create one to see the chart!
        </div>
      )}
    </div>
  );
}

export default ProgressChart;