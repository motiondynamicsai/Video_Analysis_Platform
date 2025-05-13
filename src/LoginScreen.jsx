import React, { useState } from "react";
import { Button, Input, Form, Typography, message, Card } from "antd";
import axios from "axios";
import * as jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginScreen = ({ onLogin }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token: access_token, username } = response.data;


      // Save token and username
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("username", username);

      // Decode user ID from JWT token
      const decoded = jwt_decode.jwtDecode(access_token);
      const userId = decoded.id || decoded.userId || decoded._id;
      if (userId) {
        localStorage.setItem("userId", userId);
      } else {
        console.warn("User ID not found in token:", decoded);
      }

      onLogin(); // Notify App
      navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Login error:", error.response);
      const detail = error.response?.data?.detail || error.message || "Unknown error";

      message.error(`Login failed: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <Title level={3} className="text-center mb-6">Welcome Back</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong>Password</Text>}
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginScreen;
