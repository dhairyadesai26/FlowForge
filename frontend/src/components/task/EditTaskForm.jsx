import { useState } from "react";
import FileUploader from "./FileUploader";

function EditTaskForm({ task, onClose, updateTask }) {
  const [title,       setTitle]       = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority,    setPriority]    = useState(task.priority);
  const [category,    setCategory]    = useState(task.category);
  const [attachment,  setAttachment]  = useState(task.attachment);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateTask({ ...task, title, description, priority, category, attachment });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} data-testid="edit-task-form">
      <h2 className="modal-title">Edit Task</h2>

      <div className="form-group">
        <label className="form-label" htmlFor="edit-title">Title *</label>
        <input
          id="edit-title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-testid="edit-title-input"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="edit-desc">Description</label>
        <textarea
          id="edit-desc"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="edit-description-input"
        />
      </div>

      <div className="select-row">
        <div className="form-group">
          <label className="form-label" htmlFor="edit-priority">Priority</label>
          <select
            id="edit-priority"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            data-testid="edit-priority-select"
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-category">Category</label>
          <select
            id="edit-category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            data-testid="edit-category-select"
          >
            <option value="Feature">✨ Feature</option>
            <option value="Bug">🐛 Bug</option>
            <option value="Enhancement">⚡ Enhancement</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Attachment</label>
        <FileUploader setAttachment={setAttachment} currentUrl={attachment} />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose} data-testid="edit-cancel-btn">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" data-testid="save-task-btn">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditTaskForm;