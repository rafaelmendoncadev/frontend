import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Pressure from './pages/Pressure';
import Glucose from './pages/Glucose';
import Register from './pages/Register';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['x-auth-token'] = authToken;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [authToken]);

  return (
    <Router>
      <Navbar authToken={authToken} setAuthToken={setAuthToken} />
      <ToastContainer />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/" element={authToken ? <Dashboard /> : <Login setAuthToken={setAuthToken} />} />
        <Route path="/pressure" element={authToken ? <Pressure /> : <Login setAuthToken={setAuthToken} />} />
        <Route path="/glucose" element={authToken ? <Glucose /> : <Login setAuthToken={setAuthToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
