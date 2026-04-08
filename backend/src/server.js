const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { errorHandler, notFound } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

const { ensureSeeded } = require('./store/db');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

app.get('/api/health', async (req, res, next) => {
  try {
    await ensureSeeded();
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  } catch (e) {
    next(e);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

ensureSeeded()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ LMS Backend çalışıyor: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB seed başarısız:', err);
    process.exit(1);
  });

module.exports = app;
