const { getDb, mutate, nextId, nowIso } = require('./db');

async function findUserByEmail(email) {
  const db = await getDb();
  return db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}

async function findUserById(id) {
  const db = await getDb();
  return db.users.find((u) => u.id === Number(id)) || null;
}

async function createUser({ ad, soyad, email, passwordHash, role }) {
  return mutate(async (db) => {
    const roleObj = db.roles.find((r) => r.name === role);
    if (!roleObj) throw Object.assign(new Error('Rol bulunamadı.'), { statusCode: 400 });
    const exists = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) throw Object.assign(new Error('Bu email adresi zaten kullanılıyor.'), { statusCode: 409 });

    const id = nextId(db.users);
    const user = {
      id,
      ad,
      soyad,
      email,
      password: passwordHash,
      role_id: roleObj.id,
      bio: '',
      created_at: nowIso(),
      updated_at: nowIso()
    };
    db.users.push(user);
    return user;
  });
}

async function updateUser(id, patch) {
  return mutate(async (db) => {
    const idx = db.users.findIndex((u) => u.id === Number(id));
    if (idx === -1) throw Object.assign(new Error('Kullanıcı bulunamadı.'), { statusCode: 404 });
    db.users[idx] = { ...db.users[idx], ...patch, updated_at: nowIso() };
    return db.users[idx];
  });
}

async function listCategories() {
  const db = await getDb();
  return [...db.categories].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}

async function createCourse({ title, description, category_id, egitmen_id, durum, thumbnail_url }) {
  return mutate(async (db) => {
    const id = nextId(db.courses);
    const course = {
      id,
      title,
      description,
      category_id: category_id ?? null,
      egitmen_id,
      durum,
      thumbnail_url: thumbnail_url ?? null,
      created_at: nowIso(),
      updated_at: nowIso()
    };
    db.courses.push(course);
    return course;
  });
}

async function updateCourse(id, patch) {
  return mutate(async (db) => {
    const idx = db.courses.findIndex((c) => c.id === Number(id));
    if (idx === -1) throw Object.assign(new Error('Kurs bulunamadı.'), { statusCode: 404 });
    db.courses[idx] = { ...db.courses[idx], ...patch, updated_at: nowIso() };
    return db.courses[idx];
  });
}

async function deleteCourse(id) {
  return mutate(async (db) => {
    const before = db.courses.length;
    db.courses = db.courses.filter((c) => c.id !== Number(id));
    if (db.courses.length === before) throw Object.assign(new Error('Kurs bulunamadı.'), { statusCode: 404 });
    db.enrollments = db.enrollments.filter((e) => e.course_id !== Number(id));
    return true;
  });
}

function enrichCourse(db, c) {
  const cat = db.categories.find((x) => x.id === c.category_id) || null;
  const u = db.users.find((x) => x.id === c.egitmen_id) || null;
  const kayit_sayisi = db.enrollments.filter((e) => e.course_id === c.id).length;
  return {
    ...c,
    category_name: cat?.name || null,
    egitmen_ad: u?.ad || null,
    egitmen_soyad: u?.soyad || null,
    egitmen_bio: u?.bio || null,
    kayit_sayisi
  };
}

async function listPublishedCourses({ search, category_id, page, limit }) {
  const db = await getDb();
  let items = db.courses.filter((c) => c.durum === 'yayinda');
  if (search) {
    const s = String(search).toLowerCase();
    items = items.filter((c) => (c.title || '').toLowerCase().includes(s) || (c.description || '').toLowerCase().includes(s));
  }
  if (category_id) items = items.filter((c) => c.category_id === Number(category_id));

  items = items.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit).map((c) => enrichCourse(db, c));
  return { courses: paged, total };
}

async function getCourseById(id) {
  const db = await getDb();
  const c = db.courses.find((x) => x.id === Number(id));
  if (!c) return null;
  return enrichCourse(db, c);
}

async function listMyCourses(egitmen_id) {
  const db = await getDb();
  return db.courses
    .filter((c) => c.egitmen_id === Number(egitmen_id))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .map((c) => enrichCourse(db, c));
}

