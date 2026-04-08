import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ad: '', soyad: '', email: '', password: '', role: 'ogrenci' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <div className="container">
      <div className="card">
        <h2>Kayıt</h2>
        {error && <div className="alert">{error}</div>}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setBusy(true);
            try {
              await register(form);
              navigate('/dashboard');
            } catch (err) {
              setError(err?.response?.data?.message || 'Kayıt başarısız.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="grid2">
            <label>
              Ad
              <input value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} />
            </label>
            <label>
              Soyad
              <input value={form.soyad} onChange={(e) => setForm({ ...form, soyad: e.target.value })} />
            </label>
          </div>
          <label>
            Email
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Şifre
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <label>
            Rol
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="ogrenci">Öğrenci</option>
              <option value="egitmen">Eğitmen</option>
            </select>
          </label>
          <button className="btn" disabled={busy}>{busy ? '...' : 'Kayıt ol'}</button>
        </form>
        <p className="muted">
          Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}

