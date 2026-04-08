const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../../data/db.json');

let _cache = null;
let _writeChain = Promise.resolve();

function nowIso() {
  return new Date().toISOString();
}

async function readDb() {
  if (_cache) return _cache;
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    _cache = JSON.parse(raw);
    return _cache;
  } catch (e) {
    if (e.code === 'ENOENT') {
      _cache = null;
      return null;
    }
    throw e;
  }
}

async function writeDb(db) {
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${DB_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf8');
  await fs.rename(tmp, DB_PATH);
  _cache = db;
}

function withWriteLock(fn) {
  _writeChain = _writeChain.then(fn, fn);
  return _writeChain;
}

function nextId(items) {
  let max = 0;
  for (const it of items) max = Math.max(max, Number(it.id || 0));
  return max + 1;
}

async function ensureSeeded() {
  return withWriteLock(async () => {
    const existing = await readDb();
    if (existing) return existing;

    const bcrypt = require('bcryptjs');
    const password = bcrypt.hashSync('password123', 10);

    const db = {
      meta: { created_at: nowIso(), version: 1 },
      roles: [
        { id: 1, name: 'egitmen' },
        { id: 2, name: 'ogrenci' }
      ],
      categories: [
        { id: 1, name: 'Programlama' },
        { id: 2, name: 'Tasarım' },
        { id: 3, name: 'Veri Bilimi' },
        { id: 4, name: 'Mobil Geliştirme' },
        { id: 5, name: 'DevOps' },
        { id: 6, name: 'Siber Güvenlik' },
        { id: 7, name: 'Yapay Zeka' },
        { id: 8, name: 'Web Geliştirme' }
      ],
      users: [
        {
          id: 1,
          ad: 'Arda',
          soyad: 'Kacar',
          email: 'egitmen@local.test',
          password,
          role_id: 1,
          bio: 'Örnek eğitmen hesabı (lokal demo).',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 2,
          ad: 'Eren',
          soyad: 'Ogrenci',
          email: 'ogrenci@local.test',
          password,
          role_id: 2,
          bio: 'Örnek öğrenci hesabı (lokal demo).',
          created_at: nowIso(),
          updated_at: nowIso()
        }
      ],
      courses: [
        {
          id: 1,
          title: 'React ile Modern Arayüzler',
          description: 'Component mantığı, routing, state yönetimi ve pratik proje ile React temelleri.',
          category_id: 8,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/react.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 2,
          title: 'Node.js + Express Backend Temelleri',
          description: 'REST API, JWT auth, middleware ve hata yönetimi ile sağlam bir backend.',
          category_id: 1,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/node.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 3,
          title: 'Veri Bilimine Giriş',
          description: 'Temel veri analizi kavramları, veri temizleme ve küçük bir dashboard çalışması.',
          category_id: 3,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/data.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 4,
          title: 'Siber Güvenlik: Temel Pratikler',
          description: 'Parola güvenliği, kimlik doğrulama akışları ve yaygın web zafiyetleri.',
          category_id: 6,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/security.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 5,
          title: 'Yapay Zeka ile Üretkenlik',
          description: 'Prompt tasarımı, basit otomasyon fikirleri ve günlük iş akışları.',
          category_id: 7,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/ai.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 6,
          title: 'DevOps: Docker ve Temel Deploy',
          description: 'Container mantığı, image/build, compose ve basit release akışı.',
          category_id: 5,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/devops.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 7,
          title: 'Mobil Geliştirme: React Native Başlangıç',
          description: 'Mobil UI, navigasyon ve basit API tüketimi ile React Native giriş seviyesi.',
          category_id: 4,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/react.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 8,
          title: 'UI/UX Tasarım Temelleri',
          description: 'Renk/kontrast, grid sistemi, tipografi ve kullanıcı odaklı tasarım prensipleri.',
          category_id: 2,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/data.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 9,
          title: 'SQL Mantığı ve Sorgu Pratiği',
          description: 'SELECT/JOIN, index mantığı ve küçük veri seti üzerinde pratik sorgular.',
          category_id: 3,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/node.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        },
        {
          id: 10,
          title: 'Web Güvenliği: OWASP Top 10',
          description: 'XSS, CSRF, SQLi gibi temel zafiyetleri tanıma ve korunma yöntemleri.',
          category_id: 6,
          egitmen_id: 1,
          durum: 'yayinda',
          thumbnail_url: '/images/security.svg',
          created_at: nowIso(),
          updated_at: nowIso()
        }
      ],
      enrollments: [
        {
          id: 1,
          ogrenci_id: 2,
          course_id: 1,
          ilerleme: 35,
          tamamlandi: false,
          kayit_tarihi: nowIso(),
          updated_at: nowIso()
        }
      ]
    };

    await writeDb(db);
    return db;
  });
}

async function getDb() {
  const db = await readDb();
  return db || ensureSeeded();
}

async function mutate(mutator) {
  return withWriteLock(async () => {
    const db = await getDb();
    const result = await mutator(db);
    await writeDb(db);
    return result;
  });
}

module.exports = {
  DB_PATH,
  nowIso,
  nextId,
  ensureSeeded,
  getDb,
  mutate
};

