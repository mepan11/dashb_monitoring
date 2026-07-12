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

---

## 16. Fitur Profil Coach (Coach Profile)

Halaman untuk melihat informasi data diri, bidang spesialisasi ekstrakurikuler yang diampu, hari dan lokasi latihan, serta ringkasan penilaian metrik kinerja coach secara individu.

### Elemen UI & Kegunaan
- **Kartu Profil Utama (Kiri)**:
  - Avatar inisial dengan badge overlay status `Aktif`.
  - Detail Coach (Nama lengkap, ID Number, tombol `Edit Profil`, dan `Hapus`).
  - Informasi kontak: Email, Nomor Telepon, tanggal Bergabung Sejak, dan Alamat lengkap.
- **Kartu Spesialisasi Utama (Kanan Atas)**:
  - Kartu solid emerald green yang menunjukkan bidang spesialisasi yang diampu (contoh: Robotik & Coding) beserta jumlah siswa binaan (20 siswa) dan tautan pintas `Lihat Program`.
- **Kartu Jadwal & Lokasi Latihan (Kanan Bawah)**:
  - **Hari Latihan**: Daftar hari jadwal pelatihan (Selasa, Kamis) dengan tautan detail.
  - **Lokasi Latihan**: Tempat latihan diselenggarakan (Lab Komputer 2, Ruang Robotik).
- **Panel Ringkasan Kinerja Latihan (Bawah)**:
  - **Tingkat Kehadiran**: Metrik persentase kehadiran mengajar coach (96.5%) lengkap dengan bar progres hijau.
  - **Kepuasan Siswa**: Rata-rata penilaian umpan balik kepuasan siswa (4.8 / 5.0) lengkap dengan bar progres biru.
  - **Tambah Widget Analisis**: Dotted card untuk konfigurasi penambahan visualisasi metrik baru.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Coach Profile Details**:
  - **Endpoint**: `/api/coaches/:id`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "id": "1",
        "name": "Ahmad Subardjo",
        "id_number": "LC-2024-001",
        "email": "ahmad.s@lumina.sch.id",
        "phone": "+62 812-3456-7890",
        "join_date": "2024-02-12T00:00:00Z",
        "address": "Jl. Flamboyan No. 12, Jakarta Selatan",
        "specialization": "Robotik & Coding",
        "students_count": 20,
        "schedule_days": ["Selasa", "Kamis"],
        "locations": ["Lab Komputer 2", "Ruang Robotik"],
        "performance": {
          "attendance_rate": 96.5,
          "satisfaction_rate": 4.8
        }
      }
    }
    ```

---

## 17. Fitur Tambah Coach Baru (Add New Coach Form)

Formulir bagi Admin untuk menambahkan coach/pelatih baru ke dalam sistem dengan menginput biodata pribadi, informasi kontak, mengunggah foto profil, serta mengatur spesialisasi & program ekstrakurikuler yang diampu.

### Elemen UI & Kegunaan
- **Form Kiri**:
  - **Biodata Pribadi**: Form input Nama Lengkap, ID Number/NIK (16 digit), Jenis Kelamin (dropdown L/P), Tempat Lahir, Tanggal Lahir (kalender), dan Alamat domisili saat ini (textarea).
  - **Informasi Kontak**: Form input Alamat Email dan Nomor Telepon/WhatsApp (dilengkapi prefix +62 static).
  - **Penugasan Coach**: Dropdown Spesialisasi (Sains, Olahraga, Seni) dan input teks Bidang Ekskul yang Diampu.
- **Panel Kanan (Media & Status)**:
  - **Foto Profil Coach**: Area avatar dengan tombol `Pilih File Foto` untuk memilih berkas format .jpg/.png maksimal 2MB, dilengkapi dengan petunjuk tips unggahan yang baik.
  - **Status Pendaftaran**: Status kemajuan kelengkapan form input (persentase kelengkapan data, contoh: 45%) yang dilengkapi dengan indikator checklist interaktif.
- **Aksi Footer**: Tombol `Batalkan` (kembali ke coach) dan `Simpan Data Coach`.

### Rancangan Integrasi Backend (Masa Depan)
- **Create New Coach**:
  - **Endpoint**: `/api/coaches`
  - **Method**: `POST`
  - **Request Body (Multipart Form-Data)**:
    - `name` (String)
    - `nik` (String)
    - `gender` (Enum: `L`, `P`)
    - `birth_place` (String)
    - `birth_date` (String/Date)
    - `address` (String)
    - `email` (String)
    - `phone` (String)
    - `specialization` (String)
    - `ekskul_field` (String)
    - `profile_photo` (Binary/File)
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Data coach berhasil didaftarkan",
      "coach_id": "cch_02"
    }
    ```

