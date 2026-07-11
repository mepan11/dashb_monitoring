# Dokumentasi Fitur Aplikasi & Desain Sistem

Dokumen ini berisi penjelasan fitur-fitur dan struktur data yang direncanakan untuk Halaman Login serta gambaran umum sistem backend di masa depan.

## 1. Fitur Halaman Login (Authentication)

Halaman ini berfungsi sebagai gerbang masuk bagi admin, guru, maupun staf sekolah untuk mengakses sistem monitoring.

### Elemen UI & Kegunaan
- **Panel Informasi (Kiri)**:
  - **Identitas Sekolah**: Menampilkan logo buku dengan nama sekolah "SD Islam Baiturrachman".
  - **Judul Utama**: "Sistem Dashboard Monitoring Sekolah Dasar".
  - **Deskripsi Sistem**: Penjelasan singkat bahwa aplikasi memantau kehadiran (presensi), pencapaian akademik, dan log kegiatan harian secara real-time.
- **Panel Form Login (Kanan/Card)**:
  - **Alamat Email**: Input field untuk email pengguna (contoh placeholder: `nama@sekolah.sch.id`).
  - **Kata Sandi**: Input field terenkripsi (type password) untuk sandi pengguna.
  - **Tombol "Masuk Sekarang"**: Memicu verifikasi kredensial ke sistem/API backend.

---

## 2. Gambaran Integrasi Backend & Skema Data (Masa Depan)

Ketika backend dirancang, berikut adalah poin-poin penting yang harus diimplementasikan:

### Endpoint Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "nama@sekolah.sch.id",
    "password": "kata_sandi_rahasia"
  }
  ```
- **Response Sukses (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_01",
      "name": "Irfansyah",
      "email": "nama@sekolah.sch.id",
      "role": "admin",
      "school": "SD Islam Baiturrachman"
    }
  }
  ```

### Struktur Database Pengguna (Users Schema)
- `id` (Primary Key, UUID/String)
- `email` (String, Unique, Indexed)
- `password_hash` (String, Terenkripsi dengan bcrypt/argon2)
- `name` (String)
- `role` (Enum: `admin`, `teacher`, `principal`)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

---

## 3. Fitur Admin Dashboard

Halaman utama setelah berhasil masuk yang menyediakan panel navigasi dan visualisasi data statistik sekolah. Fitur-fitur utama yang tersedia pada halaman ini antara lain:

### Elemen UI & Kegunaan
- **Sidebar Navigasi Kiri**:
  - Menu Navigasi: Dashboard, Guru, Coach, Siswa, Kelas, Mata Pelajaran, Absensi, Nilai, Ekstrakurikuler, Kelola Akun.
  - Tombol Logout: Untuk keluar dari sistem dan kembali ke halaman login.
- **Top Header Bar**:
  - Kolom Pencarian: Mencari data siswa, guru, atau laporan secara instan.
  - Tombol "Portal Sekolah": Mengakses portal sekolah utama.
  - Notifikasi & Settings: Akses cepat ke pengaturan akun dan pemberitahuan sistem.
- **Kartu KPI Ringkasan (Dashboard Metrics)**:
  - **Total Siswa**: Menampilkan jumlah siswa yang terdaftar dengan tren penambahan bulanan.
  - **Total Guru**: Menampilkan jumlah guru dengan status keaktifan.
  - **Kehadiran Hari Ini**: Persentase kehadiran siswa hari ini beserta status kehadiran operasional sekolah.
  - **Ruang Kelas**: Total kapasitas ruang kelas yang digunakan.
- **Grafik Tren Kehadiran Mingguan**:
  - Visualisasi persentase kehadiran harian siswa dari hari Senin s.d Jumat dengan opsi filter (Minggu Ini / Minggu Lalu).
