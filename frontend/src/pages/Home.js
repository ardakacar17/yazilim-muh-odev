import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>Yeni Beceriler Kazan,<br />Kariyerini Geliştir 🚀</h1>
            <p>SkillHub ile uzman eğitmenlerden online kurslar alın. Kendi hızınızda öğrenin, ilerlemenizi takip edin.</p>
            <div className="hero-cta">
              <Link to="/courses" className="btn btn-primary btn-lg">Kurslara Göz At</Link>
              {!user && <Link to="/register" className="btn btn-outline btn-lg">Ücretsiz Kayıt Ol</Link>}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-icon">📊</div>
              <div>İlerleme takibi</div>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon">🎓</div>
              <div>Sertifika kazan</div>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon">👨‍🏫</div>
              <div>Uzman eğitmenler</div>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon">📱</div>
              <div>Mobil uyumlu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="container">
          <h2>Neden SkillHub?</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">🔍</div>
              <h3>Kolay Arama</h3>
              <p>Kategori ve anahtar kelime ile istediğiniz kursu saniyeler içinde bulun.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">📈</div>
              <h3>İlerleme Takibi</h3>
              <p>Her kursta ilerlemenizi görün, tamamladıklarınızı not edin.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">✏️</div>
              <h3>Eğitmen Ol</h3>
              <p>Alanınızda kurs oluşturun, öğrencilerinize ulaşın.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🔒</div>
              <h3>Güvenli Giriş</h3>
              <p>JWT tabanlı güvenli kimlik doğrulama ile verileriniz korunaklı.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="home-cta">
          <div className="container cta-inner">
            <h2>Hemen Başlayın</h2>
            <p>Ücretsiz kayıt olun, yüzlerce kursa erişin.</p>
            <div className="cta-buttons">
              <Link to="/register?role=ogrenci" className="btn btn-primary btn-lg">🎒 Öğrenci Ol</Link>
              <Link to="/register?role=egitmen" className="btn btn-outline btn-lg">👨‍🏫 Eğitmen Ol</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
