import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>SkillHub LMS</h1>
        <p>Kurs kataloğu, kayıt ve ilerleme takibi. Tamamen lokal çalışır.</p>
        <div className="row">
          <Link className="btn" to="/courses">Kursları Gör</Link>
          <Link className="btn secondary" to="/register">Hesap Oluştur</Link>
        </div>
      </div>
    </div>
  );
}