---

## 18. Fitur Edit Data Coach (Edit Coach Form)

Formulir bagi Admin untuk memperbarui informasi data kepegawaian coach yang telah terdaftar di sistem.

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul `Edit Data Coach` dan tombol `Batalkan` (kembali ke profil) serta `Simpan Perubahan`.
- **Form Pengeditan**:
  - Sama dengan Form Tambah Coach, namun seluruh field data (Biodata Pribadi, Informasi Kontak, Penugasan Coach, dan Foto Profil) telah **diisi secara otomatis (pre-filled)** dengan data coach Ahmad Subardjo.
  - Penunjuk kemajuan kelengkapan form menampilkan `100%` dengan status indikator checklist langkah semuanya bertanda centang hijau.

### Rancangan Integrasi Backend (Masa Depan)
- **Update Coach Data**:
  - **Endpoint**: `/api/coaches/:id`
  - **Method**: `PUT` or `PATCH`
  - **Request Body (Multipart Form-Data)**:
    - field biodata, kontak, penugasan, dan foto profil.
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Perubahan data coach berhasil disimpan"
    }
    ```

---

## 19. Fitur Profil Siswa (Student Profile)

Halaman untuk melihat informasi data pribadi siswa, status penugasan akademik kelas, riwayat persentase kehadiran sekolah, serta rangkuman pencapaian nilai mata pelajaran.

### Elemen UI & Kegunaan
- **Overview Card (Atas)**:
  - Foto profil siswa dengan tombol kamera overlay.
  - Detail Siswa (Nama: Aris Setiawan, NISN: 0098223145, Badge Status Aktif, dan Periode Akademik).
  - Tombol aksi `Hapus`, `Cetak` data laporan, dan `Edit Profil`.
- **Informasi Pribadi (Kiri)**:
  - Biodata personal siswa: Tempat & Tanggal Lahir, Jenis Kelamin, Alamat Domisili KTP, Nama Wali, dan Kontak Wali.
- **Akademik Card (Kanan)**:
  - Kartu solid blue memuat data Kelas Saat Ini (Kelas 5-B), Nama Wali Kelas (Ibu Sarah Wijaya, M.Pd), serta tombol pintas `Lihat Jadwal Kelas`.
- **Kehadiran Card (Bawah Kiri)**:
  - Penunjuk persentase tingkat kehadiran sekolah (95%) menggunakan visualisasi cincin kemajuan melingkar (*circular progress ring*).
- **Rangkuman Nilai (Bawah Kanan)**:
  - Daftar nilai pencapaian siswa per subjek (Matematika: 92, Bahasa Indonesia: 85, IPA: 89) lengkap dengan bilah kemajuan hijau dan penunjuk rata-rata kelas.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Student Profile Details**:
  - **Endpoint**: `/api/students/:id`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "id": "1",
        "name": "Aris Setiawan",
        "nisn": "0098223145",
        "gender": "Laki-laki",
        "birth_details": "Jakarta, 14 Mei 2012",
        "address": "Jl. Mawar Melati No. 45, Kebayoran Baru, Jakarta Selatan",
        "guardian_name": "Bp. Hendra Setiawan",
        "guardian_phone": "+62 812-3456-7890",
        "academic": {
          "current_class": "Kelas 5-B",
          "homeroom_teacher": "Ibu Sarah Wijaya, M.Pd"
        },
        "attendance_rate": 95,
        "grades": [
          { "subject": "Matematika", "score": 92 },
          { "subject": "Bahasa Indonesia", "score": 85 },
          { "subject": "Ilmu Pengetahuan Alam", "score": 89 }
        ],
        "grades_average": 88.5
      }
    }
    ```

---

## 20. Fitur Tambah Siswa Baru (Add New Student Form)

Formulir bagi Admin untuk menambahkan siswa baru ke dalam sistem, mengatur kontak wali murid, memplot penempatan akademik, serta melengkapi foto profil.

### Elemen UI & Kegunaan
- **Form Kiri (3 Langkah Form)**:
  - **1. Biodata Pribadi**: Input Nama Lengkap Siswa, NISN (10 digit), Jenis Kelamin (dropdown L/P), Tempat Lahir, Tanggal Lahir (kalender), dan Alamat domisili tempat tinggal (textarea).
  - **2. Informasi Kontak Orang Tua**: Input Email Orang Tua / Wali (dengan ikon surat) dan Nomor Telepon/WA (dengan ikon telepon).
  - **3. Penempatan Akademik**: Dropdown Tingkat Kelas (Kelas 1-6) dan Kelompok Belajar/Section (A-C).
- **Panel Kanan (Media & Status)**:
  - **Foto Profil Siswa**: Area lingkaran avatar dengan tombol kamera overlay biru dan tombol aksi `Pilih Foto` untuk memilih berkas format .jpg/.png maksimal 2MB.
  - **Progres Pendaftaran**: Status kemajuan kelengkapan form input (persentase kelengkapan data, contoh: 75%) yang dilengkapi dengan indikator checklist interaktif.
  - **Tips Admin**: Kotak bantuan biru berisi peringatan validasi NISN dengan database Dapodik nasional untuk menghindari duplikasi.
- **Aksi Header**: Tombol `Batalkan` (kembali ke daftar siswa) dan `Simpan Data Siswa`.

### Rancangan Integrasi Backend (Masa Depan)
- **Create New Student**:
  - **Endpoint**: `/api/students`
  - **Method**: `POST`
  - **Request Body (Multipart Form-Data)**:
    - `name` (String)
    - `nisn` (String)
    - `gender` (Enum: `L`, `P`)
    - `birth_place` (String)
    - `birth_date` (String/Date)
    - `address` (String)
    - `parent_email` (String)
    - `parent_phone` (String)
    - `grade_level` (String)
    - `section` (String)
    - `profile_photo` (Binary/File)
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Data siswa berhasil didaftarkan",
      "student_id": "std_02"
    }
    ```

---

## 21. Fitur Edit Data Siswa (Edit Student Form)

Formulir bagi Admin untuk memperbarui informasi data akademik, data pribadi, dan data wali siswa yang telah terdaftar di sistem.

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul `Edit Data Siswa` dan tombol `Batalkan` (kembali ke profil) serta `Simpan Perubahan`.
- **Form Pengeditan**:
  - Sama dengan Form Tambah Siswa, namun seluruh field data (Biodata Pribadi, Informasi Kontak, Penempatan Akademik, dan Foto Profil) telah **diisi secara otomatis (pre-filled)** dengan data profil Aris Setiawan.
  - Penunjuk kemajuan kelengkapan form menampilkan `100%` dengan status indikator checklist langkah semuanya bertanda centang hijau.

### Rancangan Integrasi Backend (Masa Depan)
- **Update Student Data**:
  - **Endpoint**: `/api/students/:id`
  - **Method**: `PUT` or `PATCH`
  - **Request Body (Multipart Form-Data)**:
    - field biodata, kontak, akademik, dan foto profil.
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Perubahan data siswa berhasil disimpan"
    }
    ```

---

## 22. Fitur Detail Kelas (Class Details View)

Halaman untuk melihat statistik komprehensif dari suatu kelas spesifik beserta daftar nama siswa yang terdaftar di kelas tersebut.

### Elemen UI & Kegunaan
- **Header & Subtitle**:
  - Judul kelas (contoh: Kelas 4-C) dan Nama Wali Kelas (Ibu Sarah Wijaya, S.Pd.).
  - Tombol aksi `Export Data` laporan kelas dan `+ Tambah Siswa`.
- **KPI Summary Cards (Top)**:
  - **Total Siswa**: Jumlah siswa terdaftar (32) beserta tren semester.
  - **Laki-laki**: Jumlah siswa laki-laki (14).
  - **Perempuan**: Jumlah siswa perempuan (18).
  - **Kehadiran Hari Ini**: Persentase kehadiran rata-hari siswa hari ini (98%).
