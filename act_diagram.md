# Prompts & Code untuk Activity Diagram Skripsi (Dashboard Monitoring)

Dokumen ini berisi kumpulan **Prompt Gambar AI (AI Image Generator)**, **Kode Diagram Engine (Mermaid & PlantUML)**, serta **Pseudocode** untuk 5 alur sistem utama pada project Next.js Dashboard Monitoring Sekolah SD Islam Baiturrachman (dengan database MySQL `root` / `""`).

Anda dapat menyalin bagian yang relevan sesuai dengan jenis AI/generator yang ingin Anda gunakan.

---

## 1. PROMPT UNTUK AI IMAGE GENERATOR (DALL-E 3 / Midjourney / Stable Diffusion)
*Prompt ini dirancang dengan deskripsi visual detail untuk menghasilkan gambar diagram aktivitas akademis berkualitas tinggi.*

### Alur 1: Proses Login & Setup Sesi Pengguna
> **Prompt:**
> A professional academic UML activity diagram showing a user login flow. The diagram consists of 4 clean vertical swimlanes (columns) labeled: "User", "Next.js Client", "Backend API Route", and "MySQL Database". The background is clean white. Diagram elements include rounded rectangles for actions, diamonds for decision points, and arrows showing the flow. The color palette is a professional academic blue, dark slate, and soft gray. The diagram starts with "User enters email and password" in the first swimlane, flows to "Submit form" in the Next.js Client swimlane, moves to "Validate credentials" in the API swimlane, queries the database, handles password verification, and ends with "Redirect to Dashboard" or "Show Error Message". Flat vector style, clean lines, high-resolution graphic, highly legible, corporate educational style.

### Alur 2: Pengelolaan Data Master & Pencatatan Log Aktivitas (Admin)
> **Prompt:**
> A clean and structured UML activity diagram illustrating the administrative data management process. The diagram is divided into 4 swimlanes: "Admin", "Next.js Frontend", "Backend API", and "MySQL Database". It starts with "Admin fills form and clicks save", flows through "Frontend client validations", "API authorization check", "Database write query", and "System logs action to activity_logs table". The design uses standard flowchart icons (start, process, database, end), solid black connection lines with arrowheads, and a minimalist color theme of dark blue, cyan, and light gray on a white background. No chaotic elements, clean academic layout.

### Alur 3: Pengisian & Perhitungan Nilai Siswa (Guru)
> **Prompt:**
> A detailed system activity diagram showing how teachers input and calculate student grades. The diagram has 4 clear swimlanes: "Teacher", "Next.js Client", "API Route (/api/grades)", and "MySQL Database". The flow shows the teacher inputting Assignment, UTS, and UAS scores. It shows the backend API calculating the average using the formula (2 * Assignment + UTS + UAS) / 4, checking if average is >= 75 to determine "Lulus" or "Remedial" status, and saving the output in the "grades" and "student_daily_grades" tables. Flat vector layout, academic thesis presentation style, clean boxes and arrows, professional gray-blue color palette.

### Alur 4: Pengisian Presensi Harian Siswa (Guru / Coach)
> **Prompt:**
> An academic-grade UML activity diagram showing the daily attendance input process. 4 vertical swimlanes: "Teacher / Coach", "Next.js Client", "API Route (/api/absensi)", and "MySQL Database". The flow starts with selecting class/extracurricular and date, entering attendance status (Hadir, Sakit, Izin, Alfa) for each student, sending a bulk POST request, performing a SQL "INSERT ON DUPLICATE KEY UPDATE" query to the "student_attendance" table, and updating the dashboard chart. Vector graphics, neat diagram blocks, sharp text labels, professional indigo and slate color scheme.

### Alur 5: Monitoring Dashboard & Filter Periode (Kepala Sekolah)
> **Prompt:**
> A software engineering UML activity diagram depicting a read-only dashboard monitoring flow for the Principal (Kepala Sekolah). The diagram has 4 swimlanes: "Principal", "Next.js Frontend Dashboard", "Backend Statistics API", and "MySQL Database". The flow starts with the Principal opening the page and selecting an academic period from a dropdown filter. The client sends a GET request to the statistics API, which executes SELECT queries on database tables (student_periods, student_attendance, grades). The statistics are processed, sent back as JSON, and rendered as charts and KPI cards on the UI. High quality vector diagram, clean lines, academic style, minimal aesthetics.

---

## 2. KODE DIAGRAM ENGINE (Copas untuk Generator Gambar Berbasis Kode)
*Salin kode di bawah ini ke tool seperti **Mermaid Live Editor** atau **PlantUML Text-to-Diagram**.*

### A. Format Mermaid (Rekomendasi untuk Markdown/GitHub)

