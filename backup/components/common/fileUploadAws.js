import React, { useState, useRef } from "react";
import { makePostRequest } from "@/utils/api";
import { convertFileToBase64 } from "./convertFileToBase64";
import { toast } from "react-hot-toast";

const allowedTypes = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  video: ["video/mp4", "video/quicktime", "video/x-matroska", "video/webm"],
};

const FileUploadComponent = ({
  label,
  labelText = "Upload File",
  name,
  allowedClasses,
  onChange,
  info,
  multiple = false,
  required = false,
  folderPath = 'uploads/images',
  initialFile = null,
}) => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [previewFile, setPreviewFile] = useState(initialFile);

  const validateFileType = (file) => {
    if (!file) return false;
    const classList = allowedClasses?.split(" ") || [];
    return classList.some((cls) => allowedTypes[cls]?.includes(file.type));
  };

  const uploadToAWS = async (file, folderPath) => {
    try {
      if (!file || !file.name || typeof file.name !== "string") {
        throw new Error("Invalid file: filename is missing or not a string");
      }

      const base64String = await convertFileToBase64(file);
      const payload = {
        filename: file.name,
        base64String: base64String,
        folderPath: folderPath,
      };

      const response = await makePostRequest("api/v1/files/uploadtoaws", payload);
      return response.data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file to AWS: " + error.message);
    }
  };

  const handleFileSelection = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!validateFileType(selectedFile)) {
      setError("Unsupported file format");
      toast.error("Unsupported file format");
      return;
    }

    setError("");
    setPreviewFile(URL.createObjectURL(selectedFile));

    try {
      const uploadedUrl = await uploadToAWS(selectedFile, folderPath);
      setPreviewFile(uploadedUrl);
      toast.success("File uploaded successfully!");
      if (onChange) onChange([{ file: selectedFile, isValid: true, fileUrl: uploadedUrl }]);
    } catch (err) {
      console.error(err);
      setError("Error uploading file. Please try again.");
      toast.error("Failed to upload file.");
      if (onChange) onChange([{ file: selectedFile, isValid: false, fileUrl: null }]);
    }
  };

  return (
    <div className="user-avatar-setting d-flex align-items-center mb-30">
      {/* Avatar */}
      {/* <img
        src={previewFile || "/images/usericon.jpg"}
        alt="avatar"
        className="lazy-img user-img"
        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
      /> */}

      {/* Upload Button */}
      <div
        className="upload-btn position-relative tran3s ms-4 me-3"
        style={{ cursor: "pointer" }}
        onClick={() => inputRef.current?.click()}
      >
        Upload new photo
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileSelection}
      />

      {/* Delete Button */}
      {/* {previewFile && (
        <button
          className="delete-btn tran3s"
          onClick={() => {
            setPreviewFile(null);
            if (onChange) onChange([]);
          }}
        >
          Delete
        </button>
      )} */}

      {/* Info / Error */}
      {info && <small className="text-muted ms-3">{info}</small>}
      {error && <div className="text-danger mt-1 ms-3">{error}</div>}

      {/* Commented drag & drop / preview list preserved */}
      {/*
      {files.length > 0 && (
        <div className="file-preview-container mt-3">
          {files.map(({ file, isValid, fileUrl }, index) => (
            <div
              key={index}
              className={`file-preview ${isValid ? "success" : "error"}`}
              style={{ marginBottom: "1rem" }}
            >
              <div
                className="preview-wrapper"
                style={{ position: "relative", display: "inline-block" }}
              >
                {isValid && file.type.startsWith("image/") && (
                  // <img
                  //   src={fileUrl || URL.createObjectURL(file)}
                  //   alt={`Preview ${index}`}
                  //   className="preview-image"
                  //   style={{
                  //     height: "auto",
                  //     borderRadius: "8px",
                  //   }}
                  // />
                )}

                {isValid && file.type.startsWith("video/") && (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  >
                    <source
                      src={fileUrl || URL.createObjectURL(file)}
                      type={file.type}
                    />
                    Your browser does not support the video tag.
                  </video>
                )}

                <button
                  type="button"
                  className="remove-file"
                  onClick={() => handleRemoveFile(index)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>

              <div className="message mt-2">
                {isValid && fileUrl
                  ? "File uploaded successfully"
                  : isValid
                  ? "Uploading..."
                  : "Unsupported file format"}
              </div>
            </div>
          ))}
        </div>
      )}
      */}
    </div>
  );
};

export default FileUploadComponent;
