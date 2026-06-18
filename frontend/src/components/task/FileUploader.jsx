import { useState, useRef } from "react";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf"];
const ALLOWED_EXTS  = ".png, .jpg, .jpeg, .gif, .webp, .pdf";

/**
 * FileUploader — drag-and-drop + click-to-browse file input.
 * Shows image preview for images, file name for PDFs.
 * Shows an error for unsupported file types (data-testid="file-error").
 */
function FileUploader({ setAttachment, currentUrl }) {
  const [dragging,  setDragging]  = useState(false);
  const [fileName,  setFileName]  = useState("");
  const [preview,   setPreview]   = useState(currentUrl || "");
  const [fileError, setFileError] = useState("");
  const inputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    setFileError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError(`Invalid file type "${file.type}". Allowed: ${ALLOWED_EXTS}`);
      setAttachment("");
      setPreview("");
      setFileName("");
      return;
    }

    const url = URL.createObjectURL(file);
    setAttachment(url);
    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      setPreview(url);
    } else {
      setPreview("");
    }
  };

  const onInputChange = (e) => processFile(e.target.files?.[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div>
      <div
        className={`file-zone ${dragging ? "dragging" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        data-testid="file-drop-zone"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload file"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTS}
          onChange={onInputChange}
          data-testid="file-input"
          style={{ display: "none" }}
        />
        <div className="file-zone-icon">📎</div>
        <div className="file-zone-text">
          {dragging ? "Drop file here" : "Click or drag & drop"}
        </div>
        <div className="file-zone-hint">PNG, JPG, GIF, WEBP, PDF</div>
      </div>

      {fileError && (
        <div className="file-error" data-testid="file-error">
          ⚠️ {fileError}
        </div>
      )}

      {fileName && !fileError && (
        <div className="file-name" data-testid="file-name">
          📄 {fileName}
        </div>
      )}

      {preview && (
        <img
          src={preview}
          alt="Attachment preview"
          className="file-preview-img"
          data-testid="file-preview"
        />
      )}
    </div>
  );
}

export default FileUploader;