#### Alur 1: Proses Login & Setup Sesi
```mermaid
flowchart TD
    subgraph User ["Pengguna"]
        Start1([Mulai]) --> Input1[Input Email & Password]
        ViewErr1[Lihat Pesan Error]
        Success1([Masuk Halaman Dashboard])
    end

    subgraph Client ["Frontend Next.js"]
        Input1 --> Submit1[Kirim POST /api/auth/login]
        Resp1{Validasi Respon?}
        Resp1 -- Error --> ShowErr1[Tampilkan Error] --> ViewErr1
        Resp1 -- Sukses --> SaveLocal1[Simpan User & Role ke LocalStorage]
        SaveLocal1 --> Redirect1[Redirect ke /dashboard] --> Success1
    end

    subgraph API ["Backend API Route"]
        Submit1 --> Verify1[Validasi Input Format]
        Verify1 --> Query1[SELECT dari users Berdasarkan Email]
        CheckPass1{Hash Password Cocok?}
        CheckPass1 -- Tidak --> RetErr1[Kirim Respon Gagal] --> Resp1
        CheckPass1 -- Ya --> RetSuccess1[Kirim Respon Sukses & Data User] --> Resp1
    end

    subgraph DB ["MySQL Database"]
        Query1 --> SelectDB1[(Tabel users)] --> CheckPass1
    end
```

#### Alur 2: Pengelolaan Data Master & Log Aktivitas (Admin)
```mermaid
flowchart TD
    subgraph Admin ["Aktor Admin"]
        Start2([Mulai]) --> FillForm2[Isi Form & Klik Simpan Data]
        Notify2[Terima Notifikasi Berhasil]
    end

    subgraph Client2 ["Frontend Next.js"]
        FillForm2 --> SendAPI2[Kirim POST/PUT ke /api/resource]
        Resp2{Respon Status?}
        Resp2 -- Sukses --> RefreshTable2[Muat Ulang Tabel] --> Notify2
        Resp2 -- Gagal --> ShowAlert2[Tampilkan Alert Gagal]
    end

    subgraph API2 ["Backend API Route"]
        SendAPI2 --> Auth2[Verifikasi Sesi Admin]
        Auth2 --> QueryInsert2[Eksekusi Query Insert/Update]
        QueryInsert2 --> Log2[Catat Aksi ke activity_logs]
        Log2 --> SuccessRes2[Kirim JSON Sukses] --> Resp2
    end

    subgraph DB2 ["MySQL Database"]
        QueryInsert2 --> DBWrite2[(Tabel Master: teachers/students)]
        Log2 --> DBLog2[(Tabel activity_logs)]
    end
```

#### Alur 3: Pengisian & Perhitungan Nilai Siswa (Guru)
```mermaid
flowchart TD
    subgraph Guru ["Aktor Guru"]
        Start3([Mulai]) --> SelectClass3[Pilih Kelas & Mapel]
        SelectClass3 --> InputGrades3[Input Nilai Tugas, UTS, UAS]
        InputGrades3 --> ClickSave3[Klik Simpan Nilai]
        ViewAvg3[Lihat Nilai Rata-rata Terhitung]
    end

    subgraph Client3 ["Frontend Next.js"]
        ClickSave3 --> POSTGrades3[POST ke /api/grades]
        Resp3{Respon API?}
        Resp3 -- Sukses --> RenderAvg3[Tampilkan Rata-rata & Status KKM] --> ViewAvg3
    end

    subgraph API3 ["Backend API Route"]
        POSTGrades3 --> CalcAvg3[Hitung Rata-rata: 2*Tugas + UTS + UAS / 4]
        CalcAvg3 --> CheckKKM3[Tentukan Status: >=75 Lulus, <75 Remedial]
        CheckKKM3 --> WriteDB3[Simpan ke Tabel grades & student_daily_grades]
        WriteDB3 --> JSONOut3[Kirim JSON Sukses] --> Resp3
    end

    subgraph DB3 ["MySQL Database"]
        WriteDB3 --> DBUpsert3[(Tabel grades & student_daily_grades)] --> JSONOut3
    end
```

#### Alur 4: Pengisian Presensi Harian Siswa (Guru / Coach)
```mermaid
flowchart TD
    subgraph User4 ["Guru / Coach"]
        Start4([Mulai]) --> Filter4[Pilih Kelas/Ekskul & Tanggal]
        Filter4 --> CheckMark4[Centang Status Kehadiran Siswa]
        CheckMark4 --> ClickSave4[Klik Simpan Absensi]
        NotifySuccess4[Melihat Grafik Kehadiran Ter-update]
    end

    subgraph Client4 ["Frontend Next.js"]
        ClickSave4 --> SendPOST4[POST ke /api/absensi]
        Resp4{Status API?}
        Resp4 -- Sukses --> RefreshChart4[Update Persentase Kehadiran UI] --> NotifySuccess4
    end

    subgraph API4 ["Backend API Route"]
        SendPOST4 --> LoopSiswa4[Looping Data Kehadiran]
        LoopSiswa4 --> DBInsert4[Simpan Kehadiran Harian]
        DBInsert4 --> RetOK4[Kirim JSON Sukses] --> Resp4
    end

    subgraph DB4 ["MySQL Database"]
        DBInsert4 --> DBUpsertAttendance4[(Tabel student_attendance)] --> RetOK4
    end
```