- **Daftar Siswa Card**:
  - Menampilkan daftar nama siswa dalam format tabel:
    - Kolom: Photo avatar, Nama Lengkap (dan nomor urut absen), NISN, Gender badge (orange untuk laki-laki, hijau untuk perempuan), Status aktif (dot hijau), dan tombol aksi 3-titik.
    - Selektor filter gender dan status keaktifan di bagian atas tabel.
    - Pagination footer di bagian bawah tabel.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Class Details**:
  - **Endpoint**: `/api/classes/:id`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "class_id": "1",
        "class_name": "Kelas 4-C",
        "homeroom_teacher": "Ibu Sarah Wijaya, S.Pd.",
        "stats": {
          "total_students": 32,
          "male_count": 14,
          "female_count": 18,
          "attendance_today": 98
        },
        "students": [
          {
            "id": "1",
            "name": "Aditya Pratama",
            "absen_number": "01",
            "nisn": "0123456789",
            "gender": "Laki-laki",
            "status": "Aktif"
          }
        ]
      }
    }
    ```

---

## 23. Fitur Detail Daftar Mata Pelajaran Kelas (Class Subjects List View)

Halaman untuk melihat dan mengelola kurikulum pembagian tugas mengajar beserta alokasi jadwal mata pelajaran untuk kelas spesifik.

### Elemen UI & Kegunaan
- **Breadcrumbs & Header**:
  - Breadcrumb: `Dashboard > Mata Pelajaran > Daftar Mata Pelajaran (Kelas 4-C)`.
  - Judul halaman `Daftar Mata Pelajaran - Kelas 4-C` dan deskripsi singkat.
  - Tombol aksi `+ Tambah Mata Pelajaran`.
- **KPI Summary Cards (Top)**:
  - **Total Mata Pelajaran**: Jumlah total mata pelajaran terdaftar (12).
  - **Mata Pelajaran Akademik**: Jumlah mata pelajaran kategori akademik (8).
  - **Non-Akademik / Ekskul**: Jumlah mata pelajaran kategori non-akademik/ekstrakurikuler (4).
- **Daftar Mata Pelajaran Card**:
  - Menampilkan daftar nama mapel dalam format tabel:
    - Kolom: Mata Pelajaran (nama & ikon buku), Kategori badge (`AKADEMIK`/`NON-AKADEMIK`), Guru Pengajar (avatar inisial & nama), Jadwal (Hari & Jam), Progres Silabus (persentase & bilah progress hijau), dan tombol Aksi (`Detail/Eye`, `Ubah/Pencil`, `Hapus/Trash`).
    - Input kolom pencarian dan tombol sortir nama A-Z di bagian atas tabel.
    - Pagination footer di bagian bawah tabel.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Class Subjects Details**:
  - **Endpoint**: `/api/classes/:class_id/subjects`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "class_id": "1",
        "class_name": "Kelas 4-C",
        "stats": {
          "total_subjects": 12,
          "academic_count": 8,
          "non_academic_count": 4
        },
        "subjects": [
          {
            "id": "1",
            "name": "Matematika",
            "category": "AKADEMIK",
            "teacher": "Bpk. Aris Setiawan",
            "schedule": "Senin, 08:00 - 09:30",
            "syllabus_progress": 75
          }
        ]
      }
    }
    ```

---

## 24. Fitur Tambah Mata Pelajaran ke Kelas (Add Subject to Class Form)

Formulir bagi Admin untuk menambahkan mata pelajaran baru ke kelas tertentu, menunjuk guru pengampu, serta menjadwalkan alokasi waktu mingguan.

### Elemen UI & Kegunaan
- **Form Pilihan Utama**:
  - **Pilih Mata Pelajaran**: Dropdown pemilih mata pelajaran kurikulum (Matematika, B. Indonesia, IPA, B. Inggris, Seni, PJOK).
  - **Pilih Guru Pengajar**: Dropdown pemilih guru pengampu yang terdaftar di sekolah.
- **Pengaturan Jadwal Mingguan**:
  - **Pilih Hari**: Pills selektor multi-hari interaktif (Senin-Sabtu) untuk menandai jadwal masuk.
  - **Waktu Mulai & Selesai**: Input teks/jam (dengan ikon jam pada sisi kanan) untuk menginput detail jam alokasi belajar.
- **Info/Tip Box (Bawah)**:
  - Alert box berwarna hijau menginformasikan integrasi otomatis mata pelajaran ke laporan capaian belajar dan absensi kelas 4-C.
- **Aksi Footer**: Tombol link teks `Batalkan` (kembali ke detail kurikulum kelas) dan tombol solid `+ Tambah ke Kurikulum`.

### Rancangan Integrasi Backend (Masa Depan)
- **Assign Subject to Class**:
  - **Endpoint**: `/api/classes/:class_id/subjects`
  - **Method**: `POST`
  - **Request Body (JSON)**:
    ```json
    {
      "subject_id": "math_01",
      "teacher_id": "tchr_01",
      "days": ["Senin", "Rabu"],
      "start_time": "08:00",
      "end_time": "09:30"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Mata pelajaran berhasil ditambahkan ke kelas 4-C"
    }
    ```

