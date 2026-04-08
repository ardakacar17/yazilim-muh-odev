const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getRoleNameByRoleId
} = require('../store/queries');

// UC1: Kullanıcı Kaydı
const register = async (req, res, next) => {
  try {
    const { ad, soyad, email, password, role } = req.body;

    // Validasyon
    if (!ad || !soyad || !email || !password || !role) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
    }

    if (!['egitmen', 'ogrenci'].includes(role)) {
      return res.status(400).json({ message: 'Geçersiz rol. "egitmen" veya "ogrenci" olmalıdır.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await createUser({
      ad,
      soyad,
      email,
      passwordHash: hashedPassword,
      role
    });

    // JWT oluştur
    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Kayıt başarılı!',
      token,
      user: { id: user.id, ad: user.ad, soyad: user.soyad, email: user.email, role }
    });
  } catch (err) {
    next(err);
  }
};

// UC1: Rol Tabanlı Giriş
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunludur.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email veya şifre hatalı.' });
    }
    const role = await getRoleNameByRoleId(user.role_id);

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email veya şifre hatalı.' });
    }

    // JWT oluştur
    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Giriş başarılı!',
      token,
      user: {
        id: user.id,
        ad: user.ad,
        soyad: user.soyad,
        email: user.email,
        role,
        bio: user.bio
      }
    });
  } catch (err) {
    next(err);
  }
};

// UC5: Profil Güncelleme
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { ad, soyad, bio, currentPassword, newPassword } = req.body;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    let hashedPassword = user.password;

    // Şifre değiştirme
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Mevcut şifre gereklidir.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mevcut şifre hatalı.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır.' });
      }
      hashedPassword = await bcrypt.hash(newPassword, 12);
    }

    await updateUser(userId, {
      ad: ad || user.ad,
      soyad: soyad || user.soyad,
      bio: bio !== undefined ? bio : user.bio,
      password: hashedPassword
    });

    res.json({ message: 'Profil güncellendi.' });
  } catch (err) {
    next(err);
  }
};

// Profil getir
const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    const role = await getRoleNameByRoleId(user.role_id);
    res.json({
      id: user.id,
      ad: user.ad,
      soyad: user.soyad,
      email: user.email,
      bio: user.bio,
      role,
      created_at: user.created_at
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, updateProfile, getProfile };
