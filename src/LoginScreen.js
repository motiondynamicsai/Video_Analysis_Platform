import React, { useState } from "react";
import { Button, Input, Form, Typography, message } from "antd";
import axios from "axios";

const { Title } = Typography;

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
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
    }
  };

  return (
    <div style={styles.container}>
      <Title level={2}>Login</Title>
      <Form style={styles.form}>
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
          <Button type="primary" onClick={handleLogin} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    maxWidth: "400px",
    margin: "0 auto",
  },
  form: {
    width: "100%",
  },
};

export default LoginScreen;
