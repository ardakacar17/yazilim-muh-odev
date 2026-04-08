const express = require('express');
const router = express.Router();
const {
  getAllCourses, getCourseById, createCourse,
  updateCourse, deleteCourse, getMyCourses, getCategories
} = require('../controllers/courseController');
const { authMiddleware, egitmenOnly } = require('../middleware/auth');

// Genel (auth gerekmez)
router.get('/', getAllCourses);              // UC3: Katalog + filtreleme
router.get('/categories', getCategories);   // Kategoriler

// Auth gerekli
router.get('/my-courses', authMiddleware, egitmenOnly, getMyCourses);  // Eğitmenin kursları

// UC2 / Task 6: Eğitmen CRUD
router.post('/', authMiddleware, egitmenOnly, createCourse);
router.put('/:id', authMiddleware, egitmenOnly, updateCourse);
router.delete('/:id', authMiddleware, egitmenOnly, deleteCourse);

// Kurs detayı (herkese açık)
router.get('/:id', getCourseById);

module.exports = router;
