import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar/Sidebar';
import Toast from './components/common/Toast/Toast';
import Home from './pages/Home/Home';
import JsonFormatter from './pages/JsonFormatter/JsonFormatter';
import JwtDecoder from './pages/JwtDecoder/JwtDecoder';
import Base64Tool from './pages/Base64Tool/Base64Tool';
import ApiTester from './pages/ApiTester/ApiTester';
import './App.css';

function App() {
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="/jwt-decoder" element={<JwtDecoder />} />
              <Route path="/base64" element={<Base64Tool />} />
              <Route path="/api-tester" element={<ApiTester />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={hideToast}
        />
      </div>
    </Router>
  );
}

export default App;
