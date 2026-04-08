import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course, showActions, onDelete, onEdit }) => {
  const durumBadge = {
    yayinda: { label: 'Yayında', cls: 'badge-success' },
    taslak: { label: 'Taslak', cls: 'badge-warning' },
    arsivlendi: { label: 'Arşiv', cls: 'badge-gray' },
  };

  const badge = durumBadge[course.durum] || durumBadge.taslak;

  return (
    <div className="course-card card">
      <div className="course-thumb">
        {course.thumbnail_url
          ? <img src={course.thumbnail_url} alt={course.title} />
          : <div className="thumb-placeholder">📚</div>
        }
        {course.durum && showActions && (
          <span className={`badge ${badge.cls} thumb-badge`}>{badge.label}</span>
        )}
      </div>
      <div className="course-body">
        {course.category_name && (
          <span className="badge badge-primary course-cat">{course.category_name}</span>
        )}
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>
        <div className="course-meta">
          <span>👤 {course.egitmen_ad} {course.egitmen_soyad}</span>
          <span>🎓 {course.kayit_sayisi || 0} öğrenci</span>
        </div>
      </div>
      <div className="course-footer">
        {showActions ? (
          <div className="course-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(course)}>✏️ Düzenle</button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(course.id)}>🗑️ Sil</button>
          </div>
        ) : (
          <Link to={`/courses/${course.id}`} className="btn btn-primary btn-full btn-sm">
            Kursu İncele →
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
