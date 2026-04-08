const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token.' });
  }
};

const egitmenOnly = (req, res, next) => {
  if (req.user.role !== 'egitmen') {
    return res.status(403).json({ message: 'Bu işlem sadece eğitmenler için geçerlidir.' });
  }
  next();
};

const ogrenciOnly = (req, res, next) => {
  if (req.user.role !== 'ogrenci') {
    return res.status(403).json({ message: 'Bu işlem sadece öğrenciler için geçerlidir.' });
  }
  next();
};

module.exports = { authMiddleware, egitmenOnly, ogrenciOnly };
