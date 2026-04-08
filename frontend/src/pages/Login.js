import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.user.role === 'egitmen') navigate('/dashboard/egitmen');
      else navigate('/dashboard/ogrenci');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <h1>🎓 SkillHub</h1>
          <p>Hesabınıza giriş yapın</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email" name="email" required
              placeholder="ornek@email.com"
              value={form.email} onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password" name="password" required
              placeholder="Şifrenizi girin"
              value={form.password} onChange={handleChange}
            />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Giriş yapılıyor...</> : 'Giriş Yap'}
          </button>
        </form>
        <p className="auth-footer">
          Hesabınız yok mu? <Link to="/register">Kayıt Olun</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
