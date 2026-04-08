const express = require('express');
const router = express.Router();
const {
  enrollCourse, updateProgress, getMyEnrollments,
  getCourseStudents, unenrollCourse
} = require('../controllers/enrollmentController');
const { authMiddleware, ogrenciOnly, egitmenOnly } = require('../middleware/auth');

// UC4: Öğrenci işlemleri
router.get('/my', authMiddleware, ogrenciOnly, getMyEnrollments);           // Kayıtlı kurslarım
router.post('/:courseId', authMiddleware, ogrenciOnly, enrollCourse);        // Task 9: Kayıt ol
router.put('/:courseId/progress', authMiddleware, ogrenciOnly, updateProgress); // İlerleme güncelle
router.delete('/:courseId', authMiddleware, ogrenciOnly, unenrollCourse);   // Kayıttan ayrıl

// Eğitmen: kursuna kayıtlı öğrenciler
router.get('/course/:courseId/students', authMiddleware, egitmenOnly, getCourseStudents);

module.exports = router;
