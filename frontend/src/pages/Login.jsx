import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <div className="container">
      <div className="card">
        <h2>Giriş</h2>
        {error && <div className="alert">{error}</div>}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setBusy(true);
            try {
              await login(email, password);
              navigate('/dashboard');
            } catch (err) {
              setError(err?.response?.data?.message || 'Giriş başarısız.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mail@ornek.com" />
          </label>
          <label>
            Şifre
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button className="btn" disabled={busy}>{busy ? '...' : 'Giriş yap'}</button>
        </form>
        <p className="muted">
          Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
        </p>
      </div>
    </div>
  );
}

