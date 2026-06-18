import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

/*
 * Tests are in  src/tests/unit/
 * Components are in  src/components/
 * Hooks are in  src/hooks/
 * Services in  src/services/
 * App is in  src/App.jsx
 *
 * Relative paths from src/tests/unit/:
 *   ../../components/...
 *   ../../hooks/...
 *   ../../services/...
 *   ../../App
 */

/* ── Mock socket ── */
vi.mock("../../services/socket", () => ({
  socket: {
    emit:      vi.fn(),
    on:        vi.fn(),
    off:       vi.fn(),
    connected: true,
  },
}));

/* ── Mock App auth context ── */
vi.mock("../../App", () => ({
  useAuth: () => ({ user: null, signIn: vi.fn(), signOut: vi.fn() }),
  AuthContext: React.createContext(null),
}));

/* ── Mock useTasks ── */
const mockTasks = [
  { id: "1", title: "Fix login bug",    description: "urgent",    status: "todo",       priority: "High",   category: "Bug",         attachment: "", createdAt: Date.now() },
  { id: "2", title: "Add dark mode",    description: "",          status: "inprogress", priority: "Medium", category: "Feature",     attachment: "", createdAt: Date.now() },
  { id: "3", title: "Write unit tests", description: "important", status: "done",       priority: "Low",    category: "Enhancement", attachment: "", createdAt: Date.now() },
];

vi.mock("../../hooks/useTasks", () => ({
  useTasks: () => ({
    tasks:      mockTasks,
    loading:    false,
    createTask: vi.fn(),
    updateTask: vi.fn(),
    moveTask:   vi.fn(),
    deleteTask: vi.fn(),
  }),
}));

import KanbanBoard from "../../components/board/KanbanBoard";

describe("KanbanBoard", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the board title", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
  });

  it("renders all three columns", () => {
    render(<KanbanBoard />);
    expect(screen.getByTestId("column-todo")).toBeInTheDocument();
    expect(screen.getByTestId("column-inprogress")).toBeInTheDocument();
    expect(screen.getByTestId("column-done")).toBeInTheDocument();
  });

  it("displays correct task counts per column", () => {
    render(<KanbanBoard />);
    expect(screen.getByTestId("col-count-todo")).toHaveTextContent("1");
    expect(screen.getByTestId("col-count-inprogress")).toHaveTextContent("1");
    expect(screen.getByTestId("col-count-done")).toHaveTextContent("1");
  });

  it("renders all task card titles", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("Add dark mode")).toBeInTheDocument();
    expect(screen.getByText("Write unit tests")).toBeInTheDocument();
  });

  it("opens create-task modal when + New Task is clicked", async () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByTestId("new-task-btn"));
    await waitFor(() => expect(screen.getByTestId("task-form")).toBeInTheDocument());
  });

  it("closes modal when Cancel is clicked", async () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByTestId("new-task-btn"));
    const cancel = await screen.findByTestId("cancel-btn");
    fireEvent.click(cancel);
    await waitFor(() => expect(screen.queryByTestId("task-form")).not.toBeInTheDocument());
  });

  it("renders the analytics dashboard", () => {
    render(<KanbanBoard />);
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("renders priority badges on all task cards", () => {
    render(<KanbanBoard />);
    const badges = screen.getAllByTestId("task-priority-badge");
    expect(badges.length).toBe(3);
  });
});
