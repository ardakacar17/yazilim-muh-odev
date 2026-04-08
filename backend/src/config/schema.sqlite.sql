-- SQLite schema for dev (mirrors MySQL schema.sql closely)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE CHECK (name IN ('egitmen', 'ogrenci')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ad TEXT NOT NULL,
  soyad TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role_id INTEGER NOT NULL,
  bio TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  egitmen_id INTEGER NOT NULL,
  durum TEXT DEFAULT 'taslak' CHECK (durum IN ('taslak', 'yayinda', 'arsivlendi')),
  thumbnail_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (egitmen_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ogrenci_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  ilerleme INTEGER DEFAULT 0 CHECK (ilerleme >= 0 AND ilerleme <= 100),
  tamamlandi INTEGER DEFAULT 0 CHECK (tamamlandi IN (0, 1)),
  kayit_tarihi TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE (ogrenci_id, course_id),
  FOREIGN KEY (ogrenci_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

INSERT OR IGNORE INTO roles (name) VALUES ('egitmen'), ('ogrenci');

INSERT OR IGNORE INTO categories (name) VALUES
  ('Programlama'),
  ('Tasarım'),
  ('Veri Bilimi'),
  ('Mobil Geliştirme'),
  ('DevOps'),
  ('Siber Güvenlik'),
  ('Yapay Zeka'),
  ('Web Geliştirme');

