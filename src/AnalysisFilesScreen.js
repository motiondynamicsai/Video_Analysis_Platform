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

  // Download a specific file
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
      link.remove();
    } catch (error) {
      alert("Failed to download file: " + error.message);
    }
  };

  // Download all files in the current subfolder
  const downloadAllFiles = async () => {
    setDownloadProgress(0);
    for (let i = 0; i < files.length; i++) {
      await downloadFile(files[i].id, files[i].filename);
      setDownloadProgress(Math.round(((i + 1) / files.length) * 100));
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
            {downloadProgress > 0 && (
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${downloadProgress}%` }}>
                  {downloadProgress}%
                </div>
              </div>
            )}
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
