import React, { useState, useEffect, useCallback } from 'react';
import { getCourses, getCategories } from '../api';
import CourseCard from '../components/CourseCard';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCourses({ search, category_id: categoryId, page, limit: 12 });
      setCourses(res.data.courses);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // Task 8: Arama - debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategory = (id) => {
    setCategoryId(id);
    setPage(1);
  };

  return (
    <div className="courselist-page">
      <div className="courselist-hero">
        <div className="container">
          <h1>📚 Kurs Kataloğu</h1>
          <p>Yeni beceriler kazanmak için doğru yerdesiniz</p>
          {/* Task 8: Arama */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Kurs ara..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button className="search-clear" onClick={() => { setSearchInput(''); setSearch(''); }}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="container courselist-body">
        {/* Task 8: Kategori filtresi */}
        <div className="category-filters">
          <button
            className={`cat-btn ${categoryId === '' ? 'active' : ''}`}
            onClick={() => handleCategory('')}
          >Tümü</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-btn ${categoryId === String(cat.id) ? 'active' : ''}`}
              onClick={() => handleCategory(String(cat.id))}
            >{cat.name}</button>
          ))}
        </div>

        {loading ? (
          <div className="page-loading"><div className="spinner" style={{ width: 36, height: 36 }} /></div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔭</div>
            <h3>Kurs bulunamadı</h3>
            <p>Farklı bir arama terimi veya kategori deneyin.</p>
          </div>
        ) : (
          <>
            <div className="results-info">
              <span>{pagination.total} kurs bulundu</span>
            </div>
            <div className="courses-grid">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >← Önceki</button>
                <span>{page} / {pagination.totalPages}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >Sonraki →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseList;