---

## 25. Fitur Edit Mata Pelajaran (Edit Subject Form)

Formulir bagi Admin untuk memperbarui data alokasi kurikulum pengajaran, penugasan guru pengampu, serta waktu jadwal masuk mingguan untuk mata pelajaran yang telah terdaftar di kelas.

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul `Edit Mata Pelajaran` dan tombol `Batalkan` serta `Simpan Perubahan`.
- **Form Pengeditan**:
  - Sama dengan Form Tambah Mata Pelajaran ke Kelas, namun seluruh field data (Mata Pelajaran: Matematika, Guru Pengajar: Bpk. Aris Setiawan, Hari: Senin & Rabu, serta jam detail alokasi waktu) telah **diisi secara otomatis (pre-filled)**.

### Rancangan Integrasi Backend (Masa Depan)
- **Update Subject Assignment**:
  - **Endpoint**: `/api/classes/:class_id/subjects/:subject_id`
  - **Method**: `PUT` or `PATCH`
  - **Request Body (JSON)**:
    ```json
    {
      "teacher_id": "tchr_01",
      "days": ["Senin", "Rabu"],
      "start_time": "08:00",
      "end_time": "09:30"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Detail kurikulum mata pelajaran berhasil diperbarui"
    }
    ```

---

## 26. Fitur Presensi Guru (Teacher Attendance Dashboard)

Halaman monitoring tingkat kehadiran, ketepatan waktu datang, serta permohonan izin/absen bagi tenaga pengajar (guru) hari ini.

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul `Presensi Guru` dan deskripsi pemantauan kedisiplinan guru hari ini.
  - Selektor kalender tanggal (contoh: 10/12/2023) dan tombol `Download Rekap` rekapitulasi kehadiran.
- **KPI Summary Cards (Top)**:
  - **Total Guru**: Jumlah total guru terdaftar (48).
  - **Hadir Hari Ini**: Jumlah guru yang telah presensi hadir (42).
  - **Terlambat**: Jumlah guru yang datang terlambat (4).
  - **Absen / Izin**: Jumlah guru yang berhalangan hadir (2).
- **Data Kehadiran Guru Table**:
  - Menampilkan daftar riwayat kehadiran per baris:
    - Kolom: Nama Guru (dan NIP), Bidang Mata Pelajaran (disertai ikon kategori), Waktu Presensi datang (WIB), Status badge (`Hadir` hijau, `Terlambat` orange, `Izin` biru), dan link pintas `Detail` mengarah ke profil guru.
    - Filter kategori mata pelajaran dan tombol penyaring status kelayakan di bagian atas tabel.
    - Pagination footer di bagian bawah tabel.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Teachers Attendance**:
  - **Endpoint**: `/api/attendance/teachers`
  - **Method**: `GET`
  - **Query Params**: `date` (YYYY-MM-DD), `subject` (String)
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "date": "2023-12-10",
        "stats": {
          "total_teachers": 48,
          "present_count": 42,
          "late_count": 4,
          "absent_count": 2
        },
        "attendance": [
          {
            "id": "1",
            "teacher_name": "Siti Aminah, S.Pd.",
            "nip": "19850312011012003",
            "subject": "Guru Kelas 4A",
            "check_in_time": "07:05 WIB",
            "status": "Hadir"
          }
        ]
      }
    }
    ```

---

## 27. Fitur Presensi Coach (Coach Attendance Dashboard)

Halaman monitoring tingkat kehadiran, ketepatan waktu datang, serta permohonan izin/absen bagi instruktur (coach) ekstrakurikuler hari ini.

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul `Presensi Coach` dan deskripsi pemantauan kedisiplinan coach hari ini.
  - Selektor kalender tanggal (contoh: 07/11/2026) dan tombol `Download Rekap` rekapitulasi kehadiran.
- **KPI Summary Cards (Top)**:
  - **Total Coach**: Jumlah total coach terdaftar (24).
  - **Hadir Hari Ini**: Jumlah coach yang telah presensi hadir (21).
  - **Terlambat**: Jumlah coach yang datang terlambat (2).
  - **Absen / Izin**: Jumlah coach yang berhalangan hadir (1).
- **Data Kehadiran Coach Table**:
  - Menampilkan daftar riwayat kehadiran per baris:
    - Kolom: Nama Coach (dan ID), Bidang Ekstrakurikuler (disertai ikon kategori), Waktu Presensi datang (WIB), Status badge (`Hadir` hijau, `Terlambat` orange, `Izin` biru, `Absen` merah), dan link pintas `Detail` mengarah ke profil coach.
    - Filter kategori ekstrakurikuler dan tombol penyaring status kelayakan di bagian atas tabel.
    - Pagination footer di bagian bawah tabel.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Coaches Attendance**:
  - **Endpoint**: `/api/attendance/coaches`
  - **Method**: `GET`
  - **Query Params**: `date` (YYYY-MM-DD), `extracurricular` (String)
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "date": "2026-11-07",
        "stats": {
          "total_coaches": 24,
          "present_count": 21,
          "late_count": 2,
          "absent_count": 1
        },
        "attendance": [
          {
            "id": "1",
            "coach_name": "Agung Setiawan",
            "coach_id": "C-0012",
            "extracurricular": "Sepak Bola",
            "check_in_time": "15:10 WIB",
            "status": "Hadir"
          }
        ]
      }
    }
    ```

