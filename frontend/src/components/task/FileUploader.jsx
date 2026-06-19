import { useState, useRef } from "react";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf"];
const ALLOWED_EXTS = ".png, .jpg, .jpeg, .gif, .webp, .pdf";

const CLOUDINARY_CLOUD = "dl7xjotfc";
const CLOUDINARY_PRESET = "FlowForge";
const IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;
const RAW_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/raw/upload`;

export function openAttachment(url) {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Derive what kind of attachment a URL represents.
 * Returns 'image' | 'pdf' | null
 */
function getAttachmentType(url) {
  if (!url) return null;
  // raw/upload = legacy PDF upload; image/upload + .pdf extension = new approach
  if (url.includes("/raw/upload/") || /\.pdf(\?|$)/i.test(url)) return "pdf";
  return "image";
}

/**
 * FileUploader — uploads files to Cloudinary on selection.
 * Passes back a permanent Cloudinary URL via setAttachment.
 */
function FileUploader({ setAttachment, currentUrl }) {
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  // null = no new upload yet; fall back to currentUrl for display
  const [newUrl, setNewUrl] = useState(null);
  const inputRef = useRef(null);

  const activeUrl = newUrl ?? currentUrl ?? "";
  const activeType = getAttachmentType(activeUrl);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploadErr("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadErr(`Invalid file type. Allowed: PNG, JPG, GIF, WEBP, PDF`);
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      const uploadUrl = file.type === "application/pdf" ? RAW_UPLOAD_URL : IMAGE_UPLOAD_URL;
      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error?.message || "Upload failed");
      }

      const url = data.secure_url;
      setNewUrl(url);
      setAttachment(url);   // propagate permanent URL to parent form
    } catch (err) {
      setUploadErr(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e) => uploadFile(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadFile(e.dataTransfer.files?.[0]);
  };
  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div>
      {/* Drop zone */}
      <div
        className={`file-zone ${dragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        data-testid="file-drop-zone"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && !uploading && inputRef.current?.click()}
        aria-label="Upload file"
        style={{ opacity: uploading ? 0.7 : 1, cursor: uploading ? "wait" : "pointer" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTS}
          onChange={onInputChange}
          data-testid="file-input"
          style={{ display: "none" }}
        />
        <div className="file-zone-icon">{uploading ? "⏳" : "📎"}</div>
        <div className="file-zone-text">
          {uploading
            ? `Uploading ${fileName}…`
            : activeUrl
              ? "Click to replace file"
              : dragging
                ? "Drop file here"
                : "Click or drag & drop"}
        </div>
        <div className="file-zone-hint">PNG, JPG, GIF, WEBP, PDF</div>
      </div>

      {/* Upload progress / error */}
      {uploading && (
        <div style={{
          marginTop: "0.5rem",
          fontSize: "0.78rem",
          color: "#818cf8",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem"
        }}>
          <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
          Uploading to cloud…
        </div>
      )}

      {uploadErr && (
        <div className="file-error" data-testid="file-error">
          ⚠️ {uploadErr}
        </div>
      )}

      {/* Attachment preview */}
      {activeUrl && !uploading && !uploadErr && (
        <div style={{ marginTop: "0.75rem" }}>
          {activeType === "image" && (
            <img
              src={activeUrl}
              alt="Attachment preview"
              className="file-preview-img"
              data-testid="file-preview"
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                maxHeight: "160px",
                objectFit: "cover",
                display: "block",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            />
          )}

          {activeType === "pdf" && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 0.875rem",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "8px",
              fontSize: "0.82rem",
              color: "#818cf8",
              fontWeight: 600,
            }}>
              📄 PDF — {fileName || activeUrl.split("/").pop()}
            </div>
          )}

          <button
            type="button"
            onClick={() => openAttachment(activeUrl)}
            style={{
              display: "inline-block",
              marginTop: "0.4rem",
              fontSize: "0.75rem",
              color: "#6366f1",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            🔗 Open in new tab
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;