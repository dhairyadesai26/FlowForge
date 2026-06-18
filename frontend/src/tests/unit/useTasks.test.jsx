import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

/*
 * Paths from src/tests/unit/ :
 *   ../../hooks/useTasks
 *   ../../services/socket
 */

const handlers = {};

vi.mock("../../services/socket", () => ({
  socket: {
    emit:      vi.fn(),
    connected: true,
    on:  (event, cb) => { handlers[event] = cb; },
    off: (event)     => { delete handlers[event]; },
  },
}));

import { useTasks } from "../../hooks/useTasks";

const trigger = (event, payload) => {
  if (handlers[event]) handlers[event](payload);
};

describe("useTasks hook", () => {
  beforeEach(() => Object.keys(handlers).forEach((k) => delete handlers[k]));

  it("starts with loading=true and empty tasks", () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.loading).toBe(true);
    expect(result.current.tasks).toHaveLength(0);
  });

  it("sets tasks and loading=false on tasks:sync", () => {
    const { result } = renderHook(() => useTasks());
    const synced = [{ id: "a", title: "Alpha", status: "todo", priority: "High", category: "Bug", attachment: "", createdAt: Date.now() }];
    act(() => trigger("tasks:sync", synced));
    expect(result.current.loading).toBe(false);
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Alpha");
  });

  it("appends a new task on task:created", () => {
    const { result } = renderHook(() => useTasks());
    act(() => trigger("tasks:sync", []));
    const newTask = { id: "b", title: "Beta", status: "todo", priority: "Low", category: "Feature", attachment: "", createdAt: Date.now() };
    act(() => trigger("task:created", newTask));
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe("b");
  });

  it("updates an existing task on task:updated", () => {
    const { result } = renderHook(() => useTasks());
    const task = { id: "c", title: "Old Title", status: "todo", priority: "Medium", category: "Feature", attachment: "", createdAt: Date.now() };
    act(() => trigger("tasks:sync", [task]));
    act(() => trigger("task:updated", { ...task, title: "New Title" }));
    expect(result.current.tasks[0].title).toBe("New Title");
  });

  it("moves a task to new status on task:moved", () => {
    const { result } = renderHook(() => useTasks());
    const task = { id: "d", title: "Move Me", status: "todo", priority: "High", category: "Bug", attachment: "", createdAt: Date.now() };
    act(() => trigger("tasks:sync", [task]));
    act(() => trigger("task:moved", { taskId: "d", destination: "done" }));
    expect(result.current.tasks[0].status).toBe("done");
  });

  it("removes a task on task:deleted", () => {
    const { result } = renderHook(() => useTasks());
    const tasks = [
      { id: "e", title: "Keep",   status: "todo", priority: "Low",    category: "Feature", attachment: "", createdAt: Date.now() },
      { id: "f", title: "Delete", status: "todo", priority: "Medium", category: "Bug",     attachment: "", createdAt: Date.now() },
    ];
    act(() => trigger("tasks:sync", tasks));
    act(() => trigger("task:deleted", "f"));
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe("e");
  });

  it("exposes createTask helper that emits task:create", async () => {
    const { result } = renderHook(() => useTasks());
    const socketMod = await import("../../services/socket");
    act(() => trigger("tasks:sync", []));
    act(() => result.current.createTask({ title: "New" }));
    expect(socketMod.socket.emit).toHaveBeenCalledWith("task:create", { title: "New" });
  });

  it("exposes deleteTask helper that emits task:delete", async () => {
    const { result } = renderHook(() => useTasks());
    const socketMod = await import("../../services/socket");
    act(() => trigger("tasks:sync", []));
    act(() => result.current.deleteTask("task-99"));
    expect(socketMod.socket.emit).toHaveBeenCalledWith("task:delete", "task-99");
  });

  it("exposes moveTask helper that emits task:move", async () => {
    const { result } = renderHook(() => useTasks());
    const socketMod = await import("../../services/socket");
    act(() => trigger("tasks:sync", []));
    act(() => result.current.moveTask("task-1", "done"));
    expect(socketMod.socket.emit).toHaveBeenCalledWith("task:move", { taskId: "task-1", destination: "done" });
  });
});
