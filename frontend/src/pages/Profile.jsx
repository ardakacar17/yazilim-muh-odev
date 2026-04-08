import React, { useEffect, useState } from 'react';
import { AuthApi } from '../api';
import { useAuth } from '../state/auth.jsx';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ ad: '', soyad: '', bio: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ ad: user.ad || '', soyad: user.soyad || '', bio: user.bio || '' });
  }, [user]);

  return (
    <div className="container">
      <div className="card">
        <h2>Profil</h2>
        <div className="muted">{user?.email} • {user?.role}</div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await AuthApi.updateProfile(form);
              alert('Güncellendi.');
            } catch (err) {
              alert(err?.response?.data?.message || 'Güncelleme başarısız.');
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
            Bio
            <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </label>
          <button className="btn" disabled={busy}>{busy ? '...' : 'Kaydet'}</button>
        </form>
      </div>
    </div>
  );
}