#### Alur 5: Monitoring Dashboard & Filter Periode (Kepala Sekolah)
```mermaid
flowchart TD
    subgraph Principal5 ["Kepala Sekolah"]
        Start5([Mulai]) --> OpenDash5[Buka Dashboard Monitoring]
        OpenDash5 --> FilterPeriod5[Pilih Tahun Ajaran / Semester di Filter]
        ViewDashboard5[Melihat Statistik & Grafik Terbaru]
    end

    subgraph Client5 ["Frontend Next.js Dashboard"]
        FilterPeriod5 --> RequestStats5[GET ke /api/dashboard/stats?period_id=...]
        Resp5{Data Diterima?}
        Resp5 -- Ya --> RenderStats5[Tampilkan KPI Cards & Chart Grafik Kehadiran] --> ViewDashboard5
    end

    subgraph API5 ["Backend API Route"]
        RequestStats5 --> QueryReport5[Query Rangkuman Statistik per Periode]
        QueryReport5 --> ResponseStats5[Kirim JSON Data Statistik] --> Resp5
    end

    subgraph DB5 ["MySQL Database"]
        QueryReport5 --> DBRead5[(Tabel student_periods, student_attendance, grades)] --> ResponseStats5
    end
```

---

### B. Format PlantUML (Alternatif untuk Visualisasi Akademis)

```plantuml
@startuml
skinparam style strictuml
skinparam BackgroundColor #ffffff
skinparam BoxPadding 10
skinparam ParticipantPadding 10

|User|
start
:Buka halaman portal sekolah;
:Input email dan password;
|Next.js Frontend|
:Validasi kelengkapan form;
:Kirim POST request ke /api/auth/login;
|Backend API|
:Terima request & bersihkan input;
|MySQL Database (root:password)|
:Cari data di tabel users;
|Backend API|
if (User ditemukan & password cocok?) then (Ya)
  :Generate data sesi & user info;
  :Kirim respon JSON success=true;
  |Next.js Frontend|
  :Simpan user metadata di localStorage;
  :Redirect ke /dashboard;
  |User|
  :Masuk halaman dashboard utama;
else (Tidak)
  |Backend API|
  :Kirim respon JSON success=false;
  |Next.js Frontend|
  :Tampilkan pesan error pada halaman login;
  |User|
  :Melihat kesalahan password/email;
endif
stop
@enduml
```

---

## 3. PSEUDOCODE SYSTEM FLOW (Untuk Deskripsi Bab IV Skripsi)
*Format ini berguna untuk mendeskripsikan secara logis jalannya sistem pada dokumen tertulis skripsi.*

```
ALUR_INPUT_NILAI_AKADEMIS:
--------------------------
1. BACA input Guru:
   - class_id (Kelas)
   - class_subject_id (Mata Pelajaran & Guru Pengampu)
   - period_id (Periode Akademik Aktif)
   - student_id (Siswa)
   - scores (tugas_harian[], nilai_uts, nilai_uas)

2. JIKA class_id, class_subject_id, ATAU student_id kosong MAKA:
      TAMPILKAN "Parameter tidak lengkap"
      HENTIKAN PROSES
   AKHIR_JIKA

3. HITUNG rata-rata nilai tugas harian:
      tugas_avg = SUM(tugas_harian[]) / COUNT(tugas_harian[])

4. HITUNG nilai akhir (average):
      nilai_akhir = (2 * tugas_avg + nilai_uts + nilai_uas) / 4

5. JIKA nilai_akhir >= 75.00 MAKA:
      status = "Lulus"
   MELAINKAN:
      status = "Remedial"
   AKHIR_JIKA

6. HUBUNGKAN ke Database MySQL (user: "root", password: "")
7. SIMPAN ke tabel `grades` (dengan student_period_id & class_period_id):
      INSERT INTO grades (student_period_id, class_period_id, daily_assignment, uts, uas, average, status)
      VALUES (student_period_id, class_period_id, tugas_avg, nilai_uts, nilai_uas, nilai_akhir, status)
      ON DUPLICATE KEY UPDATE daily_assignment=tugas_avg, uts=nilai_uts, uas=nilai_uas, average=nilai_akhir, status=status;

8. KIRIM RESPON JSON SUKSES ke Frontend untuk memperbarui UI.
```