- **Log Aktivitas Terbaru**:
  - Log audit data secara real-time yang mencatat riwayat perubahan atau penambahan data penting oleh admin sekolah. Dilengkapi dengan filter pencarian log.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Dashboard Statistics**:
  - **Endpoint**: `/api/dashboard/stats`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "total_siswa": { "count": 120, "trend": "+12 bln ini" },
        "total_guru": { "count": 15, "status": "Aktif" },
        "kehadiran_hari_ini": { "percentage": 98, "status": "Sangat Baik" },
        "ruang_kelas": { "used": 8, "total": 8, "status": "Penuh" }
      }
    }
    ```
- **Get Recent Activity Logs**:
  - **Endpoint**: `/api/dashboard/activities`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": []
    }
    ```

---

## 4. Fitur Kelola Guru (Teacher Management)

Halaman utama bagi Admin untuk melakukan monitoring, pencarian, dan pengelolaan data guru (tenaga pendidik).

### Elemen UI & Kegunaan
- **KPI Ringkasan Guru**:
  - **Total Guru**: Jumlah seluruh guru terdaftar (contoh: 42).
  - **Aktif**: Jumlah guru dengan status aktif mengajar (contoh: 38).
  - **Akademik**: Jumlah guru yang mengampu pelajaran bidang akademik (contoh: 30).
  - **Non-Akademik**: Jumlah guru bidang non-akademik/ekstrakurikuler (contoh: 12).
- **Aksi Tambah Guru**:
  - Tombol `+ Tambah Guru` membuka form/modal untuk menambahkan pendidik baru.
- **Bar Filter & Pencarian**:
  - Opsi filter berdasarkan Jenjang, Mata Pelajaran, dan Status Aktif.
  - Tombol pintas `Reset All Filters` untuk mengembalikan pencarian default.
- **Tabel Data Guru**:
  - Menampilkan foto profil/avatar inisial, nama lengkap beserta email, NIP, spesialisasi (Akademik / Non-Akademik), mata pelajaran yang diampu, daftar kelas, dan status (Aktif/Nonaktif).
  - Kolom Aksi memiliki pintasan tombol Lihat Detail (Eye), Edit (Pencil), dan Hapus (Trash).
- **Pagination & Footer**:
  - Informasi jumlah data yang ditampilkan (contoh: `Showing 1 to 4 of 42 entries`) dan tombol navigasi halaman.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Teachers List**:
  - **Endpoint**: `/api/teachers`
  - **Method**: `GET`
  - **Query Params**: `page`, `limit`, `search`, `jenjang`, `subject`, `status`
  - **Response**:
    ```json
    {
      "success": true,
      "total_entries": 42,
      "showing_start": 1,
      "showing_end": 4,
      "data": [
        {
          "id": "1",
          "name": "Budi Santoso, S.Pd.",
          "email": "budi.santoso@lumina.sch.id",
          "nip": "198501012010011002",
          "specialization": "Akademik",
          "subjects": ["Matematika", "IPA"],
          "classes": ["4A", "4B", "4C"],
          "status": "Aktif"
        }
      ]
    }
    ```

---

## 5. Fitur Kelola Coach (Coach Management)

Halaman utama bagi Admin untuk melakukan monitoring, pencarian, dan pengelolaan data coach profesional bidang ekstrakurikuler.

### Elemen UI & Kegunaan
- **KPI Ringkasan Coach**:
  - **Total Coach**: Jumlah seluruh coach terdaftar (contoh: 24).
  - **Aktif**: Jumlah coach dengan status aktif mengajar (contoh: 21).
  - **Spesialisasi**: Jumlah bidang keahlian olahraga/seni/sains yang diajarkan (contoh: 12 Bidang).
  - **Non-Aktif**: Jumlah coach non-aktif (contoh: 3).
- **Aksi Tambah Coach Baru**:
  - Tombol `+ Tambah Coach Baru` membuka form/modal untuk menambahkan coach baru.
- **Bar Filter**:
  - Opsi filter berdasarkan Bidang Spesialisasi dan Status Aktif.
  - Tombol pintas `Reset All Filters` untuk mengembalikan pencarian default.
- **Tabel Data Coach**:
  - Menampilkan nama lengkap, email, ID Number, bidang spesialisasi, kontak telepon, status keaktifan (Aktif/Non-Aktif), dan kolom Aksi (Lihat Detail, Edit, Hapus).
