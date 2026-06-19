import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("../../services/socket", () => ({
  socket: { emit: vi.fn(), on: vi.fn(), off: vi.fn(), connected: true },
}));

import FileUploader from "../../components/task/FileUploader";

const makeFile = (name, type) => new File(["content"], name, { type });

describe("FileUploader", () => {
  const mockSetAttachment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
  });

  const render_ = () =>
    render(<FileUploader setAttachment={mockSetAttachment} currentUrl="" />);

  it("renders the drop zone", () => {
    render_();
    expect(screen.getByTestId("file-drop-zone")).toBeInTheDocument();
  });

  it("does not show file-error initially", () => {
    render_();
    expect(screen.queryByTestId("file-error")).not.toBeInTheDocument();
  });

  it("shows error for invalid .txt file type", () => {
    render_();
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [makeFile("doc.txt", "text/plain")] } });
    expect(screen.getByTestId("file-error")).toBeInTheDocument();
    expect(mockSetAttachment).toHaveBeenCalledWith("");
  });

  it("accepts a valid PNG and calls setAttachment with blob URL", () => {
    render_();
    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [makeFile("image.png", "image/png")] },
    });
    expect(mockSetAttachment).toHaveBeenCalledWith("blob:mock-url");
    expect(screen.queryByTestId("file-error")).not.toBeInTheDocument();
  });

  it("accepts a valid JPEG and shows the file name", () => {
    render_();
    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [makeFile("photo.jpg", "image/jpeg")] },
    });
    expect(screen.getByTestId("file-name")).toHaveTextContent("photo.jpg");
  });

  it("accepts a valid PDF and calls setAttachment", () => {
    render_();
    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [makeFile("report.pdf", "application/pdf")] },
    });
    expect(mockSetAttachment).toHaveBeenCalledWith("blob:mock-url");
    expect(screen.queryByTestId("file-error")).not.toBeInTheDocument();
  });

  it("shows error for .exe file type", () => {
    render_();
    fireEvent.change(screen.getByTestId("file-input"), {
      target: { files: [makeFile("virus.exe", "application/x-msdownload")] },
    });
    expect(screen.getByTestId("file-error")).toBeInTheDocument();
  });

  it("clears the error after a valid file is chosen", () => {
    render_();
    const input = screen.getByTestId("file-input");
    fireEvent.change(input, { target: { files: [makeFile("bad.txt", "text/plain")] } });
    expect(screen.getByTestId("file-error")).toBeInTheDocument();
    fireEvent.change(input, { target: { files: [makeFile("ok.png", "image/png")] } });
    expect(screen.queryByTestId("file-error")).not.toBeInTheDocument();
  });
});
