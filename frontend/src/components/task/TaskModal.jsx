function TaskModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      data-testid="task-modal"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        {children}
      </div>
    </div>
  );
}

export default TaskModal;