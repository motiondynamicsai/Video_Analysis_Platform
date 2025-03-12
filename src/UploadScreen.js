import React, { useState } from "react";
import { Button, Progress, Upload, Typography, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";

const { Title, Text } = Typography;

const UploadScreen = () => {
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const BATCH_SIZE = 1;

  const handleFileSelect = ({ file, fileList }) => {
    setFiles(fileList);
  };

  const removeAllFiles = () => {
    setFiles([]);
    setUploadProgress(0);
  };

  const processBatch = async (batch, mode) => {
    const formData = new FormData();
    batch.forEach((file) => formData.append("file", file.originFileObj));
    formData.append("mode", mode);

    const token = localStorage.getItem("access_token");

    try {
      const response = await axios.post("https://mody.tail92517b.ts.net:8000/process3toDB/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const errorText = error.response?.data?.detail || "Unknown error";
      console.error("Batch upload failed:", errorText);
      throw new Error(`Batch failed: ${errorText}`);
    }
  };

  const handleUpload = async (mode) => {
    if (files.length === 0) return;

    setUploadProgress(0);
    setUploadMessage("Videos sent! Analysing...");

    const totalBatches = Math.ceil(files.length / BATCH_SIZE);
    try {
      for (let i = 0; i < totalBatches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, files.length);
        const batch = files.slice(start, end);

        await processBatch(batch, mode);
        setUploadProgress(Math.round(((i + 1) / totalBatches) * 100));
      }

      setUploadMessage(`Successfully uploaded all files in ${mode} mode`);
    } catch (err) {
      console.error("Error during batch upload:", err);
      message.error(`Error: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <Title level={4} style={{ marginBottom: 24 }}>Upload New Videos</Title>
      <div style={styles.uploadArea}>
        <Upload
          multiple
          beforeUpload={() => false}
          onChange={handleFileSelect}
          fileList={files}
          listType="text"
          className="custom-upload-list"
        >
          <Button icon={<UploadOutlined />}>Select Files</Button>
        </Upload>

        <div style={styles.buttonContainer}>
          <Button
            type="primary"
            onClick={() => handleUpload("wholebody")}
            disabled={files.length === 0}
          >
            Analyse Whole Body
          </Button>
          <Button
            type="primary"
            onClick={() => handleUpload("pose3d")}
            disabled={files.length === 0}
          >
            Analyse 3D Pose
          </Button>
          <Button
            type="danger"
            onClick={removeAllFiles}
            disabled={files.length === 0}
          >
            Remove All Files
          </Button>
        </div>

        {uploadMessage && <Text type="success">{uploadMessage}</Text>}

        {uploadProgress >= 0 && (
          <Progress percent={uploadProgress} style={styles.progressBar} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    padding: 24,
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  uploadArea: {
    height: 'calc(100% - 120px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttonContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  progressBar: {
    marginTop: "20px",
  },
};

// Add this CSS to the same file or include it in your project's stylesheet.
const customStyles = document.createElement("style");
customStyles.innerHTML = `
  .custom-upload-list .ant-upload-list {
    max-height: 300px; /* Set a max height for the list */
    overflow-y: auto; /* Enable vertical scrolling */
  }
`;
document.head.appendChild(customStyles);

export default UploadScreen;
