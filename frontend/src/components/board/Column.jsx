import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const COL_META = {
  todo:       { label: "To Do",       cls: "todo",       emoji: "📋" },
  inprogress: { label: "In Progress", cls: "inprogress", emoji: "⚡" },
  done:       { label: "Done",        cls: "done",       emoji: "✅" },
};

function Column({ columnId, tasks, updateTask, deleteTask }) {
  const meta = COL_META[columnId] ?? { label: columnId, cls: "todo", emoji: "📋" };

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`column ${snapshot.isDraggingOver ? "drag-over" : ""}`}
          data-testid={`column-${columnId}`}
        >
          <div className="column-header">
            <div className="column-title-wrap">
              <span className={`col-indicator ${meta.cls}`} />
              <span className="column-name">{meta.label}</span>
            </div>
            <span className="col-count" data-testid={`col-count-${columnId}`}>
              {tasks.length}
            </span>
          </div>

          <div className="column-body">
            {tasks.length === 0 && (
              <div className="col-empty">
                <span className="col-empty-icon">{meta.emoji}</span>
                <span>Drop tasks here</span>
              </div>
            )}

            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(prov, snap) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.dragHandleProps}
                    {...prov.draggableProps}
                    style={{
                      ...prov.draggableProps.style,
                      opacity: snap.isDragging ? 0.88 : 1,
                    }}
                  >
                    <TaskCard
                      task={task}
                      updateTask={updateTask}
                      deleteTask={deleteTask}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default Column;