# Kode PlantUML Lengkap (Activity Diagram Skripsi)

Dokumen ini berisi kode **PlantUML** lengkap untuk 5 diagram aktivitas utama sistem monitoring sekolah SD Islam Baiturrachman. Anda dapat langsung menyalin kode di bawah ini dan menempelkannya ke compiler PlantUML pilihan Anda (misalnya [PlantUML Online Server](http://www.plantuml.com/plantuml/) atau ekstensi PlantUML di VS Code) untuk menghasilkan gambar diagram berkualitas akademik.

---

## 1. Alur Autentikasi Pengguna (Login & Sesi)

```plantuml
@startuml
skinparam style strictuml
skinparam BackgroundColor #ffffff
skinparam ActivityBackgroundColor #f0f4f8
skinparam ActivityBorderColor #2563eb
skinparam ActivityFontColor #1e293b
skinparam ArrowColor #475569

|Pengguna|
start
:Membuka Halaman Login;
:Memasukkan Email & Kata Sandi;
:Klik Tombol "Masuk Sekarang";

|Frontend Next.js|
:Validasi input form tidak kosong;
:Kirim POST request ke /api/auth/login;

|Backend API|
:Terima request body (email, password);
:Validasi format input;

|MySQL Database|
:Query SELECT * FROM users WHERE email = ?;

|Backend API|
if (Email ditemukan?) then (Ya)
  :Verifikasi kata sandi dengan bcrypt.compare();
  if (Kata sandi valid?) then (Ya)
    :Kirim response JSON success=true dan data user;
    |Frontend Next.js|
    :Simpan user data dan role ke localStorage;
    :Redirect ke halaman /dashboard;
    |Pengguna|
    :Masuk ke halaman utama Dashboard;
    stop
  else (Tidak)
    :Kirim response JSON success=false (Kata sandi salah);
  endif
else (Tidak)
  :Kirim response JSON success=false (User tidak terdaftar);
endif

|Frontend Next.js|
:Tampilkan pesan kesalahan di UI;

|Pengguna|
:Melihat pesan error login;
stop
@enduml
```

---

## 2. Pengelolaan Data Master (CRUD) & Log Aktivitas (Admin)

```plantuml
@startuml
skinparam style strictuml
skinparam BackgroundColor #ffffff
skinparam ActivityBackgroundColor #fdfefe
skinparam ActivityBorderColor #0891b2
skinparam ArrowColor #475569

|Admin|
start
:Pilih menu data master (Guru/Siswa/Kelas);
:Isi data formulir tambah/edit;
:Klik tombol "Simpan";

|Frontend Next.js|
:Validasi input client-side;
:Kirim request POST/PUT ke /api/[master_route];

|Backend API|
:Verifikasi sesi & otorisasi role Admin;
:Validasi duplikasi NIP/NISN;
if (Data valid?) then (Ya)
  :Mulai transaksi database;
  |MySQL Database|
  :Eksekusi INSERT/UPDATE ke tabel master;
  |Backend API|
  :Format deskripsi aktivitas log;
  |MySQL Database|
  :Eksekusi INSERT ke tabel activity_logs;
  |Backend API|
  :Commit transaksi database;
  :Kirim response JSON success=true;
  |Frontend Next.js|
  :Tampilkan notifikasi sukses;
  :Muat ulang tabel data di UI;
  |Admin|
  :Melihat data terbaru di tabel;
  stop
else (Tidak)
  |Backend API|
  :Kirim response JSON success=false & pesan gagal;
  |Frontend Next.js|
  :Tampilkan notifikasi error;
  |Admin|
  :Membaca pesan kesalahan;
  stop
endif
@enduml
```

---

## 3. Pengisian & Perhitungan Nilai Siswa (Guru)

```plantuml
@startuml
skinparam style strictuml
skinparam BackgroundColor #ffffff
skinparam ActivityBackgroundColor #fefefe
skinparam ActivityBorderColor #16a34a
skinparam ArrowColor #475569

|Guru|
start
:Pilih Kelas dan Mata Pelajaran;
:Input nilai Tugas Harian, UTS, dan UAS siswa;
:Klik tombol "Simpan Nilai";

|Frontend Next.js|
:Package data nilai siswa ke bentuk array;
:Kirim POST request ke /api/grades;

|Backend API|
:Terima data payload kelas, mapel, siswa, dan nilai;
:Mencari student_period_id siswa untuk periode aktif;
:Hitung rata-rata nilai tugas harian (tugas_avg);
:Hitung nilai akhir:\nAverage = (2 * tugas_avg + UTS + UAS) / 4;
if (Nilai Akhir >= 75?) then (Ya)
  :Set status = "Lulus";
else (Tidak)
  :Set status = "Remedial";
endif

|MySQL Database|
:Simpan ke tabel grades & student_daily_grades\n(INSERT ON DUPLICATE KEY UPDATE);

|Backend API|
:Kirim response JSON success=true;

|Frontend Next.js|
:Update state nilai siswa di tabel;
:Tampilkan notifikasi nilai berhasil diperbarui;

|Guru|
:Melihat nilai rata-rata & status kelulusan siswa terbaru;
stop
@enduml
```

---

## 4. Pengisian Presensi Harian Siswa (Guru / Coach)

```plantuml
@startuml
skinparam style strictuml
skinparam BackgroundColor #ffffff
skinparam ActivityBackgroundColor #fffbeb
skinparam ActivityBorderColor #d97706
skinparam ArrowColor #475569

|Guru / Coach|
start
:Pilih Kelas/Ekskul & Tanggal Kehadiran;
:Buka form absensi harian;
:Pilih status hadir/sakit/izin/alfa untuk masing-masing siswa;
:Klik tombol "Simpan Kehadiran";

|Frontend Next.js|
:Bentuk array data kehadiran siswa;
:Kirim POST request ke /api/absensi/siswa;

|Backend API|
:Iterasi data kehadiran siswa;
|MySQL Database|
:Eksekusi query simpan:\nINSERT INTO student_attendance\nON DUPLICATE KEY UPDATE;
|Backend API|
:Hitung ulang persentase kehadiran harian kelas/ekskul;
:Kirim response JSON success=true beserta data ter-update;

|Frontend Next.js|
:Refresh chart grafik presensi dashboard harian;
:Tampilkan notifikasi absensi berhasil diinput;

|Guru / Coach|
:Melihat ringkasan persentase presensi terbaru;
stop
@enduml
```

---

## 5. Monitoring Dashboard & Filter Periode (Kepala Sekolah)

```plantuml
@startuml
skinparam style strictuml
skinparam BackgroundColor #ffffff
skinparam ActivityBackgroundColor #fdf2f8
skinparam ActivityBorderColor #db2777
skinparam ArrowColor #475569

|Kepala Sekolah|
start
:Masuk ke halaman utama Dashboard;
:Memilih Periode Akademik (Tahun Ajaran/Semester) pada filter dropdown;

|Frontend Next.js|
:Ubah state active_period_id;
:Kirim GET request ke /api/dashboard/stats?period_id=...;

|Backend API|
:Terima query parameter period_id;
:Mulai pembacaan data statistik periode terpilih;

|MySQL Database|
:SELECT total siswa, guru, kelas aktif dari tabel periods;
:SELECT persentase kehadiran hari ini dari student_attendance;
:SELECT jumlah siswa di bawah KKM (<75) dari tabel grades;

|Backend API|
:Kalkulasi ringkasan statistik (dashboard stats);
:Kirim response JSON success=true dan payload data statistik;

|Frontend Next.js|
:Update UI widget (KPI Cards);
:Render ulang grafik tren mingguan dan diagram persentase kelulusan;

|Kepala Sekolah|
:Memantau ringkasan grafik operasional sekolah secara real-time;
stop
@enduml
```
