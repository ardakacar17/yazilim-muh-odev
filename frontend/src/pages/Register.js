import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ad: '', soyad: '', email: '', password: '', role: 'ogrenci' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      return setError('Şifre en az 6 karakter olmalıdır.');
    }
    setLoading(true);
    try {
      const data = await register(form);
      if (data.user.role === 'egitmen') navigate('/dashboard/egitmen');
      else navigate('/dashboard/ogrenci');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>🎓 SkillHub</h1>
          <p>Yeni hesap oluşturun</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Ad</label>
              <input type="text" name="ad" required placeholder="Adınız"
                value={form.ad} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Soyad</label>
              <input type="text" name="soyad" required placeholder="Soyadınız"
                value={form.soyad} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required placeholder="ornek@email.com"
              value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" name="password" required placeholder="En az 6 karakter"
              value={form.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Rol Seçin</label>
            <div className="role-selector">
              <label className={`role-option ${form.role === 'ogrenci' ? 'active' : ''}`}>
                <input type="radio" name="role" value="ogrenci"
                  checked={form.role === 'ogrenci'} onChange={handleChange} />
                <span className="role-icon">🎒</span>
                <span className="role-label">Öğrenci</span>
                <span className="role-desc">Kurslara katıl ve öğren</span>
              </label>
              <label className={`role-option ${form.role === 'egitmen' ? 'active' : ''}`}>
                <input type="radio" name="role" value="egitmen"
                  checked={form.role === 'egitmen'} onChange={handleChange} />
                <span className="role-icon">👨‍🏫</span>
                <span className="role-label">Eğitmen</span>
                <span className="role-desc">Kurs oluştur ve öğret</span>
              </label>
            </div>
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Kaydediliyor...</> : 'Kayıt Ol'}
          </button>
        </form>
        <p className="auth-footer">
          Zaten hesabınız var mı? <Link to="/login">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
