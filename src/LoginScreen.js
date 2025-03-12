import React, { useState } from "react";
import { Button, Input, Form, Typography, message } from "antd";
import axios from "axios";

const { Title } = Typography;

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      message.error('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post("https://mody.tail92517b.ts.net:8000/auth/login/", {
        email: email.trim().toLowerCase(),
        password,
      });
      const { access_token, username } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("username", username);
      onLogin();
    } catch (error) {
      message.error("Login failed: " + (error.response?.data?.detail || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={4} style={{ marginBottom: 24 }}>Existing Users</Title>
      <Form layout="vertical">
        <Form.Item>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            onClick={handleLogin} 
            block
            loading={loading}
            style={{ height: 42 }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginScreen;