- **Pagination & Footer**:
  - Menunjukkan baris data aktif (contoh: `Menampilkan 4 dari 24 Coach`) beserta tombol navigasi halaman.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Coaches List**:
  - **Endpoint**: `/api/coaches`
  - **Method**: `GET`
  - **Query Params**: `page`, `limit`, `search`, `bidang`, `status`
  - **Response**:
    ```json
    {
      "success": true,
      "total_entries": 24,
      "showing_start": 1,
      "showing_end": 3,
      "data": [
        {
          "id": "1",
          "name": "Ahmad Subardjo",
          "email": "ahmad.s@lumina.sch.id",
          "id_number": "LC-2024-001",
          "specialization": "Robotik",
          "contact": "+62 812-3456-7890",
          "status": "Aktif"
        }
      ]
    }
    ```

---

## 6. Fitur Kelola Siswa (Student Management)

Halaman utama bagi Admin untuk melakukan monitoring, pencarian, dan pengelolaan data siswa terdaftar.

### Elemen UI & Kegunaan
- **Total Siswa Aktif Card (Top Right)**:
  - Kartu KPI berwarna biru mencolok untuk menunjukkan total siswa aktif (contoh: 1,248) dengan ikon grup/users.
- **Aksi Tambah Siswa**:
  - Tombol `+ Tambah Siswa` untuk membuka form/modal pembuatan data siswa baru.
- **Filter Kelas (Top Left)**:
  - Panel tombol pil (*pills*) horizontal untuk menyaring siswa per tingkatan kelas (Semua, Kelas 1, Kelas 2, s.d Kelas 6).
- **Tabel Data Siswa**:
  - Kolom tabel: Siswa (avatar, nama, gender teks), NISN, Kelas (badge biru), Gender (L/P), Status (Aktif/Nonaktif), dan Aksi (Lihat Detail, Edit, Hapus).
- **Pagination Footer**:
  - Menampilkan ringkasan baris data aktif (contoh: `Showing 1 - 4 of 1,248 students`) beserta navigasi halaman.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Students List**:
  - **Endpoint**: `/api/students`
  - **Method**: `GET`
  - **Query Params**: `page`, `limit`, `search`, `class_filter`, `status`
  - **Response**:
    ```json
    {
      "success": true,
      "total_entries": 1248,
      "showing_start": 1,
      "showing_end": 4,
      "data": [
        {
          "id": "1",
          "name": "Andi Wijaya",
          "gender_text": "Laki-laki",
          "gender_code": "L",
          "nisn": "0012938475",
          "class_label": "4-A",
          "status": "Aktif"
        }
      ]
    }
    ```

---

## 7. Fitur Kelola Kelas (Class Management)

Halaman utama bagi Admin untuk melakukan monitoring, pencarian, dan pengelolaan data seluruh kelas di sekolah.

### Elemen UI & Kegunaan
- **KPI Summary Cards (Top Highlight)**:
  - **TOTAL KELAS**: Jumlah kelas terdaftar (contoh: 13) dengan left-border highlight warna biru.
  - **TOTAL SISWA TERDAFTAR**: Total jumlah siswa aktif terdaftar (contoh: 370) dengan left-border highlight warna hijau.
  - **RATA-RATA SISWA / KELAS**: Jumlah rata-rata siswa dalam satu kelas (contoh: 28) dengan batas kapasitas ideal (contoh: 30) dengan left-border highlight warna ungu.
- **Aksi Dokumen & Penambahan**:
  - Tombol `+ Tambah Kelas Baru`, `Ekspor CSV`, dan `Cetak PDF`.
- **Filter Kelas**:
  - Pilihan pil (*pills*) horizontal berdasarkan tingkat kelas (All Classes, Grade 1 s.d Grade 6).
- **Grid Kartu Kelas**:
  - Menampilkan setiap data kelas dalam layout grid yang mencakup: Nama kelas, Status (AKTIF/PENUH), Nama dan inisial Wali Kelas, informasi jumlah siswa dan kapasitas bar (warna biru untuk normal, warna oranye/penuh ketika kapasitas maksimum 30/30 tercapai), tombol pintas `Detail Kelas`, Edit, dan Hapus.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Classes List**:
  - **Endpoint**: `/api/classes`
  - **Method**: `GET`
  - **Query Params**: `grade_filter`
  - **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "1",
          "name": "Kelas 1-A",
          "homeroom_teacher": "Subandi, S.Pd.",
          "teacher_initials": "SS",
          "students_count": 28,
          "capacity": 30,
          "status": "AKTIF"
        }
      ]
    }
    ```

---

## 8. Fitur Kelola Mata Pelajaran (Subject Management)

Halaman utama bagi Admin untuk melakukan monitoring kurikulum, pencarian, dan pengelolaan data mata pelajaran per kelas.

### Elemen UI & Kegunaan
- **KPI Summary Cards (Top)**:
  - **TOTAL MAPEL**: Jumlah mata pelajaran terdaftar (contoh: 124).
  - **TOTAL GURU**: Jumlah tenaga pendidik aktif (contoh: 42).
  - **TAHUN AJARAN**: Tahun ajaran yang aktif saat ini (contoh: 2023/2024).
- **Aksi Tambah Mata Pelajaran**:
  - Tombol `+ Tambah Mata Pelajaran` untuk membuka form/modal pembuatan mata pelajaran baru.
- **Filter Kelas**:
  - Pilihan pil (*pills*) horizontal berdasarkan kelas (Semua, Kelas 1 s.d Kelas 6).
- **Grid Kartu Kelas (4 Kolom)**:
  - Menampilkan setiap data mata pelajaran per kelas dalam layout grid yang mencakup: Ikon bundar buku, Nama kelas, jumlah mata pelajaran yang diajar, bilah kelengkapan silabus (*syllabus completeness progress bar* berwarna hijau dengan label persentase 85%), serta tombol pintas `Lihat Mata Pelajaran ->` untuk mengarah ke detail mapel kelas tersebut.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Subjects List per Class**:
  - **Endpoint**: `/api/subjects`
  - **Method**: `GET`
  - **Query Params**: `class_filter`
  - **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "1",
          "class_name": "Kelas 1-A",
          "subjects_count": 10,
          "syllabus_completeness": 85
        }
      ]
    }
    ```

---

## 9. Fitur Monitoring Absensi (Attendance Monitoring)

Halaman utama bagi Admin untuk melakukan pemantauan tingkat kehadiran harian guru, coach, dan siswa secara real-time.

### Elemen UI & Kegunaan
- **KPI Ringkasan Kehadiran**:
  - **Presensi Guru**: Persentase kehadiran guru hari ini (98.2%) dengan tren kenaikan bulanan.
  - **Presensi Coach**: Persentase kehadiran coach hari ini (94.8%) dengan status kestabilan 7 hari.
  - **Presensi Siswa**: Persentase kehadiran siswa hari ini (96.5%) dengan deskripsi tren/faktor pengaruh.
- **Aksi Dokumen & Filter**:
  - Tombol aksi `Download Rekapitulasi` dan Date Selector (`12 Okt 2023 - Hari Ini`).
- **Grafik Tren Kehadiran Bulanan**:
  - Diagram batang ganda (*dual bar chart*) yang menunjukkan perbandingan tingkat kehadiran Siswa (warna biru) vs Staf/Guru (warna hijau) pada bulan Juli s.d Desember.
- **Alert Banner/Info Kehadiran**:
  - Banner informasi terkait persentase kehadiran tertinggi (bulan Desember) beserta link pintas `Lihat Detail Analitik`.
- **Status Kehadiran Terbaru**:
  - Tabel yang merekam status absen paling baru, memuat nama, peran (Guru/Coach/Siswa), waktu presensi, status (Hadir/Terlambat/Absen), dan tombol aksi `Lihat Semua Riwayat`.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Attendance Trends**:
  - **Endpoint**: `/api/attendance/trends`
  - **Method**: `GET`
  - **Query Params**: `semester`
  - **Response**:
    ```json
    {
      "success": true,
      "data": [
        { "month": "Jul", "student_percentage": 72, "staff_percentage": 78 }
      ]
    }
    ```
- **Get Recent Attendance logs**:
  - **Endpoint**: `/api/attendance/recent`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "1",
          "name": "Ahmad Subarkah",
          "role": "Guru Matematika",
          "time": "07:05 WIB",
          "status": "Hadir"
        }
      ]
    }
    ```

---

## 10. Fitur Kelola Nilai (Grades Management)

Halaman bagi Admin untuk memantau performa akademik siswa per kelas dan mengelola input nilai rapor.

### Elemen UI & Kegunaan
- **Header & Filter**:
  - Breadcrumbs `Manajemen Nilai > Pilih Kelas` dan tombol aksi `Filter Tahun Ajaran`.
- **Grid Kartu Kelas (4 Kolom)**:
  - Menampilkan setiap data kelas dalam layout grid yang mencakup: Badge inisial kelas (1A, 1B, dll), Rata-rata nilai kelas (contoh: 88.5 warna hijau), Nama kelas (contoh: Kelas 1 - Abu Bakar), Foto/Inisial & nama Wali Kelas, Jumlah siswa, dan tombol pintas `Lihat Nilai` untuk mengelola data nilai siswa kelas tersebut secara detail.
- **Panel Statistik Akademik Sekolah**:
  - **Rata-rata Sekolah**: Nilai rata-rata seluruh siswa (87.2) beserta tren persentase peningkatan semester.
  - **Kenaikan Tertinggi**: Menampilkan kelas dengan grafik peningkatan nilai tertinggi (Kelas 5A - Zaid Bin Tsabit).
  - **Total Input Nilai**: Persentase kemajuan input nilai (94%) lengkap dengan bilah kemajuan (*progress bar* warna oranye).
  - **Grafik Batang SVG**: Representasi visual performa rata-rata kelas di semester berjalan.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Grades Class Summary**:
  - **Endpoint**: `/api/grades/summary`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "1",
          "class_code": "1A",
          "class_name": "Kelas 1 - Abu Bakar",
          "average_score": 88.5,
          "homeroom_teacher": "Sarah Wijaya, M.Pd",
          "students_count": 28
        }
      ]
    }
    ```
- **Get School Academic Stats**:
  - **Endpoint**: `/api/grades/school-stats`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "school_average": 87.2,
        "highest_growth_class": "Kelas 5A",
        "input_percentage": 94
      }
    }
    ```

---

## 11. Fitur Katalog Ekstrakurikuler (Extracurricular Catalog)

Halaman utama bagi Admin untuk melakukan monitoring, penambahan, dan pengelolaan program ekstrakurikuler serta minat bakat siswa.

### Elemen UI & Kegunaan
- **Header & Filter Tabs**:
  - Judul `Katalog Ekstrakurikuler` dan tombol filter tab horizontal (`Semua`, `Olahraga`, `Seni & Sains`).
- **Grid Kartu Program**:
  - Menampilkan daftar program ekstrakurikuler dalam layout grid 3 kolom:
    - Ikon representatif program (Robotik, Sepak Bola, dll) beserta badge kategori (`Sains`, `Olahraga`, `Seni`).
    - Detail program (Nama, Nama Coach pengajar).
    - Bilah kuota kemajuan pendaftaran siswa (termasuk status dinamis: normal, Penuh (warna merah), dan Hampir Penuh (warna oranye)).
    - Tombol `Lihat Detail` untuk menuju detail program.
- **Tombol Tambah Program**:
  - Dotted card `Tambah Program` dengan plus icon untuk membuat kurikulum ekstrakurikuler baru.
- **Panel Highlight Bawah**:
  - **Total Partisipasi**: Jumlah kumulatif siswa yang mengikuti ekskul (428 Siswa) beserta tren peningkatan.
  - **Program Terpopuler**: Ekskul dengan jumlah pendaftar tertinggi (Sepak Bola).
  - **Jadwal Terdekat**: Agenda kegiatan ekskul terdekat (Latihan Robotik - 14:00) dilengkapi tautan pintas `Lihat semua jadwal`.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Extracurricular Programs List**:
  - **Endpoint**: `/api/extracurriculars`
  - **Method**: `GET`
  - **Query Params**: `category`
  - **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "1",
          "title": "Robotik",
          "coach": "Mr. Budi Santoso",
          "category": "Sains",
          "students_count": 17,
          "capacity": 20
        }
      ]
    }
    ```

