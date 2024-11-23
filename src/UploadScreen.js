import React, { useState } from "react";
import { Button, Progress, Radio, Upload, Typography, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UploadScreen = () => {
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [group, setGroup] = useState("");

  const BATCH_SIZE = 1;

  const handleFileSelect = ({ file, fileList }) => {
    setFiles(fileList);
  };

  const removeAllFiles = () => {
    setFiles([]);
    setUploadProgress(0);
  };

  const processBatch = async (batch, mode, group) => {
    const formData = new FormData();
    batch.forEach((file) => formData.append("files", file.originFileObj));
    formData.append("mode", mode);
    formData.append("group", group);

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

  const handleUpload = async (mode) => {
    if (files.length === 0 || !group) return;

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
      message.error(`Error: ${err.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <Title level={2}>Upload Your Files</Title>

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

      <div style={styles.groupSelection}>
        <Text strong>Select Group:</Text>
        <Radio.Group onChange={(e) => setGroup(e.target.value)} value={group}>
          {["Group1", "Group2", "Group3"].map((groupName) => (
            <Radio key={groupName} value={groupName}>
              {groupName}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div style={styles.buttonContainer}>
        <Button
          type="primary"
          onClick={() => handleUpload("wholebody")}
          disabled={files.length === 0 || !group}
        >
          Analyse Whole Body
        </Button>
        <Button
          type="primary"
          onClick={() => handleUpload("pose3d")}
          disabled={files.length === 0 || !group}
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
  groupSelection: {
    marginTop: "20px",
    textAlign: "left",
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
