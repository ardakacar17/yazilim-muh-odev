// Global hata yakalama middleware'i (Task 10)
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
  console.error(err.stack);

  // MySQL duplicate entry hatası
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'Bu kayıt zaten mevcut. (Duplicate entry)',
      error: err.message
    });
  }

  // MySQL foreign key hatası
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      message: 'Geçersiz referans. İlgili kayıt bulunamadı.',
      error: err.message
    });
  }

  // JWT hatası
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Geçersiz token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token süresi dolmuş. Lütfen tekrar giriş yapın.' });
  }

  // Validation hatası
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  // Genel hata
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Sunucu hatası oluştu.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const err = new Error(`Rota bulunamadı: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };
