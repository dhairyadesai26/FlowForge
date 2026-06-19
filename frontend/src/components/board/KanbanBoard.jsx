import { useState, useMemo } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useTasks }  from "../../hooks/useTasks";
import Column        from "./Column";
import Dashboard     from "../analystics/Dashboard";
import Navbar        from "../common/Navbar";
import Loader        from "../common/Loader";
import TaskModal     from "../task/TaskModal";
import TaskForm      from "../task/TaskForm";
import { Plus }      from "lucide-react";

function KanbanBoard() {
  const { tasks, loading, createTask, updateTask, moveTask, deleteTask } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [search,    setSearch]    = useState("");
  const [priority,  setPriority]  = useState("All");
  const [category,  setCategory]  = useState("All");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priority === "All" || t.priority === priority;
      const matchCategory = category === "All" || t.category === category;
      return matchSearch && matchPriority && matchCategory;
    });
  }, [tasks, search, priority, category]);

  const todo     = filtered.filter((t) => t.status === "todo");
  const progress = filtered.filter((t) => t.status === "inprogress");
  const done     = filtered.filter((t) => t.status === "done");

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    if (destination.droppableId === result.source.droppableId) return;
    moveTask(draggableId, destination.droppableId);
  };

  if (loading) return <Loader />;

  return (
    <div className="app-wrapper">
      <Navbar
        search={search}     setSearch={setSearch}
        priority={priority} setPriority={setPriority}
        category={category} setCategory={setCategory}
        onNewTask={() => setShowModal(true)}
      />

      <main className="main-content">
        <div className="board-header" data-testid="board-header">
          <div className="board-title-wrap">
            <h1 className="board-title">Kanban Board</h1>
            <p className="board-subtitle">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} across {3} columns
            </p>
          </div>
        </div>

        <div className="stats-row" data-testid="stats-row">
          <div className="stat-chip chip-total">
            <span className="stat-num">{tasks.length}</span>
            <span>Total</span>
          </div>
          <div className="stat-chip chip-todo">
            <span className="stat-num">{todo.length}</span>
            <span>To Do</span>
          </div>
          <div className="stat-chip chip-prog">
            <span className="stat-num">{progress.length}</span>
            <span>In Progress</span>
          </div>
          <div className="stat-chip chip-done">
            <span className="stat-num">{done.length}</span>
            <span>Done</span>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board-scroll-container">
            <div className="board-grid" data-testid="board-grid">
              <Column
                columnId="todo"
                tasks={todo}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
              <Column
                columnId="inprogress"
                tasks={progress}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
              <Column
                columnId="done"
                tasks={done}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            </div>
          </div>
        </DragDropContext>

        <Dashboard tasks={tasks} />
      </main>

      {/* Mobile Floating Action Button */}
      <button 
        className="new-task-fab" 
        onClick={() => setShowModal(true)}
        aria-label="Create new task"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <TaskForm
          onClose={() => setShowModal(false)}
          createTask={createTask}
        />
      </TaskModal>
    </div>
  );
}

export default KanbanBoard;