---

## 28. Fitur Presensi Siswa (Student Attendance Dashboard)

Halaman untuk memantau detail persentase tingkat kehadiran siswa berdasarkan pengelompokan tingkat kelas (1A-6B) hari ini.

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul `Presensi Siswa` dan subtitle `Pilih kelas untuk melihat detail kehadiran siswa.`
  - Filter penanggalan untuk memantau data kehadiran pada tanggal lampau (contoh: 10/27/2023).
- **KPI Summary Cards (Top)**:
  - **Total Siswa Hadir**: Jumlah siswa yang hadir dari total keseluruhan (312/320).
  - **Rata-rata Kehadiran**: Persentase rata-rata siswa hadir (97.5%).
  - **Siswa Alpha Hari Ini**: Jumlah murid absen tanpa keterangan (3 siswa).
- **Grid Kartu Kelas (12 Kelas)**:
  - Masing-masing kartu kelas berisi: persentase kehadiran (warna hijau/orange/merah sesuai performa), nama kelas (contoh: Kelas 1A), nama wali kelas, bilah kemajuan progres hari ini, total siswa, dan tombol `Lihat Detail` yang mengarah ke Detail Kelas.
- **Floating Button (Bawah Kanan)**:
  - Tombol melingkar `+` (Plus) biru untuk menambahkan data absensi baru.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Students Attendance Summary**:
  - **Endpoint**: `/api/attendance/students`
  - **Method**: `GET`
  - **Query Params**: `date` (YYYY-MM-DD)
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "date": "2023-10-27",
        "stats": {
          "total_present": 312,
          "total_students": 320,
          "average_rate": 97.5,
          "alpha_count": 3
        },
        "classes_attendance": [
          {
            "class_id": "1",
            "class_name": "Kelas 1A",
            "homeroom_teacher": "Bu Sarah Aminah",
            "attendance_rate": 98,
            "students_count": 28
          }
        ]
      }
    }
    ```

---

## 29. Fitur Input & Lihat Nilai Siswa Kelas (Class Grades View)

Halaman untuk melihat, mengedit, dan mengekspor daftar perolehan nilai akademik harian, UTS, UAS, serta nilai ekstrakurikuler murid pada kelas tertentu.

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul `Input Nilai: Kelas 4-C` dan keterangan metode penginputan.
  - Tombol aksi `Upload Nilai Tugas (Excel)` untuk bulk import dan `Download Rekap Nilai` untuk ekspor nilai.
- **KPI Summary Cards (Top)**:
  - **Tahun Akademik**: Periode tahun ajaran (2023/2024).
  - **Semester**: Keterangan semester berjalan (Ganjil).
  - **Total Siswa**: Jumlah siswa terdaftar di kelas (32).
  - **Di Bawah KKM**: Jumlah siswa dengan performa di bawah standar kelulusan KKM (4).
- **Daftar Nilai Siswa Table**:
  - Menampilkan daftar perolehan nilai per murid:
    - Kolom: Nomor, Nama Siswa (dan avatar inisial), NISN, Tugas Harian (disertai status update e.g. `BULK UPDATED`/`REQUIRES ACTION`), Nilai Ekstrakurikuler, UTS, UAS, Nilai Rata-rata (dengan penekanan warna biru lulus / merah remedial), serta Status kelulusan (`Lulus`/`Remedial`).
    - Input pencarian berdasarkan nama siswa di bagian atas tabel.
    - Pagination footer di bagian bawah tabel.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Class Student Grades**:
  - **Endpoint**: `/api/classes/:class_id/grades`
  - **Method**: `GET`
  - **Query Params**: `search` (String)
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "class_id": "1",
        "class_name": "Kelas 4-C",
        "academic_year": "2023/2024",
        "semester": "Ganjil",
        "stats": {
          "total_students": 32,
          "below_kkm_count": 4
        },
        "grades": [
          {
            "no": 1,
            "student_name": "Aditya Pratama",
            "nisn": "0123984712",
            "daily_assignment": 85.4,
            "daily_status": "BULK UPDATED",
            "extracurricular": 80.0,
            "uts": 88.0,
            "uas": 92.0,
            "average": 86.3,
            "status": "Lulus"
          }
        ]
      }
    }
    ```