async function enrollCourse({ ogrenci_id, course_id }) {
  return mutate(async (db) => {
    const course = db.courses.find((c) => c.id === Number(course_id) && c.durum === 'yayinda');
    if (!course) throw Object.assign(new Error('Kurs bulunamadı veya yayında değil.'), { statusCode: 404 });
    if (course.egitmen_id === Number(ogrenci_id)) throw Object.assign(new Error('Kendi kursunuza kayıt olamazsınız.'), { statusCode: 400 });
    const exists = db.enrollments.find((e) => e.ogrenci_id === Number(ogrenci_id) && e.course_id === Number(course_id));
    if (exists) throw Object.assign(new Error('Bu kursa zaten kayıtlısınız.'), { statusCode: 409 });
    const id = nextId(db.enrollments);
    db.enrollments.push({
      id,
      ogrenci_id: Number(ogrenci_id),
      course_id: Number(course_id),
      ilerleme: 0,
      tamamlandi: false,
      kayit_tarihi: nowIso(),
      updated_at: nowIso()
    });
    return true;
  });
}

async function updateProgress({ ogrenci_id, course_id, ilerleme }) {
  return mutate(async (db) => {
    const idx = db.enrollments.findIndex((e) => e.ogrenci_id === Number(ogrenci_id) && e.course_id === Number(course_id));
    if (idx === -1) throw Object.assign(new Error('Bu kursa kayıtlı değilsiniz.'), { statusCode: 404 });
    db.enrollments[idx] = {
      ...db.enrollments[idx],
      ilerleme,
      tamamlandi: ilerleme === 100,
      updated_at: nowIso()
    };
    return db.enrollments[idx];
  });
}

async function unenroll({ ogrenci_id, course_id }) {
  return mutate(async (db) => {
    const before = db.enrollments.length;
    db.enrollments = db.enrollments.filter((e) => !(e.ogrenci_id === Number(ogrenci_id) && e.course_id === Number(course_id)));
    if (db.enrollments.length === before) throw Object.assign(new Error('Bu kursa kayıtlı değilsiniz.'), { statusCode: 404 });
    return true;
  });
}

async function listMyEnrollments(ogrenci_id) {
  const db = await getDb();
  const items = db.enrollments
    .filter((e) => e.ogrenci_id === Number(ogrenci_id))
    .sort((a, b) => String(b.kayit_tarihi).localeCompare(String(a.kayit_tarihi)))
    .map((e) => {
      const c = db.courses.find((x) => x.id === e.course_id) || null;
      const cat = c ? db.categories.find((x) => x.id === c.category_id) : null;
      const eg = c ? db.users.find((x) => x.id === c.egitmen_id) : null;
      return {
        ...e,
        title: c?.title || '',
        description: c?.description || '',
        thumbnail_url: c?.thumbnail_url || null,
        category_name: cat?.name || null,
        egitmen_ad: eg?.ad || null,
        egitmen_soyad: eg?.soyad || null
      };
    });
  return items;
}

async function listCourseStudents({ egitmen_id, course_id }) {
  const db = await getDb();
  const course = db.courses.find((c) => c.id === Number(course_id));
  if (!course || course.egitmen_id !== Number(egitmen_id)) throw Object.assign(new Error('Bu kursa erişim yetkiniz yok.'), { statusCode: 403 });
  return db.enrollments
    .filter((e) => e.course_id === Number(course_id))
    .sort((a, b) => String(b.kayit_tarihi).localeCompare(String(a.kayit_tarihi)))
    .map((e) => {
      const u = db.users.find((x) => x.id === e.ogrenci_id) || null;
      return {
        id: u?.id || null,
        ad: u?.ad || null,
        soyad: u?.soyad || null,
        email: u?.email || null,
        ilerleme: e.ilerleme,
        tamamlandi: e.tamamlandi,
        kayit_tarihi: e.kayit_tarihi
      };
    });
}

async function getRoleNameByRoleId(role_id) {
  const db = await getDb();
  return db.roles.find((r) => r.id === Number(role_id))?.name || null;
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  listCategories,
  createCourse,
  updateCourse,
  deleteCourse,
  listPublishedCourses,
  getCourseById,
  listMyCourses,
  enrollCourse,
  updateProgress,
  unenroll,
  listMyEnrollments,
  listCourseStudents,
  getRoleNameByRoleId
};

