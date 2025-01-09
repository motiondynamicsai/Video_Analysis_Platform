import React, { useState, useEffect } from "react";
import { Button, List, message, Typography, Card } from "antd";
import axios from "axios";

const { Title, Text } = Typography;

const AnalysisFilesScreen = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      try {
        // Fetch files metadata from the backend
        const response = await axios.get("https://mody.tail92517b.ts.net:8000/files/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(response.data); // Store response in state
      } catch (error) {
        message.error("Failed to fetch files: " + (error.response?.data?.detail || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const downloadFile = async (fileId, filename) => {
    const token = localStorage.getItem("access_token");
    console.log("Downloading file:", { fileId, filename });

    try {
        const response = await axios.get(`https://mody.tail92517b.ts.net:8000/files/${fileId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Ensure binary data
        });

        console.log("Response headers:", response.headers);

        const blob = new Blob([response.data]);
        console.log("Blob type:", blob.type);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading file:", error);
        message.error(`Failed to download file: ${error.response?.data?.detail || "Unknown error"}`);
    }
};

  
  

  return (
    <div style={styles.container}>
      <Title level={2}>Your Files</Title>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 1 }}
        dataSource={files}
        renderItem={(file) => (
          <List.Item>
            <Card style={styles.card}>
              <Text strong>Original Filename:</Text> {file.filename || "N/A"}
              <br />
              <Text strong>Processed Filename:</Text> {file.processed_filename || "N/A"}
              <br />
              <Text strong>JSON Filename:</Text> {file.json_filename || "N/A"}
              <br />
              <Text strong>Uploaded at:</Text> {file.uploaded_at || "Unknown"}
              <div style={styles.buttonContainer}>
              <Button
                type="primary"
                onClick={() => downloadFile(file.video_id, file.processed_filename)}
                style={styles.downloadButton}
              >
               Download Video
              </Button>
              <Button
                type="primary"
                onClick={() => downloadFile(file.json_id, file.json_filename)}
                style={styles.downloadButton}
              >
               Download JSON
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    textAlign: "left",
  },
  buttonContainer: {
    marginTop: "10px",
    textAlign: "right",
  },
  downloadButton: {
    marginLeft: "10px",
  },
};

export default AnalysisFilesScreen;
