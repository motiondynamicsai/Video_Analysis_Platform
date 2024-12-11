import React, { useState, useEffect } from "react";
import './AnalysisFilesScreen.css'; // Import the CSS file

function AnalysisFilesScreen() {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [currentSubfolder, setCurrentSubfolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Fetch group list from the server
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("https://mody.tail92517b.ts.net:8000/groups/");
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        alert("Failed to fetch groups: " + error.message);
      }
    };

    fetchGroups();
  }, []);

  // Fetch subfolders in a specific group
  const openGroup = async (groupName) => {
    try {
      const response = await fetch(`https://mody.tail92517b.ts.net:8000/groups/${groupName}/`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setCurrentGroup(groupName);
      setSubfolders(data);
    } catch (error) {
      alert("Failed to fetch subfolders: " + error.message);
    }
  };

  // Fetch files in a specific subfolder
  const openSubfolder = async (subfolderName) => {
    try {
      const endpoint = subfolderName === "videos" ? "videos" : "jsons";
      const response = await fetch(`https://mody.tail92517b.ts.net:8000/groups/${currentGroup}/${endpoint}/`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setCurrentSubfolder(subfolderName);
      setFiles(data);
    } catch (error) {
      alert("Failed to fetch files: " + error.message);
    }
  };

  // Reusable function for batching downloads
const downloadBatch = async (batch, updateProgress) => {
  await Promise.all(
    batch.map(async (file) => {
      try {
        await downloadFile(file.id, file.filename);
        updateProgress();
      } catch (error) {
        console.error(`Failed to download file: ${file.filename}`, error);
      }
    })
  );
};

// Download all files with dynamic concurrency control
const downloadAllFiles = async () => {
  try {
    setDownloadProgress(0);

    const totalFiles = files.length;
    if (totalFiles === 0) {
      alert("No files to download.");
      return;
    }

    // Track completed downloads
    let completed = 0;

    // Function to update progress efficiently
    const updateProgress = () => {
      completed++;
      const progress = Math.round((completed / totalFiles) * 100);
      setDownloadProgress(progress);
    };

    // Dynamic concurrency control
    const MAX_CONCURRENT_DOWNLOADS = navigator.connection?.effectiveType === "4g" ? 10 : 5;

    // Process files in batches
    for (let i = 0; i < files.length; i += MAX_CONCURRENT_DOWNLOADS) {
      const batch = files.slice(i, i + MAX_CONCURRENT_DOWNLOADS);
      await downloadBatch(batch, updateProgress);
    }

    alert("All files downloaded successfully!");
  } catch (error) {
    console.error("Error during download all files:", error);
    alert("An error occurred while downloading all files.");
  }
};

// Single file download function
const downloadFile = async (fileId, fileName) => {
  try {
    const response = await fetch(`https://mody.tail92517b.ts.net:8000/files/${fileId}`);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(`Failed to download file (${fileName}): ${error.message}`);
  }
};


  return (
    <div className="analysis-files-screen">
      <h2>Analysis Files</h2>
      {currentGroup ? (
        currentSubfolder ? (
          <div className="file-view">
            <button className="back-button" onClick={() => setCurrentSubfolder(null)}>Back to Subfolders</button>
            <h3>Files in {currentSubfolder}</h3>
            <button className="download-all-button" onClick={downloadAllFiles}>Download All</button>
            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  {file.filename}
                  <button className="download-button" onClick={() => downloadFile(file.id, file.filename)}>Download</button>
                </li>
              ))}
            </ul>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${downloadProgress}%` }}>
                {downloadProgress}%
              </div>
            </div>
          </div>
        ) : (
          <div className="subfolder-view">
            <button className="back-button" onClick={() => setCurrentGroup(null)}>Back to Groups</button>
            <h3>Subfolders in {currentGroup}</h3>
            <ul className="subfolder-list">
              {subfolders.map((subfolder, index) => (
                <li key={index} className="subfolder-item">
                  <button className="subfolder-button" onClick={() => openSubfolder(subfolder)}>{subfolder}</button>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : (
        <div className="group-view">
          <h3>Groups</h3>
          <ul className="group-list">
            {groups.map((group, index) => (
              <li key={index} className="group-item">
                <button className="group-button" onClick={() => openGroup(group)}>{group}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AnalysisFilesScreen;
