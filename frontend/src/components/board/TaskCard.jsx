import { useState } from "react";
import TaskModal    from "../task/TaskModal";
import EditTaskForm from "../task/EditTaskForm";
import { openAttachment } from "../task/FileUploader";


function TaskCard({ task, updateTask, deleteTask }) {
  const [editOpen, setEditOpen] = useState(false);

  const priorityClass = {
    High:   "badge-high",
    Medium: "badge-medium",
    Low:    "badge-low",
  }[task.priority] ?? "badge-medium";

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <>
      <div className="task-card" data-testid={`task-card-${task.id}`}>
        <p className="task-card-title" data-testid="task-title">{task.title}</p>

        {task.description && (
          <p className="task-card-desc" data-testid="task-description">
            {task.description}
          </p>
        )}

        <div className="task-badges">
          <span className={`badge ${priorityClass}`} data-testid="task-priority-badge">
            {task.priority}
          </span>
          <span className="badge badge-category" data-testid="task-category-badge">
            {task.category}
          </span>
        </div>

        {task.attachment && (
          <button
            type="button"
            onClick={() => openAttachment(task.attachment)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#818cf8",
              padding: "0.5rem 0.75rem",
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "inherit",
              marginTop: "0.5rem",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.15)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.1)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
            }}
          >
            📎 View Attachment
          </button>
        )}

        <div className="task-footer">
          <span className="task-time">{timeAgo(task.createdAt)}</span>
          <div className="task-actions">
            <button
              className="task-btn"
              onClick={() => setEditOpen(true)}
              data-testid={`edit-task-${task.id}`}
              aria-label="Edit task"
            >
              ✏️ Edit
            </button>
            <button
              className="task-btn danger"
              onClick={() => deleteTask(task.id)}
              data-testid={`delete-task-${task.id}`}
              aria-label="Delete task"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      <TaskModal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <EditTaskForm
          task={task}
          onClose={() => setEditOpen(false)}
          updateTask={updateTask}
        />
      </TaskModal>
    </>
  );
}

export default TaskCard;