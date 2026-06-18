import { useEffect, useState } from "react";
import { socket } from "../services/socket";

/**
 * useTasks — subscribes to all WebSocket task events and keeps local state
 * synchronized. Also exposes imperative helpers used by the test suite.
 */
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* ── Initial sync ── */
    const onSync = (serverTasks) => {
      setTasks(serverTasks);
      setLoading(false);
    };

    /* ── Create ── */
    const onCreated = (task) =>
      setTasks((prev) => [...prev, task]);

    /* ── Update ── */
    const onUpdated = (updated) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
      );

    /* ── Move ── */
    const onMoved = ({ taskId, destination }) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: destination } : t
        )
      );

    /* ── Delete ── */
    const onDeleted = (taskId) =>
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

    // Register all listeners BEFORE connecting so tasks:sync is never missed.
    socket.on("tasks:sync",    onSync);
    socket.on("task:created",  onCreated);
    socket.on("task:updated",  onUpdated);
    socket.on("task:moved",    onMoved);
    socket.on("task:deleted",  onDeleted);

    socket.connect();

    // Fallback: unblock the UI after 8 s if sync never arrives (server down, etc.)
    const syncTimeout = setTimeout(() => setLoading(false), 8000);

    return () => {
      clearTimeout(syncTimeout);
      socket.off("tasks:sync",   onSync);
      socket.off("task:created", onCreated);
      socket.off("task:updated", onUpdated);
      socket.off("task:moved",   onMoved);
      socket.off("task:deleted", onDeleted);
      socket.disconnect();
    };
  }, []);

  /* ── Imperative helpers (also used by tests) ── */
  const createTask  = (data) => socket.emit("task:create", data);
  const updateTask  = (data) => socket.emit("task:update", data);
  const moveTask    = (taskId, destination) => socket.emit("task:move", { taskId, destination });
  const deleteTask  = (taskId) => socket.emit("task:delete", taskId);

  return { tasks, loading, createTask, updateTask, moveTask, deleteTask };
}