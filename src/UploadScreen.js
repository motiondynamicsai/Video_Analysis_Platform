import React, { useState } from "react";

const UploadScreen = () => {
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [group, setGroup] = useState(""); // Track selected group

  const BATCH_SIZE = 1; // Number of files to process per batch

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
    setUploadMessage("Videos sent! Analysing...");

    const totalBatches = Math.ceil(files.length / BATCH_SIZE);
    try {
      for (let i = 0; i < totalBatches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, files.length);
        const batch = files.slice(start, end);

        await processBatch(batch, mode, group);
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
      <h1 style={styles.title}>Upload Your Files</h1>

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
        <p style={styles.groupTitle}>Select Group:</p>
        {["Group1", "Group2", "Group3"].map((groupName) => (
          <label key={groupName} style={styles.groupLabel}>
            <input
              type="radio"
              name="group"
              value={groupName}
              checked={group === groupName}
              onChange={(e) => setGroup(e.target.value)}
              style={styles.radioInput}
            />
            {groupName}
          </label>
        ))}
      </div>

      <div style={styles.buttonContainer}>
        <button
          style={files.length > 0 ? styles.button : styles.disabledButton}
          onClick={() => handleUpload("wholebody")}
          disabled={files.length === 0 || !group}
        >
          Analyse Whole Body
        </button>
        <button
          style={files.length > 0 ? styles.button : styles.disabledButton}
          onClick={() => handleUpload("pose3d")}
          disabled={files.length === 0 || !group}
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

      {uploadProgress >= 0 && (
        <div style={styles.progressBarContainer}>
          <div style={styles.progressBarWrapper}>
            <div
              style={{
                ...styles.progressBar,
                width: `${uploadProgress}%`,
              }}
            />
          </div>
          <p style={styles.progressText}>{uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};

const styles = {
    container: {
      padding: "20px",
      textAlign: "center",
      fontFamily: "'Roboto', sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
    },
    fileInput: {
      padding: "10px",
      marginBottom: "20px",
      fontSize: "16px",
    },
    fileList: {
      listStyleType: "none",
      padding: "10px",
      marginTop: "10px",
      marginBottom: "20px",
      color: "#555",
      textAlign: "left",
      maxHeight: "150px", // Set max height for the list
      overflowY: "auto", // Enable vertical scrolling
      border: "1px solid #ddd", // Optional: Add a border for clarity
      borderRadius: "5px",
      backgroundColor: "#f9f9f9", // Light background for better visibility
    },
    fileItem: {
      marginBottom: "5px",
      padding: "5px",
      borderBottom: "1px solid #eee", // Optional: Divider between files
      fontSize: "14px",
    },
    groupSelection: {
      marginTop: "20px",
      textAlign: "left",
    },
    groupTitle: {
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#444",
    },
    groupLabel: {
      display: "block",
      marginBottom: "5px",
      color: "#555",
      cursor: "pointer",
    },
    radioInput: {
      marginRight: "10px",
    },
    buttonContainer: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    },
    button: {
      backgroundColor: "#0a7ea4",
      color: "white",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "16px",
      transition: "background-color 0.3s ease",
    },
    removeButton: {
      backgroundColor: "#ff4c4c",
      color: "white",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "16px",
      transition: "background-color 0.3s ease",
    },
    disabledButton: {
      backgroundColor: "#cccccc",
      color: "#666666",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "not-allowed",
    },
    successMessage: {
      color: "#28a745",
      marginTop: "20px",
      fontSize: "16px",
    },
    progressBarContainer: {
      marginTop: "20px",
      textAlign: "center",
    },
    progressBarWrapper: {
      backgroundColor: "#e0e0e0",
      borderRadius: "10px",
      overflow: "hidden",
      height: "20px",
      width: "100%",
    },
    progressBar: {
      backgroundColor: "#4caf50",
      height: "100%",
      transition: "width 0.3s ease",
    },
    progressText: {
      marginTop: "10px",
      fontSize: "16px",
      fontWeight: "bold",
    },  
};

export default UploadScreen;
