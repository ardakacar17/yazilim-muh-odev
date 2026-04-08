import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, enrollCourse, getMyEnrollments } from '../api';
import { useAuth } from '../context/AuthContext';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCourseById(id);
        setCourse(res.data);
        if (user?.role === 'ogrenci') {
          const enRes = await getMyEnrollments();
          const found = enRes.data.find(e => e.course_id === parseInt(id));
          setEnrollment(found || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  // Task 9: Kayıt ol
  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    setEnrollLoading(true);
    setMessage('');
    try {
      await enrollCourse(id);
      const enRes = await getMyEnrollments();
      const found = enRes.data.find(e => e.course_id === parseInt(id));
      setEnrollment(found);
      setMessage('Kursa başarıyla kayıt oldunuz! 🎉');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Kayıt sırasında hata oluştu.');
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" style={{ width: 40, height: 40 }} /></div>;
  if (!course) return <div className="container" style={{ padding: 40 }}>Kurs bulunamadı.</div>;

  return (
    <div className="course-detail-page">
      <div className="detail-hero">
        <div className="container detail-hero-inner">
          <div className="detail-info">
            {course.category_name && <span className="badge badge-primary">{course.category_name}</span>}
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="detail-meta">
              <span>👤 {course.egitmen_ad} {course.egitmen_soyad}</span>
              <span>🎓 {course.kayit_sayisi} öğrenci kayıtlı</span>
            </div>
          </div>
          <div className="detail-action-card card">
            <div className="detail-thumb">
              {course.thumbnail_url
                ? <img src={course.thumbnail_url} alt={course.title} />
                : <div className="thumb-placeholder big">📚</div>
              }
            </div>
            <div className="detail-action-body">
              {message && (
                <div className={`alert ${message.includes('hata') || message.includes('zaten') ? 'alert-error' : 'alert-success'}`}>
                  {message}
                </div>
              )}

              {/* Enrollment durumu */}
              {enrollment ? (
                <div className="enrolled-info">
                  <div className="enrolled-badge">✅ Kayıtlısınız</div>
                  <div className="progress-label">
                    <span>İlerleme</span>
                    <span>{enrollment.ilerleme}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${enrollment.ilerleme}%` }} />
                  </div>
                  {enrollment.tamamlandi && (
                    <div className="badge badge-success" style={{ marginTop: 8 }}>🏆 Tamamlandı</div>
                  )}
                  <button className="btn btn-primary btn-full" style={{ marginTop: 12 }}
                    onClick={() => navigate('/dashboard/ogrenci')}>
                    Derslerime Git
                  </button>
                </div>
              ) : user?.role === 'egitmen' ? (
                <p className="enroll-note">Eğitmenler kurslara kayıt olamaz.</p>
              ) : (
                <button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                >
                  {enrollLoading ? <><span className="spinner" /> Kaydediliyor...</> : '🎒 Kursa Katıl'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="instructor-card card">
          <h3>👨‍🏫 Eğitmen Hakkında</h3>
          <p className="instructor-name">{course.egitmen_ad} {course.egitmen_soyad}</p>
          {course.egitmen_bio && <p className="instructor-bio">{course.egitmen_bio}</p>}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
