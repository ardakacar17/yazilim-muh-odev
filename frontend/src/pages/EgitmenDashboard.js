import React, { useState, useEffect } from 'react';
import { getMyCourses, createCourse, updateCourse, deleteCourse, getCategories } from '../api';
import CourseCard from '../components/CourseCard';
import './Dashboard.css';

const EgitmenDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category_id: '', durum: 'taslak', thumbnail_url: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const [cRes, catRes] = await Promise.all([getMyCourses(), getCategories()]);
      setCourses(cRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreate = () => {
    setEditingCourse(null);
    setForm({ title: '', description: '', category_id: '', durum: 'taslak', thumbnail_url: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description || '',
      category_id: course.category_id || '',
      durum: course.durum,
      thumbnail_url: course.thumbnail_url || ''
    });
    setFormError('');
    setShowModal(true);
  };

  // Task 5: Form validasyon + Task 6: API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (form.title.trim().length < 3) return setFormError('Başlık en az 3 karakter olmalıdır.');
    if (form.description.trim().length < 10) return setFormError('Açıklama en az 10 karakter olmalıdır.');
    setFormLoading(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, form);
        setSuccessMsg('Kurs güncellendi.');
      } else {
        await createCourse(form);
        setSuccessMsg('Kurs oluşturuldu.');
      }
      setShowModal(false);
      fetchCourses();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Hata oluştu.');
    } finally {
      setFormLoading(false);
    }
  };

  // Task 6: Sil
  const handleDelete = async (id) => {
    if (!window.confirm('Bu kursu silmek istediğinize emin misiniz?')) return;
    try {
      await deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      setSuccessMsg('Kurs silindi.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Silinemedi.');
    }
  };

  const stats = {
    total: courses.length,
    yayinda: courses.filter(c => c.durum === 'yayinda').length,
    taslak: courses.filter(c => c.durum === 'taslak').length,
    ogrenci: courses.reduce((sum, c) => sum + (c.kayit_sayisi || 0), 0)
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>👨‍🏫 Eğitmen Paneli</h1>
          <p>Kurslarınızı yönetin ve yeni içerikler oluşturun</p>
        </div>
      </div>

      <div className="container dashboard-body">
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* İstatistikler */}
        <div className="stats-grid">
          <div className="stat-card card"><div className="stat-num">{stats.total}</div><div className="stat-label">Toplam Kurs</div></div>
          <div className="stat-card card"><div className="stat-num" style={{ color: 'var(--success)' }}>{stats.yayinda}</div><div className="stat-label">Yayındaki</div></div>
          <div className="stat-card card"><div className="stat-num" style={{ color: 'var(--warning)' }}>{stats.taslak}</div><div className="stat-label">Taslak</div></div>
          <div className="stat-card card"><div className="stat-num" style={{ color: 'var(--secondary)' }}>{stats.ogrenci}</div><div className="stat-label">Toplam Öğrenci</div></div>
        </div>

        <div className="section-header">
          <h2>📋 Kurslarım</h2>
          <button className="btn btn-primary" onClick={openCreate}>+ Yeni Kurs</button>
        </div>

        {loading ? (
          <div className="page-loading"><div className="spinner" style={{ width: 36, height: 36 }} /></div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✏️</div>
            <h3>Henüz kurs oluşturmadınız</h3>
            <p>İlk kursunuzu oluşturmak için butona tıklayın.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openCreate}>+ Kurs Oluştur</button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} showActions onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Task 4 & 5: Modal form */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal card">
            <div className="modal-header">
              <h3>{editingCourse ? '✏️ Kursu Düzenle' : '➕ Yeni Kurs Oluştur'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {formError && <div className="alert alert-error">{formError}</div>}
              <div className="form-group">
                <label>Kurs Başlığı *</label>
                <input type="text" placeholder="En az 3 karakter" required
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Açıklama *</label>
                <textarea rows={4} placeholder="En az 10 karakter" required
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Kategori</label>
                  <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">-- Seçiniz --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Durum</label>
                  <select value={form.durum} onChange={e => setForm({ ...form, durum: e.target.value })}>
                    <option value="taslak">Taslak</option>
                    <option value="yayinda">Yayında</option>
                    <option value="arsivlendi">Arşivlendi</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Thumbnail URL (opsiyonel)</label>
                <input type="url" placeholder="https://..."
                  value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? <><span className="spinner" /> Kaydediliyor...</> : (editingCourse ? 'Güncelle' : 'Oluştur')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EgitmenDashboard;
