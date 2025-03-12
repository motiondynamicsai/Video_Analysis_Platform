import React, { useState, useEffect } from "react";
import { Typography, List, Card, message, Avatar, Button, Space } from "antd";
import { PlayCircleOutlined, UserOutlined, LikeOutlined, ShareAltOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const HomeScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username") || "";
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
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
  }, [token]);

  return (
    <div style={styles.container}>
      <Title level={4} style={{ marginBottom: 24 }}>Recent Videos</Title>
      <List
        style={styles.list}
        loading={loading}
        grid={{ gutter: 16, column: 1 }}
        dataSource={videos}
        renderItem={(video) => (
          <List.Item>
            <Card style={styles.card} hoverable>
              <div style={styles.header}>
                <Avatar size="large" icon={<UserOutlined />} />
                <Text strong style={styles.username}>{username}</Text>
              </div>
              <VideoPlayer videoId={video.video_id} />
              <div style={styles.actions}>
                <Space>
                  <Button type="link" icon={<PlayCircleOutlined />} style={styles.actionButton}>See Analysis</Button>
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

const VideoPlayer = ({ videoId }) => {
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        message.error("No access token found.");
        return;
      }

      try {
        const response = await fetch(`https://mody.tail92517b.ts.net:8000/stream_video/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }

        const blob = await response.blob();
        setVideoSrc(URL.createObjectURL(blob));
      } catch (error) {
        message.error("Failed to load video: " + error.message);
      }
    };

    fetchVideo();

    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc);
    };
  }, [videoId]);

  return (
    <div style={styles.videoContainer}>
      {videoSrc ? (
        <video controls width="100%" style={styles.video} src={videoSrc} />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    padding: 24,
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  list: {
    height: 'calc(100% - 64px)',
    overflowY: 'auto',
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
