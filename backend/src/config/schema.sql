-- LMS Veritabanı Şeması
CREATE DATABASE IF NOT EXISTS lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lms_db;

-- Roller tablosu
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name ENUM('egitmen', 'ogrenci') NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ad VARCHAR(100) NOT NULL,
  soyad VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kurslar tablosu
CREATE TABLE IF NOT EXISTS courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  egitmen_id INT NOT NULL,
  durum ENUM('taslak', 'yayinda', 'arsivlendi') DEFAULT 'taslak',
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (egitmen_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Kayıtlar tablosu (Enrollments)
CREATE TABLE IF NOT EXISTS enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ogrenci_id INT NOT NULL,
  course_id INT NOT NULL,
  ilerleme INT DEFAULT 0 CHECK (ilerleme >= 0 AND ilerleme <= 100),
  tamamlandi BOOLEAN DEFAULT FALSE,
  kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (ogrenci_id, course_id),
  FOREIGN KEY (ogrenci_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Başlangıç verileri
INSERT IGNORE INTO roles (name) VALUES ('egitmen'), ('ogrenci');

INSERT IGNORE INTO categories (name) VALUES 
  ('Programlama'),
  ('Tasarım'),
  ('Veri Bilimi'),
  ('Mobil Geliştirme'),
  ('DevOps'),
  ('Siber Güvenlik'),
  ('Yapay Zeka'),
  ('Web Geliştirme');