- **Upload Grades Bulk via Excel**:
  - **Endpoint**: `/api/classes/:class_id/grades/upload`
  - **Method**: `POST`
  - **Request Body (Multipart Form-Data)**:
    - `file` (Binary/Excel spreadsheet)
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Bulk upload data nilai berhasil diproses"
    }
    ```

---

## 30. Fitur Detail Ekstrakurikuler (Extracurricular Details View)

Halaman untuk melihat detail struktur organisasi pelatih utama, rincian jadwal latihan mingguan, lokasi pelaksanaan, serta daftar partisipasi keikutsertaan siswa dalam suatu program ekstrakurikuler (contoh: Robotik).

### Elemen UI & Kegunaan
- **Header & Action**:
  - Judul program (Robotik), Kategori bidang (Sains & Teknologi), dan Jumlah Siswa Terdaftar (24 siswa).
  - Tombol aksi `Unduh Daftar Siswa` dan `+ Tambah Siswa`.
- **Pelatih Utama Card (Kiri)**:
  - Foto dan nama Pelatih/Coach (Rizky Kurniawan, NIK/ID Coach) dengan indikator centang hijau verifikasi.
  - Rincian Informasi: Jadwal Latihan (Selasa & Kamis, 15:30), Lokasi Latihan (Lab Komputer & Robotik), serta email kontak pelatih utama.
  - Tombol edit (ikon pensil) di pojok kanan atas untuk memodifikasi profil pelatih.
- **Daftar Partisipasi Siswa Card (Kanan)**:
  - Tabel data keanggotaan murid:
    - Kolom: Nama Siswa (dan avatar inisial), Kelas (e.g. 5-B), NISN, dan Status keaktifan (`Aktif` hijau, `Izin` amber, `Nonaktif` merah).
    - Kolom pencarian berdasarkan nama/NISN siswa di bagian atas tabel.
    - Pagination footer di bagian bawah tabel.

### Rancangan Integrasi Backend (Masa Depan)
- **Get Extracurricular Details**:
  - **Endpoint**: `/api/extracurriculars/:id`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "id": "1",
        "title": "Robotik",
        "category": "Sains & Teknologi",
        "total_students": 24,
        "coach": {
          "name": "Rizky Kurniawan",
          "coach_id": "#RCT-2023-042",
          "schedule": "Selasa & Kamis, 15:30",
          "location": "Lab Komputer & Robotik",
          "email": "r.kurniawan@lumina.sch.id"
        },
        "students": [
          {
            "id": "1",
            "name": "Aditya Saputra",
            "class_name": "5-B",
            "nisn": "0092813341",
            "status": "Aktif"
          }
        ]
      }
    }
    ```

---

## 31. Fitur Tambah Siswa ke Ekstrakurikuler (Add Student to Extracurricular Form)

Formulir interaktif multi-seleksi untuk mendaftarkan satu atau beberapa siswa sekaligus ke dalam kelas program ekstrakurikuler tertentu.

### Elemen UI & Kegunaan
- **Header & Info Context**:
  - Judul `Tambah Siswa ke Ekstrakurikuler` beserta detail level kurikulum ekskul (Robotik Dasar (Level 1)) dan tombol silang `X` untuk menutup form.
- **Search & Filter Options**:
  - Kolom input pencarian siswa serta sub-info sortir kelas/A-Z dan jumlah total siswa tersedia (124 Siswa Tersedia).
- **Multi-Selection Student List (Tabel)**:
  - Kolom: Checkbox (mendukung seleksi individual & select-all di header), Nama Siswa (dan avatar inisial), Kelas (e.g. 4-A), dan NISN.
  - Baris siswa yang dipilih (e.g. Bagas Pratama, Citra Salsabila) menampilkan latar belakang biru transparan tipis dan checkbox tercentang.
