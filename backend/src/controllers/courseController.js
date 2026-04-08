const {
  listPublishedCourses,
  getCourseById: getCourseByIdQuery,
  createCourse: createCourseQuery,
  updateCourse: updateCourseQuery,
  deleteCourse: deleteCourseQuery,
  listMyCourses,
  listCategories
} = require('../store/queries');

// UC3: Tüm yayındaki kursları listele (filtreleme ile)
const getAllCourses = async (req, res, next) => {
  try {
    const { search, category_id, page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const { courses, total } = await listPublishedCourses({
      search,
      category_id,
      page: pageNum,
      limit: limitNum
    });

    res.json({
      courses,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Kurs detayı
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await getCourseByIdQuery(id);
    if (!course) {
      return res.status(404).json({ message: 'Kurs bulunamadı.' });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

// UC2: Kurs oluştur (Eğitmen)
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category_id, durum = 'taslak', thumbnail_url } = req.body;
    const egitmen_id = req.user.id;

    // Task 5: Validasyon
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'Başlık en az 3 karakter olmalıdır.' });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: 'Açıklama en az 10 karakter olmalıdır.' });
    }

    if (!['taslak', 'yayinda'].includes(durum)) {
      return res.status(400).json({ message: 'Geçersiz durum değeri.' });
    }

    const course = await createCourseQuery({
      title: title.trim(),
      description: description.trim(),
      category_id: category_id ? Number(category_id) : null,
      egitmen_id,
      durum,
      thumbnail_url: thumbnail_url || null
    });

    res.status(201).json({
      message: 'Kurs oluşturuldu.',
      courseId: course.id
    });
  } catch (err) {
    next(err);
  }
};

// UC2 / Task 6: Kurs güncelle (Eğitmen - sadece kendi kursu)
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const egitmen_id = req.user.id;
    const { title, description, category_id, durum, thumbnail_url } = req.body;
    const existing = await getCourseByIdQuery(id);
    if (!existing) return res.status(404).json({ message: 'Kurs bulunamadı.' });
    if (existing.egitmen_id !== egitmen_id) {
      return res.status(403).json({ message: 'Bu kursu düzenleme yetkiniz yok.' });
    }
    await updateCourseQuery(id, {
      title: title || existing.title,
      description: description || existing.description,
      category_id: category_id !== undefined ? (category_id ? Number(category_id) : null) : existing.category_id,
      durum: durum || existing.durum,
      thumbnail_url: thumbnail_url !== undefined ? thumbnail_url : existing.thumbnail_url
    });

    res.json({ message: 'Kurs güncellendi.' });
  } catch (err) {
    next(err);
  }
};

// Task 6: Kurs sil (Eğitmen - sadece kendi kursu)
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const egitmen_id = req.user.id;
    const existing = await getCourseByIdQuery(id);
    if (!existing) return res.status(404).json({ message: 'Kurs bulunamadı.' });
    if (existing.egitmen_id !== egitmen_id) {
      return res.status(403).json({ message: 'Bu kursu silme yetkiniz yok.' });
    }
    await deleteCourseQuery(id);
    res.json({ message: 'Kurs silindi.' });
  } catch (err) {
    next(err);
  }
};

// Eğitmenin kendi kursları
const getMyCourses = async (req, res, next) => {
  try {
    const egitmen_id = req.user.id;
    const courses = await listMyCourses(egitmen_id);
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

// Kategorileri getir
const getCategories = async (req, res, next) => {
  try {
    const categories = await listCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  getCategories
};
