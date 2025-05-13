import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AnalysisFilesScreen = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/files/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const handleDownload = async (fileId, filename, contentType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: contentType });
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
      message.error("Download failed");
    }
  };

  const handleDeleteBoth = async (videoId, jsonId) => {
    try {
      if (videoId) {
        await axios.delete(`${API_BASE_URL}/files/${videoId}?type=video`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      if (jsonId) {
        await axios.delete(`${API_BASE_URL}/files/${jsonId}?type=json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      message.success("Files deleted successfully");
      await fetchFiles(); // force sync from backend
    } catch (error) {
      console.error("Error deleting files:", error);
      message.error("Failed to delete files");
    }
  };

  const downloadAll = async (type) => {
    for (const file of files) {
      if (type === "videos" && file.video_id) {
        await handleDownload(file.video_id, file.processed_filename, "video/mp4");
      } else if (type === "jsons" && file.json_id) {
        await handleDownload(file.json_id, file.json_filename, "application/json");
      }
    }
  };

  return (
    <div className="w-full px-4 py-6 md:px-8 md:pl-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Your Files</h2>
        <div className="flex gap-3">
          <button
            onClick={() => downloadAll("videos")}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Download All Videos
          </button>
          <button
            onClick={() => downloadAll("jsons")}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Download All JSONs
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading files...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {files.map(({
            filename,
            processed_filename,
            json_filename,
            uploaded_at,
            video_id,
            json_id,
          }) => (
            <div
              key={video_id || json_id}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
            >
              <div className="mb-2">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Original Filename:</span> {filename || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Processed Filename:</span> {processed_filename || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">JSON Filename:</span> {json_filename || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Uploaded at:</span> {uploaded_at || "Unknown"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  onClick={() => handleDownload(video_id, processed_filename, "video/mp4")}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                >
                  Download Video
                </button>
                <button
                  onClick={() => handleDownload(json_id, json_filename, "application/json")}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                >
                  Download JSON
                </button>
                <button
                  onClick={() => handleDeleteBoth(video_id, json_id)}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                >
                  Delete Files
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisFilesScreen;
