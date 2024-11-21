import React, { useState } from "react";

const UploadScreen = () => {
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [group, setGroup] = useState(""); // Track selected group

  const BATCH_SIZE = 50; // Number of files to process per batch

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // Remove all files
  const removeAllFiles = () => {
    setFiles([]);
    setUploadProgress(0);
  };

  // Process files in batches
  const processBatch = async (batch, mode, group) => {
    const formData = new FormData();
    batch.forEach((file) => formData.append("files", file));
    formData.append("mode", mode);
    formData.append("group", group); // Add the selected group to the form data

    const response = await fetch("https://mody.tail92517b.ts.net:8000/signProcessDB/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Batch upload failed:", errorText);
      throw new Error(`Batch failed: ${errorText || "Unknown error"}`);
    }

    return await response.json();
  };

  // Handle file upload
  const handleUpload = async (mode) => {
    if (files.length === 0 || !group) return; // Ensure a group is selected

    setUploadProgress(0);
    setUploadMessage(null);

    const totalBatches = Math.ceil(files.length / BATCH_SIZE);
    try {
      for (let i = 0; i < totalBatches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, files.length);
        const batch = files.slice(start, end);

        await processBatch(batch, mode, group); // Include selected group
        setUploadProgress(Math.round(((i + 1) / totalBatches) * 100));
      }

      setUploadMessage(`Successfully uploaded all files in ${mode} mode`);
    } catch (err) {
      console.error("Error during batch upload:", err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upload Files</h1>

      <input
        type="file"
        accept="video/*,image/*"
        multiple
        onChange={handleFileSelect}
        style={styles.fileInput}
      />

      <ul style={styles.fileList}>
        {files.map((file, index) => (
          <li key={index} style={styles.fileItem}>
            {file.name}
          </li>
        ))}
      </ul>

      <div style={styles.groupSelection}>
        <p>Select Group:</p>
        <label>
          <input
            type="radio"
            name="group"
            value="Group1"
            checked={group === "Group1"}
            onChange={(e) => setGroup(e.target.value)}
          />
          Group 1
        </label>
        <label>
          <input
            type="radio"
            name="group"
            value="Group2"
            checked={group === "Group2"}
            onChange={(e) => setGroup(e.target.value)}
          />
          Group 2
        </label>
        <label>
          <input
            type="radio"
            name="group"
            value="Group3"
            checked={group === "Group3"}
            onChange={(e) => setGroup(e.target.value)}
          />
          Group 3
        </label>
      </div>

      <div style={styles.buttonContainer}>
        <button
          style={files.length > 0 ? styles.button : styles.disabledButton}
          onClick={() => handleUpload("wholebody")}
          disabled={files.length === 0 || !group} // Disable if no group selected
        >
          Analyse Whole Body
        </button>
        <button
          style={files.length > 0 ? styles.button : styles.disabledButton}
          onClick={() => handleUpload("pose3d")}
          disabled={files.length === 0 || !group} // Disable if no group selected
        >
          Analyse 3D Pose
        </button>
        <button
          style={files.length > 0 ? styles.removeButton : styles.disabledButton}
          onClick={removeAllFiles}
          disabled={files.length === 0}
        >
          Remove All Files
        </button>
      </div>

      {uploadMessage && <p style={styles.successMessage}>{uploadMessage}</p>}

      {uploadProgress > 0 && (
        <p style={styles.progress}>
          Upload Progress: {uploadProgress}%
        </p>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", textAlign: "center" },
  title: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" },
  fileInput: { marginBottom: "10px" },
  fileList: { listStyleType: "none", padding: "0", marginTop: "10px" },
  fileItem: { marginBottom: "5px" },
  buttonContainer: { marginTop: "20px" },
  button: {
    backgroundColor: "#0a7ea4",
    color: "white",
    border: "none",
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  removeButton: {
    backgroundColor: "#ff4c4c",
    color: "white",
    border: "none",
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    color: "#666666",
    border: "none",
    padding: "10px 20px",
    margin: "5px",
    borderRadius: "5px",
    cursor: "not-allowed",
  },
  successMessage: { color: "green", marginTop: "20px" },
  progress: { marginTop: "20px", fontSize: "16px", fontWeight: "bold" },
  groupSelection: { marginTop: "20px", textAlign: "left" },
};

export default UploadScreen;
