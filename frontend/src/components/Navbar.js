import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          🎓 <span>SkillHub LMS</span>
        </Link>

        <div className="navbar-links">
          <Link to="/courses" className="nav-link">Kurslar</Link>

          {user ? (
            <>
              {user.role === 'egitmen' ? (
                <Link to="/dashboard/egitmen" className="nav-link">Dashboard</Link>
              ) : (
                <Link to="/dashboard/ogrenci" className="nav-link">Dashboard</Link>
              )}
              <Link to="/profil" className="nav-link">Profil</Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Giriş Yap</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
