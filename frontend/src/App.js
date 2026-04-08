import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import EgitmenDashboard from './pages/EgitmenDashboard';
import OgrenciDashboard from './pages/OgrenciDashboard';
import Profil from './pages/Profil';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Genel rotalar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Korumalı rotalar */}
          <Route path="/dashboard/egitmen" element={
            <ProtectedRoute role="egitmen"><EgitmenDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/ogrenci" element={
            <ProtectedRoute role="ogrenci"><OgrenciDashboard /></ProtectedRoute>
          } />
          <Route path="/profil" element={
            <ProtectedRoute><Profil /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
