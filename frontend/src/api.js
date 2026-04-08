import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export const AuthApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  profile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const CoursesApi = {
  list: (params) => api.get('/courses', { params }),
  categories: () => api.get('/courses/categories'),
  byId: (id) => api.get(`/courses/${id}`),
  my: () => api.get('/courses/my-courses'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  remove: (id) => api.delete(`/courses/${id}`)
};

export const EnrollmentsApi = {
  my: () => api.get('/enrollments/my'),
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),
  progress: (courseId, ilerleme) => api.put(`/enrollments/${courseId}/progress`, { ilerleme }),
  unenroll: (courseId) => api.delete(`/enrollments/${courseId}`),
  students: (courseId) => api.get(`/enrollments/course/${courseId}/students`)
};

