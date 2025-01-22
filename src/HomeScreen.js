import React, { useState, useEffect } from "react";
import { Typography, List, Card, message, Avatar, Button, Space } from "antd";
import { PlayCircleOutlined, UserOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const HomeScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      try {
        const response = await axios.get("https://mody.tail92517b.ts.net:8000/videoFiles/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVideos(response.data);
      } catch (error) {
        message.error("Failed to fetch videos: " + (error.response?.data?.detail || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const fetchVideoBlob = async (videoId) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await axios.get(`https://mody.tail92517b.ts.net:8000/stream_video/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      message.error("Failed to load video: " + (error.response?.data?.detail || "Unknown error"));
      return null;
    }
  };

  return (
    <div style={styles.container}>
      <Title level={2} style={styles.title}>Video Feed</Title>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 1 }}
        dataSource={videos}
        renderItem={(video) => (
          <List.Item>
            <Card style={styles.card} hoverable>
              <div style={styles.header}>
                <Avatar size="large" icon={<UserOutlined />} />
                <Text strong style={styles.username}>User Name</Text>
              </div>
              <VideoPlayer videoId={video.video_id} filename={video.filename} fetchVideoBlob={fetchVideoBlob} />
              <div style={styles.actions}>
                <Space>
                  <Button type="link" icon={<PlayCircleOutlined />} style={styles.actionButton}>Play</Button>
                  <Button type="link" icon={<LikeOutlined />} style={styles.actionButton}>Like</Button>
                  <Button type="link" icon={<ShareAltOutlined />} style={styles.actionButton}>Share</Button>
                </Space>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

const VideoPlayer = ({ videoId, filename, fetchVideoBlob }) => {
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      const src = await fetchVideoBlob(videoId);
      setVideoSrc(src);
    };
    loadVideo();
  }, [videoId, fetchVideoBlob]);

  return (
    <div style={styles.videoContainer}>
      <video controls width="100%"  src={videoSrc} style={styles.video} />
      <Text style={styles.filename}>{filename}</Text>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#f0f2f5",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  card: {
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    backgroundColor: "#fff",
    transition: "transform 0.3s",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  username: {
    marginLeft: "10px",
    fontSize: "16px",
    color: "#555",
  },
  videoContainer: {
    position: "relative",
    marginBottom: "10px",
  },
  video: {
    borderRadius: "8px",
    maxHeight: "600px",
  },
  filename: {
    display: "block",
    textAlign: "center",
    marginTop: "5px",
    color: "#888",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  actionButton: {
    fontSize: "16px",
    color: "#1890ff",
  },
};

export default HomeScreen; 