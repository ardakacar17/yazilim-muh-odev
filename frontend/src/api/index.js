import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Her istekte token ekle
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → otomatik logout
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Courses
export const getCourses = (params) => API.get('/courses', { params });
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const getCategories = () => API.get('/courses/categories');
export const getMyCourses = () => API.get('/courses/my-courses');
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Enrollments
export const getMyEnrollments = () => API.get('/enrollments/my');
export const enrollCourse = (courseId) => API.post(`/enrollments/${courseId}`);
export const updateProgress = (courseId, ilerleme) => API.put(`/enrollments/${courseId}/progress`, { ilerleme });
export const unenrollCourse = (courseId) => API.delete(`/enrollments/${courseId}`);
export const getCourseStudents = (courseId) => API.get(`/enrollments/course/${courseId}/students`);

export default API;
