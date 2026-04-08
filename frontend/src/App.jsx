import React from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './state/auth.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CourseList from './pages/CourseList.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container"><div className="card">Yükleniyor...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">SkillHub</Link>
        <nav className="nav-links">
          <Link to="/courses">Kurslar</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
          {user && <Link to="/profile">Profil</Link>}
          {!user ? (
            <>
              <Link to="/login">Giriş</Link>
              <Link className="btn" to="/register">Kayıt</Link>
            </>
          ) : (
            <button
              className="btn"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Çıkış
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

