import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api';
import './Profil.css';

const Profil = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ ad: user?.ad || '', soyad: user?.soyad || '', bio: user?.bio || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await updateProfile({ ad: form.ad, soyad: form.soyad, bio: form.bio });
      // LocalStorage'daki user'ı güncelle
      const updatedUser = { ...user, ad: form.ad, soyad: form.soyad, bio: form.bio };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMsg('✅ Profil güncellendi.');
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Güncelleme başarısız.'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return setPwMsg('❌ Yeni şifreler eşleşmiyor.');
    }
    if (pwForm.newPassword.length < 6) {
      return setPwMsg('❌ Yeni şifre en az 6 karakter olmalıdır.');
    }
    setPwLoading(true);
    try {
      await updateProfile({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg('✅ Şifre başarıyla değiştirildi.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg('❌ ' + (err.response?.data?.message || 'Şifre değiştirilemedi.'));
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="profil-page">
      <div className="container profil-body">
        <h1 className="profil-title">👤 Profilim</h1>

        <div className="profil-grid">
          {/* Sol: Avatar ve bilgi */}
          <div className="profil-sidebar">
            <div className="card profil-avatar-card">
              <div className="avatar-circle">
                {user?.ad?.[0]}{user?.soyad?.[0]}
              </div>
              <div className="avatar-name">{user?.ad} {user?.soyad}</div>
              <div className="avatar-email">{user?.email}</div>
              <span className={`badge ${user?.role === 'egitmen' ? 'badge-primary' : 'badge-success'}`}>
                {user?.role === 'egitmen' ? '👨‍🏫 Eğitmen' : '🎒 Öğrenci'}
              </span>
            </div>
          </div>

          {/* Sağ: Formlar */}
          <div className="profil-forms">
            {/* Profil Bilgileri */}
            <div className="card profil-section">
              <h2>📋 Profil Bilgileri</h2>
              {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
              <form onSubmit={handleProfileUpdate}>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Ad</label>
                    <input type="text" required value={form.ad}
                      onChange={e => setForm({ ...form, ad: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Soyad</label>
                    <input type="text" required value={form.soyad}
                      onChange={e => setForm({ ...form, soyad: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Biyografi (opsiyonel)</label>
                  <textarea rows={3} placeholder="Kendinizden bahsedin..."
                    value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? <><span className="spinner" /> Kaydediliyor...</> : 'Kaydet'}
                </button>
              </form>
            </div>

            {/* Şifre Değiştir */}
            <div className="card profil-section">
              <h2>🔐 Şifre Değiştir</h2>
              {pwMsg && <div className={`alert ${pwMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{pwMsg}</div>}
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Mevcut Şifre</label>
                  <input type="password" required value={pwForm.currentPassword}
                    onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Yeni Şifre</label>
                    <input type="password" required placeholder="En az 6 karakter"
                      value={pwForm.newPassword}
                      onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Yeni Şifre (Tekrar)</label>
                    <input type="password" required
                      value={pwForm.confirmPassword}
                      onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" disabled={pwLoading}>
                  {pwLoading ? <><span className="spinner" /> Değiştiriliyor...</> : 'Şifreyi Değiştir'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
