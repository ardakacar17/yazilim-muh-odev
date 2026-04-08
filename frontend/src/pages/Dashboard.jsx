import React, { useEffect, useState } from 'react';
import { CoursesApi, EnrollmentsApi } from '../api';
import { useAuth } from '../state/auth.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'egitmen' ? <TeacherDashboard /> : <StudentDashboard />;
}

function TeacherDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', durum: 'yayinda' });
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const r = await CoursesApi.my();
    setMyCourses(r.data);
  }

  useEffect(() => {
    refresh().catch((e) => setError(e?.response?.data?.message || 'Yüklenemedi.'));
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Eğitmen Paneli</h2>
        {error && <div className="alert">{error}</div>}

        <h3>Yeni kurs</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await CoursesApi.create(form);
              setForm({ title: '', description: '', durum: 'yayinda' });
              await refresh();
            } catch (err) {
              alert(err?.response?.data?.message || 'Oluşturma başarısız.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="grid2">
            <label>
              Başlık
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label>
              Durum
              <select value={form.durum} onChange={(e) => setForm({ ...form, durum: e.target.value })}>
                <option value="taslak">Taslak</option>
                <option value="yayinda">Yayında</option>
              </select>
            </label>
          </div>
          <label>
            Açıklama
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          </label>
          <button className="btn" disabled={busy}>{busy ? '...' : 'Oluştur'}</button>
        </form>

        <h3 style={{ marginTop: 18 }}>Kurslarım</h3>
        {myCourses.length === 0 ? (
          <div className="muted">Henüz kurs yok.</div>
        ) : (
          <div className="grid">
            {myCourses.map((c) => (
              <div key={c.id} className="course">
                <div className="course-title">{c.title}</div>
                <div className="muted">{c.durum}</div>
                <div className="row" style={{ marginTop: 10 }}>
                  <button
                    className="btn secondary"
                    onClick={async () => {
                      const durum = c.durum === 'yayinda' ? 'taslak' : 'yayinda';
                      await CoursesApi.update(c.id, { durum });
                      await refresh();
                    }}
                  >
                    Durum değiştir
                  </button>
                  <button
                    className="btn danger"
                    onClick={async () => {
                      if (!confirm('Silinsin mi?')) return;
                      await CoursesApi.remove(c.id);
                      await refresh();
                    }}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  async function refresh() {
    const r = await EnrollmentsApi.my();
    setItems(r.data);
  }

  useEffect(() => {
    refresh().catch((e) => setError(e?.response?.data?.message || 'Yüklenemedi.'));
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Öğrenci Paneli</h2>
        {error && <div className="alert">{error}</div>}
        {items.length === 0 ? (
          <div className="muted">Henüz kayıtlı kurs yok.</div>
        ) : (
          <div className="grid">
            {items.map((e) => (
              <div key={e.id} className="course">
                <div className="course-title">{e.title}</div>
                <div className="muted">{e.ilerleme}%</div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={e.ilerleme}
                  onChange={async (ev) => {
                    const ilerleme = Number(ev.target.value);
                    await EnrollmentsApi.progress(e.course_id, ilerleme);
                    await refresh();
                  }}
                />
                <button
                  className="btn danger"
                  onClick={async () => {
                    if (!confirm('Kayıttan ayrıl?')) return;
                    await EnrollmentsApi.unenroll(e.course_id);
                    await refresh();
                  }}
                >
                  Kayıttan ayrıl
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

