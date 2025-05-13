import React, { useState } from "react";
import { Button, Progress, Upload, Typography, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";

const { Title, Text } = Typography;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UploadScreen = () => {
  const [files, setFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const BATCH_SIZE = 1;

  const handleFileSelect = ({ fileList }) => {
    setFiles(fileList);
  };

  const removeAllFiles = () => {
    setFiles([]);
    setUploadProgress(0);
    setUploadMessage(null);
  };

  const processBatch = async (batch, mode) => {
    const formData = new FormData();
    batch.forEach(file => formData.append("file", file.originFileObj));
    formData.append("mode", mode);
  
    const token = localStorage.getItem("access_token");
  
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/video/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return data;
    } catch (error) {
      console.error("Batch upload failed:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`Batch failed: ${error.response?.data?.detail || error.message}`);
    }
  };
  

  const handleUpload = async (mode) => {
    if (files.length === 0) return;

    setUploadProgress(0);
    setUploadMessage("Videos sent! Analysing...");

    const totalBatches = Math.ceil(files.length / BATCH_SIZE);
    try {
      for (let i = 0; i < totalBatches; i++) {
        const batch = files.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
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
    <div className="w-full max-w-3xl mx-auto p-6">
      <Title level={3} className="text-center mb-6">Upload New Videos</Title>
      <div className="mb-4">
        <Upload
          multiple
          beforeUpload={() => false}
          onChange={handleFileSelect}
          fileList={files}
          listType="text"
        >
          <Button icon={<UploadOutlined />}>Select Files</Button>
        </Upload>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <Button
          type="primary"
          onClick={() => handleUpload("wholebody")}
          disabled={files.length === 0}
          className="w-full md:w-auto"
        >
          Analyse Whole Body
        </Button>
        <Button
          type="primary"
          onClick={() => handleUpload("pose3d")}
          disabled={files.length === 0}
          className="w-full md:w-auto"
        >
          Analyse 3D Pose
        </Button>
        <Button
          danger
          onClick={removeAllFiles}
          disabled={files.length === 0}
          className="w-full md:w-auto"
        >
          Remove All Files
        </Button>
      </div>

      {uploadMessage && <Text type="success">{uploadMessage}</Text>}

      {uploadProgress > 0 && (
        <Progress percent={uploadProgress} className="mt-4" />
      )}
    </div>
  );
};

export default UploadScreen;