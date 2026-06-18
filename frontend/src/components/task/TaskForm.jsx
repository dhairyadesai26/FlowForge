import { useState } from "react";
import FileUploader from "./FileUploader";
import { useAuth } from "../../App";

/**
 * TaskForm — modal form for creating a new task.
 * Emits task:create via the socket passed as prop (or directly).
 */
function TaskForm({ onClose, createTask }) {
  const { user } = useAuth();
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [priority,    setPriority]    = useState("Medium");
  const [category,    setCategory]    = useState("Feature");
  const [attachment,  setAttachment]  = useState("");
  const [error,       setError]       = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    createTask({ title, description, priority, category, attachment, userId: user?.id || null });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} data-testid="task-form">
      <h2 className="modal-title">Create New Task</h2>

      {error && (
        <div className="file-error" style={{ marginBottom: "1rem" }} data-testid="form-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="task-title">Title *</label>
        <input
          id="task-title"
          className="form-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(""); }}
          data-testid="task-title-input"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          className="form-textarea"
          placeholder="Add more details…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="task-description-input"
        />
      </div>

      <div className="select-row">
        <div className="form-group">
          <label className="form-label" htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            data-testid="task-priority-select"
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-category">Category</label>
          <select
            id="task-category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            data-testid="task-category-select"
          >
            <option value="Feature">✨ Feature</option>
            <option value="Bug">🐛 Bug</option>
            <option value="Enhancement">⚡ Enhancement</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Attachment (optional)</label>
        <FileUploader setAttachment={setAttachment} currentUrl={attachment} />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose} data-testid="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" data-testid="create-task-btn">
          Create Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm;