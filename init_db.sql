-- Database Initialization for SD Islam Baiturrachman
-- DBMS: MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS dashb_monitoring;
USE dashb_monitoring;

-- 1. Table `users` (Akses Pengguna & Otorisasi)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- admin, teacher, coach, parent
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Table `teachers` (Data Tenaga Pendidik / Guru)
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nip VARCHAR(50) NOT NULL,
    specialization VARCHAR(50) NOT NULL, -- Akademik, Non-Akademik
    status VARCHAR(20) NOT NULL, -- Aktif, Nonaktif
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Table `coaches` (Data Pembina / Coach Ekstrakurikuler)
CREATE TABLE IF NOT EXISTS coaches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    id_number VARCHAR(50) NOT NULL, -- LC-XXXX-XXX
    specialization VARCHAR(50) NOT NULL, -- Robotik, Sepak Bola, Seni Lukis, dll.
    contact VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL, -- Aktif, Non-Aktif
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Table `students` (Data Murid)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender_text VARCHAR(20) NOT NULL, -- Laki-laki, Perempuan
    gender_code CHAR(1) NOT NULL, -- L / P
    nisn VARCHAR(20) UNIQUE NOT NULL,
    class_label VARCHAR(10) NOT NULL, -- 4-A, 4-B, 5-A, dll.
    status VARCHAR(20) NOT NULL, -- Aktif, Nonaktif
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Table `classes` (Data Rombongan Belajar / Kelas)
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL, -- Kelas 4-C, dll.
    homeroom_teacher_id INT NULL,
    academic_year VARCHAR(20) NOT NULL, -- 2023/2024
    semester VARCHAR(20) NOT NULL, -- Ganjil / Genap
    capacity INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (homeroom_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- 6. Table `subjects` (Mata Pelajaran)
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- BING-02, MAT-01, dll.
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Table `class_subjects` (Mata Pelajaran Kelas & Pendidik)
CREATE TABLE IF NOT EXISTS class_subjects (
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, subject_id, teacher_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- 8. Table `teacher_attendance` (Kehadiran Guru Harian)
CREATE TABLE IF NOT EXISTS teacher_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    check_in_time VARCHAR(20),
    status VARCHAR(50) NOT NULL, -- Hadir, Terlambat, Izin, Absen
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

-- 9. Table `coach_attendance` (Kehadiran Coach Harian)
CREATE TABLE IF NOT EXISTS coach_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coach_id INT NOT NULL,
    check_in_time VARCHAR(20),
    status VARCHAR(50) NOT NULL, -- Hadir, Terlambat, Izin, Absen
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE
);

-- 10. Table `student_attendance` (Kehadiran Siswa Harian)
CREATE TABLE IF NOT EXISTS student_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    status VARCHAR(50) NOT NULL, -- Hadir, Sakit, Izin, Alfa
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 11. Table `grades` (Penilaian Akademik Kelas Murid)
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    daily_assignment DECIMAL(5,2) DEFAULT 0.00,
    daily_status VARCHAR(50) NULL, -- BULK UPDATED, REQUIRES ACTION, dll.
    ekskul DECIMAL(5,2) DEFAULT 0.00,
    uts DECIMAL(5,2) DEFAULT 0.00,
    uas DECIMAL(5,2) DEFAULT 0.00,
    average DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) NOT NULL, -- Lulus, Remedial
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 12. Table `extracurriculars` (Program Ekstrakurikuler)
CREATE TABLE IF NOT EXISTS extracurriculars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Robotik, Sepak Bola, Seni Lukis
    category VARCHAR(50) NOT NULL, -- Sains & Teknologi, Olahraga, Seni, dll.
    coach_id INT NULL,
    schedule VARCHAR(100) NOT NULL, -- Selasa & Kamis, 15:30
    location VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL
);