---

## 12. Fitur Kelola Pengguna (User Accounts Management)

Halaman utama bagi Admin untuk melakukan monitoring, penambahan, dan pengelolaan data akses akun pengguna.

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul `Manajemen Pengguna` dan tombol `+ Tambah Akun Baru`.
- **KPI Summary Cards (Top)**:
  - **Total Akun**: Jumlah seluruh akun terdaftar (124).
  - **Aktif Hari Ini**: Jumlah akun yang aktif hari ini (89).
  - **Admin**: Jumlah akun Administrator (6).
  - **Ditangguhkan**: Jumlah akun ditangguhkan (2).
- **Grid Kartu Pengguna**:
  - Menampilkan daftar akun pengguna dalam layout grid 3 kolom:
    - Inisial avatar dengan status dot dinamis (hijau: aktif, abu-abu: idle/offline).
    - Detail pengguna (Nama, Role badge (Administrator, Guru, Coach, Wali Murid)).
    - Info email dan tanggal login terakhir.
    - Tombol aksi `Ganti Password` dan `Hapus Akun`.
- **Tombol Tambah Akun**:
  - Dotted card `Tambah Akun` dengan plus icon untuk mendaftarkan pengguna baru.

### Rancangan Integrasi Backend (Masa Depan)
- **Get User Accounts List**:
  - **Endpoint**: `/api/users`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "1",
          "name": "Sarah Jenkins, M.Pd",
          "role": "Administrator",
          "email": "s.jenkins@lumina.edu",
          "last_login": "2026-07-11T20:30:00Z",
          "status": "active"
        }
      ]
    }
    ```

---

## 13. Fitur Profil Guru (Teacher Profile)

Halaman untuk melihat informasi biodata, penugasan mata pelajaran, daftar kelas, dan ringkasan metrik kinerja serta kehadiran guru secara individu.

### Elemen UI & Kegunaan
- **Kartu Profil Utama (Kiri)**:
  - Avatar inisial dengan badge overlay status `Aktif`.
  - Detail Guru (Nama lengkap, NIP, tombol `Edit Profil`, dan `Hapus`).
  - Informasi kontak & kepegawaian: Email, Nomor Telepon, tanggal Bergabung Sejak, dan Alamat lengkap.
- **Kartu Status Wali Kelas (Kanan Atas)**:
  - Kartu solid blue yang menunjukkan apakah guru tersebut merupakan wali kelas (contoh: Wali Kelas Kelas 4-C) beserta jumlah siswa tanggung jawabnya (32 siswa) dan tautan pintas `Lihat Kelas`.
- **Kartu Penugasan (Kanan Bawah)**:
  - **Mata Pelajaran Diampu**: Daftar subjek kurikulum yang diajarkan (contoh: Matematika, IPA, Pendidikan Pancasila) dengan tautan eksternal.
  - **Kelas Diampu**: Daftar kelas tempat guru tersebut mengajar (4-A, 4-C, 5-B, 6-A).
- **Panel Ringkasan Kinerja & Kehadiran (Bawah)**:
  - **Kehadiran Mengajar**: Metrik persentase kehadiran mengajar guru (98.4%) lengkap dengan bar progres hijau.
  - **Rata-rata Nilai Siswa**: Rata-rata nilai siswa yang diajar (87.5) lengkap dengan bar progres biru.
  - **Tambah Widget Analisis**: Dotted card untuk konfigurasi penambahan visualisasi metrik baru.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Teacher Profile Details**:
  - **Endpoint**: `/api/teachers/:id`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "id": "1",
        "name": "Bambang Wijaya, S.Pd.",
        "nip": "19850312 201001 1 004",
        "email": "bambang.wijaya@lumina.sch.id",
        "phone": "+62 812-3456-7890",
        "join_date": "2010-01-15T00:00:00Z",
        "address": "Jl. Mentari Pagi No. 45, Kebayoran Lama, Jakarta Selatan",
        "homeroom_class": "Kelas 4–C",
        "homeroom_students": 32,
        "subjects": ["Matematika", "IPA", "Pendidikan Pancasila"],
        "classes": ["4-A", "4-C", "5-B", "6-A"],
        "performance": {
          "attendance_rate": 98.4,
          "students_average_score": 87.5
        }
      }
    }
    ```

