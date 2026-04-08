# SkillHub LMS - Web Tabanlı Beceri Eğitim ve Yönetim Platformu

**Proje Ekibi:** Arda Kaçar, Eren Karamehmetoğlu, Serdar Şerzan Mert  
**Teknolojiler:** Node.js + Express + React (Vite) + Lokal JSON DB (demo)

---

## 📁 Proje Yapısı

```
lms-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # MySQL bağlantısı
│   │   │   └── schema.sql      # Veritabanı şeması
│   │   ├── controllers/
│   │   │   ├── authController.js       # UC1, UC5
│   │   │   ├── courseController.js     # UC2, UC3, Task 4-6
│   │   │   └── enrollmentController.js # UC4, Task 9
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT doğrulama (Task 3)
│   │   │   └── errorHandler.js  # Global hata yakalama (Task 10)
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   └── enrollmentRoutes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/index.js         # Axios yapılandırması
    │   ├── context/AuthContext.js
    │   ├── components/
    │   │   ├── Navbar.js/css
    │   │   ├── CourseCard.js/css
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── Home.js/css
    │   │   ├── Login.js
    │   │   ├── Register.js      # UC1: Rol seçimi
    │   │   ├── Auth.css
    │   │   ├── CourseList.js    # UC3: Katalog + filtreleme (Task 7, 8)
    │   │   ├── CourseDetail.js  # Task 9: Kayıt ol butonu
    │   │   ├── EgitmenDashboard.js  # Task 4, 5, 6
    │   │   ├── OgrenciDashboard.js  # UC4: İlerleme takibi
    │   │   ├── Dashboard.css
    │   │   ├── Profil.js        # UC5: Profil yönetimi
    │   │   └── Profil.css
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Kurulum

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Çalıştırma

```bash
cd backend && npm run dev
cd ../frontend && npm run dev
```

Frontend `http://localhost:5173` adresinde açılır.  
Backend `http://localhost:5000` adresinde çalışır.

### Demo hesaplar
- Eğitmen: `egitmen@local.test` / `password123`
- Öğrenci: `ogrenci@local.test` / `password123`

---

## 🔧 .env Dosyası Ayarları

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=lms_db
JWT_SECRET=gizli_bir_anahtar_yazin_buraya
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

---

## 📌 API Endpoint'leri

### Auth (`/api/auth`)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/register` | UC1: Kayıt ol |
| POST | `/login` | UC1: Giriş yap |
| GET | `/profile` | UC5: Profil getir |
| PUT | `/profile` | UC5: Profil güncelle |

### Courses (`/api/courses`)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/` | UC3: Tüm kurslar (arama + filtre) |
| GET | `/categories` | Kategoriler |
| GET | `/my-courses` | Eğitmenin kursları |
| POST | `/` | UC2: Kurs oluştur (Eğitmen) |
| PUT | `/:id` | Task 6: Kurs güncelle |
| DELETE | `/:id` | Task 6: Kurs sil |
| GET | `/:id` | Kurs detayı |

### Enrollments (`/api/enrollments`)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/my` | UC4: Kayıtlı kurslarım |
| POST | `/:courseId` | Task 9: Kursa kayıt ol |
| PUT | `/:courseId/progress` | UC4: İlerleme güncelle |
| DELETE | `/:courseId` | Kayıttan ayrıl |
| GET | `/course/:courseId/students` | Kursa kayıtlı öğrenciler |

---

## ✅ Use Case & Task Karşılıkları

| Gereksinim | Dosya |
|------------|-------|
| UC1: Kayıt + Rol Tabanlı Giriş | `authController.js`, `Register.js`, `Login.js` |
| UC2: İçerik Oluşturma | `courseController.js`, `EgitmenDashboard.js` |
| UC3: Katalog + Filtreleme | `courseController.js`, `CourseList.js` |
| UC4: İlerleme Takibi | `enrollmentController.js`, `OgrenciDashboard.js` |
| UC5: Profil Yönetimi | `authController.js`, `Profil.js` |
| Task 3: JWT Auth | `middleware/auth.js` |
| Task 5: Form Validasyon | `courseController.js`, `EgitmenDashboard.js` |
| Task 6: CRUD API | `courseController.js`, `courseRoutes.js` |
| Task 7: Kurs Listeleme | `CourseList.js`, `CourseDetail.js` |
| Task 8: Arama + Filtre | `CourseList.js` (debounce + kategori) |
| Task 9: Enrollment Butonu | `CourseDetail.js`, `enrollmentController.js` |
| Task 10: Global Hata Yakalama | `middleware/errorHandler.js` |
| Task 11: Responsive Tasarım | `index.css` + tüm `.css` dosyaları |