-- 13. Table `extracurricular_students` (Keanggotaan Siswa Ekstrakurikuler)
CREATE TABLE IF NOT EXISTS extracurricular_students (
    extracurricular_id INT NOT NULL,
    student_id INT NOT NULL,
    status VARCHAR(20) NOT NULL, -- Aktif, Izin, Nonaktif
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (extracurricular_id, student_id),
    FOREIGN KEY (extracurricular_id) REFERENCES extracurriculars(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 14. Table `activity_logs` (Log Aktivitas Perubahan Data)
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL, -- e.g. "Menambahkan Guru"
    target VARCHAR(100) NOT NULL, -- e.g. "Budi Darmawan"
    user_id INT NULL, -- Pelaku aksi
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);


-- ==========================================
-- SEED DATA (DUMMY DATA INSERTS)
-- ==========================================

-- Seeding `users` (Password hash is plaintext representation or placeholder)
INSERT INTO users (email, password_hash, name, role) VALUES
('nama@sekolah.sch.id', '$2b$10$xyzplaceholderhashforsecurelogininfo12345', 'Irfansyah', 'admin'),
('sarah.j@lumina.edu', '$2b$10$xyzplaceholderhashforsecurelogininfo12345', 'Sarah Jenkins, M.Pd', 'admin'),
('budi.santoso@lumina.sch.id', '$2b$10$xyzplaceholderhashforsecurelogininfo12345', 'Budi Santoso, S.Pd.', 'teacher');

-- Seeding `teachers`
INSERT INTO teachers (name, email, nip, specialization, status) VALUES
('Siti Aminah, S.Pd.', 'siti.aminah@lumina.sch.id', '198503122010012003', 'Akademik', 'Aktif'),
('Budi Darmawan, S.Pd.', 'budi.darmawan@lumina.sch.id', '198801152012011004', 'Akademik', 'Aktif'),
('Rina Kartika, S.Si.', 'rina.kartika@lumina.sch.id', '199005202015012008', 'Akademik', 'Aktif'),
('Sarah Wijaya, M.Pd', 'sarah.wijaya@lumina.sch.id', '198207102008012001', 'Akademik', 'Aktif');

-- Seeding `coaches`
INSERT INTO coaches (name, email, id_number, specialization, contact, status) VALUES
('Rizky Kurniawan', 'r.kurniawan@lumina.sch.id', 'LC-2024-042', 'Robotik', '+62 812-3456-7890', 'Aktif'),
('Agung Setiawan', 'agung.s@lumina.sch.id', 'LC-2024-012', 'Sepak Bola', '+62 812-3456-7891', 'Aktif'),
('Maya Putri', 'maya.p@lumina.sch.id', 'LC-2024-025', 'Seni Lukis', '+62 812-3456-7892', 'Aktif'),
('Budi Santoso', 'budi.s@lumina.sch.id', 'LC-2024-008', 'Basket', '+62 812-3456-7893', 'Aktif');

-- Seeding `students`
INSERT INTO students (name, gender_text, gender_code, nisn, class_label, status) VALUES
('Aditya Pratama', 'Laki-laki', 'L', '0123984712', '4-C', 'Aktif'),
('Bunga Safitri', 'Perempuan', 'P', '0123984713', '4-C', 'Aktif'),
('Candra Kusuma', 'Laki-laki', 'L', '0123984714', '4-C', 'Aktif'),
('Dewi Anggraini', 'Perempuan', 'P', '0123984715', '4-C', 'Aktif'),
('Aditya Saputra', 'Laki-laki', 'L', '0092813341', '5-B', 'Aktif'),
('Bella Nurhaliza', 'Perempuan', 'P', '0084551229', '6-A', 'Aktif'),
('Christian Davin', 'Laki-laki', 'L', '0104432991', '4-C', 'Aktif'),
('Dian Pratama', 'Laki-laki', 'L', '0091222847', '5-B', 'Aktif'),
('Eka Kusuma', 'Perempuan', 'P', '0087762110', '6-B', 'Aktif');

-- Seeding `classes`
INSERT INTO classes (class_name, homeroom_teacher_id, academic_year, semester, capacity) VALUES
('Kelas 4-C', 1, '2023/2024', 'Ganjil', 32),
('Kelas 5-B', 2, '2023/2024', 'Ganjil', 30),
('Kelas 6-A', 3, '2023/2024', 'Ganjil', 32);

-- Seeding `subjects`
INSERT INTO subjects (name, code, description) VALUES
('Bahasa Inggris', 'BING-02', 'English language subject'),
('Matematika', 'MAT-01', 'Mathematics subject'),
('Ilmu Pengetahuan Alam', 'IPA-01', 'Natural Sciences subject');

-- Seeding `class_subjects`
INSERT INTO class_subjects (class_id, subject_id, teacher_id) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3);

-- Seeding `teacher_attendance`
INSERT INTO teacher_attendance (teacher_id, check_in_time, status, date) VALUES
(1, '07:05 WIB', 'Hadir', '2026-07-12'),
(2, '07:45 WIB', 'Terlambat', '2026-07-12'),
(3, '-- : --', 'Izin', '2026-07-12');

-- Seeding `coach_attendance`
INSERT INTO coach_attendance (coach_id, check_in_time, status, date) VALUES
(1, '15:10 WIB', 'Hadir', '2026-07-12'),
(2, '15:45 WIB', 'Terlambat', '2026-07-12'),
(3, '-- : --', 'Izin', '2026-07-12'),
(4, '-- : --', 'Absen', '2026-07-12');

-- Seeding `student_attendance`
INSERT INTO student_attendance (student_id, status, date) VALUES
(1, 'Hadir', '2026-07-12'),
(2, 'Hadir', '2026-07-12'),
(3, 'Hadir', '2026-07-12');

-- Seeding `grades`
INSERT INTO grades (student_id, class_id, daily_assignment, daily_status, ekskul, uts, uas, average, status) VALUES
(1, 1, 85.40, 'BULK UPDATED', 80.00, 88.00, 92.00, 86.30, 'Lulus'),
(2, 1, 65.00, 'REQUIRES ACTION', 70.00, 62.00, 68.00, 66.20, 'Remedial'),
(3, 1, 92.10, 'BULK UPDATED', 85.00, 90.00, 88.00, 88.70, 'Lulus'),
(4, 1, 78.50, 'BULK UPDATED', 75.00, 80.00, 82.00, 78.80, 'Lulus');

-- Seeding `extracurriculars`
INSERT INTO extracurriculars (name, category, coach_id, schedule, location, contact) VALUES
('Robotik', 'Sains & Teknologi', 1, 'Selasa & Kamis, 15:30', 'Lab Komputer & Robotik', 'r.kurniawan@lumina.sch.id'),
('Sepak Bola', 'Olahraga', 2, 'Senin & Rabu, 16:00', 'Lapangan Utama', 'agung.s@lumina.sch.id');

-- Seeding `extracurricular_students`
INSERT INTO extracurricular_students (extracurricular_id, student_id, status) VALUES
(1, 5, 'Aktif'),
(1, 6, 'Aktif'),
(1, 7, 'Izin'),
(1, 8, 'Aktif'),
(1, 9, 'Nonaktif');

-- Seeding `activity_logs`
INSERT INTO activity_logs (action, target, user_id, details) VALUES
('Menambahkan Guru', 'Budi Darmawan', 1, 'Menambahkan data pendidik baru ke database'),
('Ubah Jadwal Pelajaran', 'Bahasa Inggris', 1, 'Mengubah waktu belajar untuk kelas 4-C');
