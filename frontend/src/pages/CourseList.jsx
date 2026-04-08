import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CoursesApi } from '../api';

export default function CourseList() {
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CoursesApi.categories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const params = useMemo(() => {
    const p = { page: 1, limit: 50 };
    if (q.trim()) p.search = q.trim();
    if (categoryId) p.category_id = categoryId;
    return p;
  }, [q, categoryId]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    CoursesApi.list(params)
      .then((r) => {
        if (!alive) return;
        setCourses(r.data.courses);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || 'Kurslar yüklenemedi.');
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [params]);

  return (
    <div className="container">
      <div className="card">
        <h2>Kurslar</h2>
        <div className="filters">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara: başlık / açıklama" />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="alert">{error}</div>}
        {loading ? (
          <div className="muted">Yükleniyor...</div>
        ) : courses.length === 0 ? (
          <div className="muted">Yayınlanmış kurs yok.</div>
        ) : (
          <div className="grid">
            {courses.map((c) => (
              <Link key={c.id} className="course" to={`/courses/${c.id}`}>
                <div className="thumb-wrap">
                  <img className="thumb" src={c.thumbnail_url || '/images/react.svg'} alt={c.title} loading="lazy" />
                </div>
                <div className="course-title">{c.title}</div>
                <div className="muted">{c.category_name || 'Kategori yok'}</div>
                <div className="course-desc">{(c.description || '').slice(0, 120)}{(c.description || '').length > 120 ? '…' : ''}</div>
                <div className="course-meta">
                  <span>{(c.egitmen_ad || '') + ' ' + (c.egitmen_soyad || '')}</span>
                  <span>{c.kayit_sayisi} kayıt</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

