import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import UploadScreen from "./UploadScreen";
import AnalysisFilesScreen from "./AnalysisFilesScreen";
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Video Analysis Platform</h1>
          <nav>
            <Link to="/">Upload</Link>
            <Link to="/analysis-files">Analysis Files</Link>
            {isAuthenticated ? (
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpScreen />} />
            {isAuthenticated ? (
              <>
                <Route path="/" element={<UploadScreen />} />
                <Route path="/analysis-files" element={<AnalysisFilesScreen />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  logoutButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "1rem",
    marginLeft: "1rem",
  },
};

export default App;
