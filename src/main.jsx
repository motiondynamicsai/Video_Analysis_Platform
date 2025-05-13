import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
//import './index.css';
import App from './App';
import 'antd/dist/reset.css'; // for Ant Design v5+
import './index.css';

// ✅ Log to confirm .env is working
console.log("ENV API URL:", import.meta.env.VITE_API_BASE_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
