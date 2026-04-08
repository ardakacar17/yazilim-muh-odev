const {
  enrollCourse: enrollCourseQuery,
  updateProgress: updateProgressQuery,
  listMyEnrollments,
  listCourseStudents: listCourseStudentsQuery,
  unenroll: unenrollQuery
} = require('../store/queries');

// UC4 / Task 9: Kursa kayıt ol
const enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const ogrenci_id = req.user.id;
    await enrollCourseQuery({ ogrenci_id, course_id: courseId });

    res.status(201).json({ message: 'Kursa başarıyla kayıt oldunuz!' });
  } catch (err) {
    next(err);
  }
};

// UC4: İlerleme güncelle
const updateProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { ilerleme } = req.body;
    const ogrenci_id = req.user.id;

    if (ilerleme === undefined || ilerleme < 0 || ilerleme > 100) {
      return res.status(400).json({ message: 'İlerleme 0 ile 100 arasında olmalıdır.' });
    }

    const updated = await updateProgressQuery({ ogrenci_id, course_id: courseId, ilerleme });
    res.json({ message: 'İlerleme güncellendi.', ilerleme: updated.ilerleme, tamamlandi: updated.tamamlandi });
  } catch (err) {
    next(err);
  }
};

// UC4: Öğrencinin kayıtlı kursları
const getMyEnrollments = async (req, res, next) => {
  try {
    const ogrenci_id = req.user.id;
    const enrollments = await listMyEnrollments(ogrenci_id);
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
};

// Eğitmenin kursuna kayıtlı öğrenciler
const getCourseStudents = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const egitmen_id = req.user.id;
    const students = await listCourseStudentsQuery({ egitmen_id, course_id: courseId });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

// Kayıttan ayrıl
const unenrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const ogrenci_id = req.user.id;
    await unenrollQuery({ ogrenci_id, course_id: courseId });

    res.json({ message: 'Kurs kaydınız silindi.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  enrollCourse,
  updateProgress,
  getMyEnrollments,
  getCourseStudents,
  unenrollCourse
};
