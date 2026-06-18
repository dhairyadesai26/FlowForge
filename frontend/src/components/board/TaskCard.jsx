import { useState } from "react";
import TaskModal   from "../task/TaskModal";
import EditTaskForm from "../task/EditTaskForm";

/**
 * TaskCard — draggable card showing task details, badges, attachment preview,
 * edit modal and delete button.
 */
function TaskCard({ task, updateTask, deleteTask }) {
  const [editOpen, setEditOpen] = useState(false);

  const priorityClass = {
    High:   "badge-high",
    Medium: "badge-medium",
    Low:    "badge-low",
  }[task.priority] ?? "badge-medium";

  const isImage = task.attachment && (
    task.attachment.startsWith("blob:")  ||
    /\.(png|jpe?g|gif|webp)(\?|$)/i.test(task.attachment)
  );

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

        {isImage && (
          <img
            src={task.attachment}
            alt="Task attachment"
            className="task-attachment-img"
            data-testid="task-attachment-img"
          />
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