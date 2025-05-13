import React, { useState } from "react";
import { Button, Input, Form, Typography, message } from "antd";
import axios from "axios";

const { Title } = Typography;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUpScreen = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (values) => {
    const { username, email, password } = values;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      message.success(response.data.message || "Sign up successful!");
      form.resetFields();
    } catch (error) {
      const detail = error.response?.data?.detail || "Unknown error";
      message.error(`Sign up failed: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl">
      <Title level={3} className="text-center mb-6">Create Your Account</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSignUp}
        requiredMark={false}
      >
        <Form.Item
          name="username"
          label={<span className="font-medium">Username</span>}
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input size="large" placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="font-medium">Email</span>}
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input size="large" placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="font-medium">Password</span>}
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password size="large" placeholder="Enter password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            className="rounded-lg"
          >
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUpScreen;