---

## 14. Fitur Tambah Guru Baru (Add New Teacher Form)

Formulir bagi Admin untuk menambahkan guru baru ke dalam sistem dengan menginput biodata pribadi, informasi kontak, mengunggah foto profil, serta mengatur penugasan mengajar awal.

### Elemen UI & Kegunaan
- **Header & Action buttons**:
  - Judul `Tambah Guru Baru` dan tombol `Batal` (kembali ke daftar) serta `Simpan Data Guru`.
- **Form Kiri (Data Penjaringan)**:
  - **Biodata Pribadi**: Form input Nama Lengkap, NIP, Tempat Lahir, Tanggal Lahir (kalender), Jenis Kelamin (dropdown L/P), dan Alamat Tinggal (textarea).
  - **Informasi Kontak**: Form input Alamat Email dan Nomor Telepon/WhatsApp.
  - **Penugasan Pengajar**: Tag/Pills untuk Mata Pelajaran Diampu dan Kelas Diampu dengan aksi hapus (silang) atau tambah, beserta toggle switch "Set Sebagai Wali Kelas" dan dropdown penugasan kelas wali.
- **Panel Kanan (Media & Status)**:
  - **Foto Profil Guru**: Area seret-lepas/upload berkas foto berformat .jpg/.png maksimal 2MB, dilengkapi dengan petunjuk tips unggahan yang baik.
  - **Status Pendaftaran**: Status kemajuan kelengkapan form input (persentase kelengkapan data, contoh: 45%) yang dilengkapi dengan indikator checklist interaktif.

### Rancangan Integrasi Backend (Masa Depan)
- **Create New Teacher**:
  - **Endpoint**: `/api/teachers`
  - **Method**: `POST`
  - **Request Body (Multipart Form-Data)**:
    - `name` (String)
    - `nip` (String)
    - `birth_place` (String)
    - `birth_date` (String/Date)
    - `gender` (Enum: `L`, `P`)
    - `address` (String)
    - `email` (String)
    - `phone` (String)
    - `subjects` (Array of Strings)
    - `classes` (Array of Strings)
    - `is_homeroom` (Boolean)
    - `homeroom_class` (String)
    - `profile_photo` (Binary/File)
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Data guru berhasil didaftarkan",
      "teacher_id": "usr_02"
    }
    ```

---

## 15. Fitur Edit Data Guru (Edit Teacher Form)

Formulir bagi Admin untuk memperbarui informasi data kepegawaian guru yang telah terdaftar di sistem.

### Elemen UI & Kegunaan
- **Header & Action buttons**:
  - Judul `Edit Data Guru` dan tombol `Batal` (kembali ke profil) serta `Simpan Perubahan`.
- **Form Pengeditan**:
  - Sama dengan Form Tambah Guru, namun seluruh field data (Biodata Pribadi, Informasi Kontak, Penugasan Pengajar, dan Foto Profil) telah **diisi secara otomatis (pre-filled)** dengan data guru yang dipilih dari database.
  - Penunjuk kemajuan kelengkapan form menampilkan `100%` dengan status indikator checklist langkah semuanya bertanda centang hijau.

### Rancangan Integrasi Backend (Masa Depan)
- **Update Teacher Data**:
  - **Endpoint**: `/api/teachers/:id`
  - **Method**: `PUT` or `PATCH`
  - **Request Body (Multipart Form-Data)**:
    - field biodata, kontak, penugasan, dan foto profil.
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Perubahan data guru berhasil disimpan"
    }
    ```













