import React, { useState } from "react";
import { Button, Input, Form, Typography, message } from "antd";
import axios from "axios";

const { Title } = Typography;

const SignUpScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      message.error("Username, email, and password are required.");
      return;
    }

    try {
      const response = await axios.post("https://mody.tail92517b.ts.net:8000/auth/signup/", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      message.success(response.data.message);
    } catch (error) {
      message.error("Sign up failed: " + (error.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div style={styles.container}>
      <Title level={2}>Sign Up</Title>
      <Form style={styles.form}>
        <Form.Item>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
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
          <Button type="primary" onClick={handleSignUp} block>
            Sign Up
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

export default SignUpScreen;
