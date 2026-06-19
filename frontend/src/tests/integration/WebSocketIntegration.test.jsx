import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

const socketHandlers = {};

const emitRef = { fn: null };

vi.mock("../../services/socket", () => {
  const mockEmit = vi.fn((...args) => emitRef.fn && emitRef.fn(...args));
  return {
    socket: {
      emit:      mockEmit,
      connected: true,
      on:  (event, cb) => { socketHandlers[event] = cb; },
      off: (event)     => { delete socketHandlers[event]; },
    },
  };
});

vi.mock("../../App", () => ({
  useAuth: () => ({ user: null, signIn: vi.fn(), signOut: vi.fn() }),
  AuthContext: React.createContext(null),
}));

import KanbanBoard from "../../components/board/KanbanBoard";
import { socket }  from "../../services/socket";

const trigger = (event, payload) => {
  if (socketHandlers[event]) {
    act(() => socketHandlers[event](payload));
  }
};

const initialTasks = [
  { id: "t1", title: "Task Alpha", description: "", status: "todo",       priority: "High",   category: "Bug",     attachment: "", createdAt: Date.now() },
  { id: "t2", title: "Task Beta",  description: "", status: "inprogress", priority: "Medium", category: "Feature", attachment: "", createdAt: Date.now() },
];

describe("WebSocket Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(socketHandlers).forEach((k) => delete socketHandlers[k]);
  });

  it("renders initial tasks after tasks:sync", async () => {
    render(<KanbanBoard />);
    trigger("tasks:sync", initialTasks);
    await waitFor(() => {
      expect(screen.getByText("Task Alpha")).toBeInTheDocument();
      expect(screen.getByText("Task Beta")).toBeInTheDocument();
    });
  });

  it("adds a new card when task:created fires", async () => {
    render(<KanbanBoard />);
    trigger("tasks:sync", initialTasks);
    await screen.findByText("Task Alpha");

    const newTask = { id: "t3", title: "Task Gamma", description: "", status: "todo", priority: "Low", category: "Enhancement", attachment: "", createdAt: Date.now() };
    trigger("task:created", newTask);
    await waitFor(() => expect(screen.getByText("Task Gamma")).toBeInTheDocument());
  });

  it("removes a card when task:deleted fires", async () => {
    render(<KanbanBoard />);
    trigger("tasks:sync", initialTasks);
    await screen.findByText("Task Alpha");

    trigger("task:deleted", "t1");
    await waitFor(() => expect(screen.queryByText("Task Alpha")).not.toBeInTheDocument());
    expect(screen.getByText("Task Beta")).toBeInTheDocument();
  });

  it("moves task to new column when task:moved fires", async () => {
    render(<KanbanBoard />);
    trigger("tasks:sync", initialTasks);
    await screen.findByText("Task Alpha");

    trigger("task:moved", { taskId: "t1", destination: "done" });
    await waitFor(() => {
      expect(screen.getByTestId("col-count-done")).toHaveTextContent("1");
      expect(screen.getByTestId("col-count-todo")).toHaveTextContent("0");
    });
  });

  it("updates task title when task:updated fires", async () => {
    render(<KanbanBoard />);
    trigger("tasks:sync", initialTasks);
    await screen.findByText("Task Alpha");

    trigger("task:updated", { ...initialTasks[0], title: "Task Alpha (Updated)" });
    await waitFor(() => expect(screen.getByText("Task Alpha (Updated)")).toBeInTheDocument());
    expect(screen.queryByText("Task Alpha")).not.toBeInTheDocument();
  });

  it("delete button emits task:delete via socket", async () => {
    render(<KanbanBoard />);
    trigger("tasks:sync", initialTasks);
    await screen.findByText("Task Alpha");

    fireEvent.click(screen.getByTestId("delete-task-t1"));
    expect(socket.emit).toHaveBeenCalledWith("task:delete", "t1");
  });

  it("search filter narrows visible cards", async () => {
    render(<KanbanBoard />);
    trigger("tasks:sync", initialTasks);
    await screen.findByText("Task Alpha");

    fireEvent.change(screen.getByTestId("search-input"), { target: { value: "Beta" } });
    await waitFor(() => {
      expect(screen.getByText("Task Beta")).toBeInTheDocument();
      expect(screen.queryByText("Task Alpha")).not.toBeInTheDocument();
    });
  });

  it("priority filter narrows visible cards", async () => {
    render(<KanbanBoard />);
    trigger("tasks:sync", initialTasks);
    await screen.findByText("Task Alpha");

    fireEvent.change(screen.getByTestId("priority-filter"), { target: { value: "High" } });
    await waitFor(() => {
      expect(screen.getByText("Task Alpha")).toBeInTheDocument();
      expect(screen.queryByText("Task Beta")).not.toBeInTheDocument();
    });
  });
});
