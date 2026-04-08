import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CoursesApi, EnrollmentsApi } from '../api';
import { useAuth } from '../state/auth.jsx';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError('');
    CoursesApi.byId(id)
      .then((r) => setCourse(r.data))
      .catch((e) => setError(e?.response?.data?.message || 'Kurs yüklenemedi.'));
  }, [id]);

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="alert">{error}</div>
          <Link to="/courses">← Kurslara dön</Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container">
        <div className="card">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="thumb-hero">
          <img className="thumb-hero-img" src={course.thumbnail_url || '/images/react.svg'} alt={course.title} />
        </div>
        <h2>{course.title}</h2>
        <div className="muted">
          {course.category_name || 'Kategori yok'} • Eğitmen: {(course.egitmen_ad || '') + ' ' + (course.egitmen_soyad || '')}
        </div>
        <p style={{ marginTop: 12 }}>{course.description}</p>

        {!user ? (
          <div className="row">
            <Link className="btn" to="/login">Kayıt olmak için giriş yap</Link>
          </div>
        ) : user.role !== 'ogrenci' ? (
          <div className="muted">Kayıt olma işlemi sadece öğrenciler için.</div>
        ) : (
          <button
            className="btn"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError('');
              try {
                await EnrollmentsApi.enroll(course.id);
                alert('Kursa kayıt oldunuz.');
              } catch (e) {
                alert(e?.response?.data?.message || 'Kayıt başarısız.');
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? '...' : 'Kursa kayıt ol'}
          </button>
        )}
      </div>
    </div>
  );
}

