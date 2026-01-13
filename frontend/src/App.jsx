import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import Register from './components/pages/Register'
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';

const App = () => {
  return (
     <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App