- **Action Footer Bar**:
  - Informasi Ringkasan: Sisi kiri menampilkan tumpukan lingkaran avatar inisial siswa yang sedang dipilih disertai tulisan ringkasan jumlah (e.g. 2 Siswa Terpilih).
  - Tombol aksi `Batalkan` (kembali ke rincian ekskul) dan `Tambahkan Siswa` (menyimpan alokasi pendaftaran).

### Rancangan Integrasi Backend (Masa Depan)
- **Assign Students to Extracurricular**:
  - **Endpoint**: `/api/extracurriculars/:extracurricular_id/students`
  - **Method**: `POST`
  - **Request Body (JSON)**:
    ```json
    {
      "student_ids": ["2", "3"]
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "2 Siswa berhasil didaftarkan ke program ekstrakurikuler Robotik"
    }
    ```

---

## 32. Fitur Pendaftaran Akun Baru (Register New Account Form)

Formulir pendaftaran untuk mendaftarkan dan membuat akses akun pengguna baru ke dalam sistem aplikasi monitoring (admin, guru, coach, wali murid).

### Elemen UI & Kegunaan
- **Header & Title**:
  - Judul `Pendaftaran Akun Baru` dan instruksi deskripsi `Lengkapi data di bawah ini untuk membuat akses pengguna baru ke sistem.`
- **Foto Profil Uploader (Kiri)**:
  - Lingkaran placeholder avatar default dengan label `Foto Profil` dan pembatasan `Maksimal 2MB (JPG, PNG)`.
  - Tombol `Pilih Foto Profil` untuk memilih gambar lokal dari perangkat.
- **Input Fields Form (Kanan)**:
  - **Nama Lengkap**: Input teks wajib nama pengguna baru.
  - **Email Instansi**: Input alamat surat elektronik resmi pengguna.
  - **Pilih Role**: Pilihan opsi dropdown level otorisasi (`Administrator`, `Guru`, `Coach`, `Wali Murid`).
  - **Password Awal**: Kolom password (min. 8 karakter) dengan tombol toggle ikon mata untuk menampilkan/menyembunyikan sandi.
  - **Alert Banner**: Kotak pesan info biru mengenai prosedur pengiriman password awal ke email terdaftar dan kewajiban penggantian sandi pada login pertama demi alasan keamanan.
- **Action Buttons (Bawah)**:
  - Tombol `Batalkan` (kembali ke manajemen pengguna) dan `Simpan Akun` (mengirim data registrasi).

### Rancangan Integrasi Backend (Masa Depan)
- **Create New User Account**:
  - **Endpoint**: `/api/users`
  - **Method**: `POST`
  - **Request Body (JSON / Multipart Form-data)**:
    - `name` (String)
    - `email` (String)
    - `role` (String)
    - `password` (String)
    - `avatar` (File Binary, Optional)
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Akun baru atas nama Aditya Pratama berhasil didaftarkan"
    }
    ```

---

## 33. Fitur Ganti Password Baru (Change Password Form)

Formulir pengaturan administrasi keamanan untuk mereset dan mengganti kata sandi (password) dari suatu akun pengguna (contoh: Sarah Jenkins, M.Pd).

### Elemen UI & Kegunaan
- **Header & Title**:
  - Judul `Ganti Password Baru` dan keterangan pengguna target yang dituju (`Mengubah kata sandi untuk Sarah Jenkins, M.Pd`).
- **Input Fields Form**:
  - **Kata Sandi Baru**: Kolom input kata sandi baru dilengkapi dengan tombol toggle icon mata (show/hide).
  - **Konfirmasi Kata Sandi Baru**: Kolom konformasi pencocokan kata sandi dengan tombol toggle icon mata.
  - **Info Policy Banner**: Catatan kelayakan input sandi berupa teks `Minimal 8 karakter dengan kombinasi huruf dan angka`.
- **Action Buttons**:
  - Tombol `Batalkan` (berlatar belakang biru muda transparan) dan `Simpan Kata Sandi` (solid blue button).

### Rancangan Integrasi Backend (Masa Depan)
- **Change User Password**:
  - **Endpoint**: `/api/users/:user_id/password`
  - **Method**: `PUT`
  - **Request Body (JSON)**:
    ```json
    {
      "password": "newSecurePassword123"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Kata sandi untuk pengguna Sarah Jenkins berhasil diubah"
    }
    ```































