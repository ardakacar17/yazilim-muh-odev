import React, { useState, useEffect } from 'react';
import { getMyEnrollments, updateProgress, unenrollCourse } from '../api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const OgrenciDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await getMyEnrollments();
      setEnrollments(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEnrollments(); }, []);

  // UC4: İlerleme güncelle
  const handleProgress = async (courseId, value) => {
    setUpdating(courseId);
    try {
      await updateProgress(courseId, parseInt(value));
      setEnrollments(prev => prev.map(e =>
        e.course_id === courseId
          ? { ...e, ilerleme: parseInt(value), tamamlandi: parseInt(value) === 100 }
          : e
      ));
      setSuccessMsg('İlerleme güncellendi!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Hata.');
    } finally {
      setUpdating(null);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Bu kurstan ayrılmak istediğinize emin misiniz?')) return;
    try {
      await unenrollCourse(courseId);
      setEnrollments(prev => prev.filter(e => e.course_id !== courseId));
    } catch (err) {
      alert(err.response?.data?.message || 'Hata.');
    }
  };

  const stats = {
    total: enrollments.length,
    tamamlanan: enrollments.filter(e => e.tamamlandi).length,
    devam: enrollments.filter(e => !e.tamamlandi && e.ilerleme > 0).length,
    ortalama: enrollments.length
      ? Math.round(enrollments.reduce((s, e) => s + e.ilerleme, 0) / enrollments.length)
      : 0
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>🎒 Öğrenci Paneli</h1>
          <p>Kayıtlı kurslarınızı takip edin</p>
        </div>
      </div>

      <div className="container dashboard-body">
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <div className="stats-grid">
          <div className="stat-card card"><div className="stat-num">{stats.total}</div><div className="stat-label">Kayıtlı Kurs</div></div>
          <div className="stat-card card"><div className="stat-num" style={{ color: 'var(--success)' }}>{stats.tamamlanan}</div><div className="stat-label">Tamamlanan</div></div>
          <div className="stat-card card"><div className="stat-num" style={{ color: 'var(--warning)' }}>{stats.devam}</div><div className="stat-label">Devam Eden</div></div>
          <div className="stat-card card"><div className="stat-num" style={{ color: 'var(--primary)' }}>%{stats.ortalama}</div><div className="stat-label">Ort. İlerleme</div></div>
        </div>

        <div className="section-header">
          <h2>📚 Kurslarım</h2>
          <Link to="/courses" className="btn btn-outline btn-sm">+ Yeni Kurs Bul</Link>
        </div>

        {loading ? (
          <div className="page-loading"><div className="spinner" style={{ width: 36, height: 36 }} /></div>
        ) : enrollments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Henüz bir kursa kayıt olmadınız</h3>
            <p>Kurs kataloğunu inceleyin ve öğrenmeye başlayın.</p>
            <Link to="/courses" className="btn btn-primary" style={{ marginTop: 16 }}>Kurslara Göz At</Link>
          </div>
        ) : (
          <div className="enrollment-list">
            {enrollments.map(e => (
              <div key={e.id} className="enrollment-card card">
                <div className="enrollment-thumb">
                  {e.thumbnail_url
                    ? <img src={e.thumbnail_url} alt={e.title} />
                    : <div className="thumb-placeholder small">📚</div>
                  }
                </div>
                <div className="enrollment-body">
                  <div className="enrollment-top">
                    {e.category_name && <span className="badge badge-primary">{e.category_name}</span>}
                    {e.tamamlandi && <span className="badge badge-success">🏆 Tamamlandı</span>}
                  </div>
                  <h3 className="enrollment-title">{e.title}</h3>
                  <p className="enrollment-meta">👨‍🏫 {e.egitmen_ad} {e.egitmen_soyad}</p>

                  {/* UC4: İlerleme takibi */}
                  <div className="progress-section">
                    <div className="progress-label">
                      <span>İlerleme</span>
                      <span>{e.ilerleme}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${e.ilerleme}%` }} /></div>
                    <input
                      type="range" min="0" max="100" value={e.ilerleme}
                      className="progress-range"
                      disabled={updating === e.course_id}
                      onChange={ev => handleProgress(e.course_id, ev.target.value)}
                    />
                  </div>
                </div>
                <div className="enrollment-actions">
                  <Link to={`/courses/${e.course_id}`} className="btn btn-secondary btn-sm">Detay</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleUnenroll(e.course_id)}>
                    Ayrıl
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OgrenciDashboard;
