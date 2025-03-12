import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Layout, Menu, Button, Space, Modal, Tabs, Typography } from "antd";
import {
  HomeOutlined,
  UploadOutlined,
  FolderOutlined,
  SettingOutlined,
  LoginOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import UploadScreen from "./UploadScreen";
import AnalysisFilesScreen from "./AnalysisFilesScreen";
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import HomeScreen from "./HomeScreen";
import "./App.css";

const { Sider, Content } = Layout;
const { Text, Title } = Typography;


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const username = localStorage.getItem("username") || "";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const shouldShowModal = !token && !localStorage.getItem("dismissedLogin");
    setIsAuthenticated(!!token);
    setShowLoginModal(shouldShowModal);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
  };

  const handleProtectedNavigation = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const contentStyle = {
    padding: '24px 5%',
    marginTop: 64,
    marginLeft: isCollapsed ? 0 : 240,
    minHeight: 'calc(100vh - 64px)',
    transition: 'margin 0.3s',
    background: '#ffffff',
    borderRadius: '8px 0 0 0',
    boxShadow: '-2px 0 8px rgba(0,0,0,0.05)'
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          width={240}
          theme="light"
          style={{
            position: 'fixed',
            height: '100vh',
            left: 0,
            zIndex: 2,
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            transform: isMobile && isCollapsed ? 'translateX(-100%)' : 'none',
            transition: 'transform 0.3s',
            background: '#f8fafc'
          }}
        >
          <div style={{ 
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            height: "100%"
          }}>
            <Menu 
              mode="vertical" 
              style={{ border: "none", background: 'transparent' }}
              theme="light"
            >
              <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/" onClick={handleProtectedNavigation}>Home</Link>
              </Menu.Item>
              <Menu.Item key="upload" icon={<UploadOutlined />}>
                <Link to="/upload" onClick={handleProtectedNavigation}>Upload</Link>
              </Menu.Item>
              <Menu.Item key="analysis" icon={<FolderOutlined />}>
                <Link to="/analysis-files" onClick={handleProtectedNavigation}>Analysis Files</Link>
              </Menu.Item>
            </Menu>

            <div style={{ marginTop: "auto", padding: "16px" }}>
              <Button
                block
                icon={<SettingOutlined />}
                style={{ marginBottom: "8px" }}
                onClick={() => !isAuthenticated ? setShowLoginModal(true) : setSettingsVisible(true)}
              >
                Settings
              </Button>
              {isAuthenticated ? (
                <Button block danger icon={<LoginOutlined />} onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button 
                  block 
                  type="primary" 
                  icon={<UserOutlined />}
                  onClick={() => setShowLoginModal(true)}
                >
                  Sign Up/Login
                </Button>
              )}
            </div>
          </div>
        </Sider>

        <Layout style={{ marginLeft: 240 }}>
          <div style={{ 
            ...headerStyle, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            backdropFilter: 'blur(8px)',
            background: 'rgba(255,255,255,0.8)'
          }}>
            <Space>
              <Button 
                icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setIsCollapsed(!isCollapsed)}
                shape="circle"
              />
              <Text strong style={{ 
                fontSize: 16,
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {username || 'Guest'}
              </Text>
            </Space>
          </div>
          
          {showLoginModal && (
            <Modal
              title="Welcome to Video Analysis Platform"
              visible={showLoginModal}
              onCancel={() => {
                setShowLoginModal(false);
                localStorage.setItem("dismissedLogin", "true");
              }}
              footer={[
                <Button 
                  key="cancel" 
                  onClick={() => {
                    setShowLoginModal(false);
                    localStorage.setItem("dismissedLogin", "true");
                  }}
                >
                  Stay Logged Out
                </Button>
              ]}
              centered
              width={400}
            >
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Login" key="1">
                  <LoginScreen 
                    onLogin={() => {
                      setIsAuthenticated(true);
                      setShowLoginModal(false);
                    }} 
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Sign Up" key="2">
                  <SignUpScreen
                    onLogin={() => {
                      setIsAuthenticated(true);
                      setShowLoginModal(false);
                    }}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Modal>
          )}

          <Content style={contentStyle}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route 
                path="/upload" 
                element={isAuthenticated ? <UploadScreen /> : (
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <Title level={2}>Please Login</Title>
                    <Text type="secondary">You must be logged in to access this page</Text>
                    <br/>
                    <Button type="primary" onClick={() => setShowLoginModal(true)} style={{ marginTop: 16 }}>
                      Login/Sign Up
                    </Button>
                  </div>
                )}
              />
              <Route 
                path="/analysis-files" 
                element={isAuthenticated ? <AnalysisFilesScreen /> : (
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <Title level={2}>Please Login</Title>
                    <Text type="secondary">You must be logged in to access this page</Text>
                    <br/>
                    <Button type="primary" onClick={() => setShowLoginModal(true)} style={{ marginTop: 16 }}>
                      Login/Sign Up
                    </Button>
                  </div>
                )}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

const headerStyle = {
  padding: '0 24px',
  height: 64,
  lineHeight: '64px',
  background: '#fff',
  borderBottom: '1px solid #f0f0f0',
  position: 'sticky',
  top: 0,
  zIndex: 1
};

// const contentStyle = {
//   padding: 24,
//   minHeight: 'calc(100vh - 64px)',
//   background: '#f8f9fa',
//   marginLeft: isMobile ? (isCollapsed ? 0 : 240) : 240,
//   transition: 'margin 0.3s',
//   maxWidth: isMobile && !isCollapsed ? 'calc(100% - 240px)' : '100%',
//   margin: '0 auto'
// };

export default App;
