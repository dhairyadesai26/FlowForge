import ProgressChart from "./ProgressChart";
import PriorityChart from "./PriorityChart";

function Dashboard({ tasks }) {
  return (
    <section className="dashboard" data-testid="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">📊 Analytics</h2>
        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
          Updates in real-time
        </span>
      </div>

      <div className="charts-grid">
        <ProgressChart tasks={tasks} />
        <PriorityChart tasks={tasks} />
      </div>
    </section>
  );
}

export default Dashboard;