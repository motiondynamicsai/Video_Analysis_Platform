import React from "react";
import { HashRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import UploadScreen from "./UploadScreen";
import AnalysisFilesScreen from "./AnalysisFilesScreen";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Video Analysis Platform</h1>
          <nav>
            <Link to="/">Upload</Link>
            <Link to="/analysis-files">Analysis Files</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<UploadScreen />} />
            <Route path="/analysis-files" element={<AnalysisFilesScreen />} />
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
