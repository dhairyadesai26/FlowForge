import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

/* ── Mocks (paths from src/tests/unit/) ── */
vi.mock("../../services/socket", () => ({
  socket: { emit: vi.fn(), on: vi.fn(), off: vi.fn(), connected: true },
}));

vi.mock("../../App", () => ({
  useAuth: () => ({ user: null, signIn: vi.fn(), signOut: vi.fn() }),
  AuthContext: React.createContext(null),
}));

import TaskForm from "../../components/task/TaskForm";

describe("TaskForm", () => {
  const mockClose      = vi.fn();
  const mockCreateTask = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  const renderForm = () =>
    render(<TaskForm onClose={mockClose} createTask={mockCreateTask} />);

  it("renders all form fields", () => {
    renderForm();
    expect(screen.getByTestId("task-title-input")).toBeInTheDocument();
    expect(screen.getByTestId("task-description-input")).toBeInTheDocument();
    expect(screen.getByTestId("task-priority-select")).toBeInTheDocument();
    expect(screen.getByTestId("task-category-select")).toBeInTheDocument();
    expect(screen.getByTestId("create-task-btn")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-btn")).toBeInTheDocument();
  });

  it("shows validation error when submitting empty title", () => {
    renderForm();
    fireEvent.click(screen.getByTestId("create-task-btn"));
    expect(screen.getByTestId("form-error")).toBeInTheDocument();
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("calls createTask with correct data on valid submit", () => {
    renderForm();
    fireEvent.change(screen.getByTestId("task-title-input"),       { target: { value: "New Feature" } });
    fireEvent.change(screen.getByTestId("task-description-input"), { target: { value: "Some description" } });
    fireEvent.change(screen.getByTestId("task-priority-select"),   { target: { value: "High" } });
    fireEvent.change(screen.getByTestId("task-category-select"),   { target: { value: "Bug" } });
    fireEvent.click(screen.getByTestId("create-task-btn"));

    expect(mockCreateTask).toHaveBeenCalledOnce();
    const call = mockCreateTask.mock.calls[0][0];
    expect(call.title).toBe("New Feature");
    expect(call.description).toBe("Some description");
    expect(call.priority).toBe("High");
    expect(call.category).toBe("Bug");
  });

  it("calls onClose after successful submit", () => {
    renderForm();
    fireEvent.change(screen.getByTestId("task-title-input"), { target: { value: "Test Task" } });
    fireEvent.click(screen.getByTestId("create-task-btn"));
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Cancel is clicked without creating", () => {
    renderForm();
    fireEvent.click(screen.getByTestId("cancel-btn"));
    expect(mockClose).toHaveBeenCalledOnce();
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it("priority select defaults to Medium", () => {
    renderForm();
    expect(screen.getByTestId("task-priority-select")).toHaveValue("Medium");
  });

  it("category select defaults to Feature", () => {
    renderForm();
    expect(screen.getByTestId("task-category-select")).toHaveValue("Feature");
  });

  it("priority select accepts all valid options", () => {
    renderForm();
    const sel = screen.getByTestId("task-priority-select");
    ["Low", "Medium", "High"].forEach((val) => {
      fireEvent.change(sel, { target: { value: val } });
      expect(sel).toHaveValue(val);
    });
  });
});
