const express = require('express');
const router = express.Router();
const { register, login, updateProfile, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// UC1: Kayıt ve Giriş
router.post('/register', register);
router.post('/login', login);

// UC5: Profil yönetimi
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
