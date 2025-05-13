import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlayCircleOutlined,
  UserOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HomeScreen = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username") || "";
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/videoFiles/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVideos(response.data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [token]);

  return (
    <div className="w-full px-4 py-6 md:px-8 md:pl-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <InfoCard title="Upload Video" desc="Submit a new video for analysis" />
        <InfoCard title="View Analysis" desc="Access your previously analyzed videos" />
        <InfoCard title="About This App" desc="Learn about what this app does" />
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recent Videos</h3>
      {loading ? (
        <p className="text-gray-600">Loading videos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.video_id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserOutlined className="text-gray-500" />
                </div>
                <span className="font-medium text-gray-700">{username}</span>
              </div>
              <VideoPlayer videoId={video.video_id} />
              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <Action icon={<PlayCircleOutlined />} label="See Analysis" />
                <Action icon={<LikeOutlined />} label="Like" />
                <Action icon={<ShareAltOutlined />} label="Share" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

const Action = ({ icon, label }) => (
  <button className="hover:text-blue-600 flex items-center gap-1">
    {icon}
    <span>{label}</span>
  </button>
);

const VideoPlayer = ({ videoId }) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/video_url?videoId=${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideoSrc(response.data.url);
      } catch (error) {
        console.error("Failed to get signed video URL:", error);
      }
    };

    fetchSignedUrl();
  }, [videoId]);

  return videoSrc ? (
    <video
      controls
      onError={(e) => console.error("Video element error:", e)}
      preload="metadata" 
      className="w-full rounded-md max-h-56 object-cover border border-gray-200"
      src={videoSrc}
    />
  ) : (
    <p className="text-sm text-gray-500">Loading video...</p>
  );
};

export default HomeScreen;
