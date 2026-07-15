# Desain Database Normal — dashb_monitoring (Revisi Penuh)

> **Versi:** 2.0 (Fully Normalized)
> **Tanggal:** 2026-07-16
> **Jenis:** Full Database Redesign — 3NF Compliant

---

## 1. Prinsip Desain

### Aturan Dasar yang Diterapkan

1. **Tabel Master** = entitas nyata (guru, siswa, kelas, dll.) — **tidak boleh** menyimpan `period_id`
2. **Tabel Period** = junction antara entitas master dan periode akademik (contoh: `teacher_periods`)
3. **Tabel Asosiasi** = relasi antar entitas *dalam* periode yang sama — menggunakan ID dari tabel period, bukan ID master
4. **Tabel Transaksi** = data operasional harian (presensi, nilai) — cukup satu FK ke tabel period sebagai gantinya dua kolom (`entity_id` + `period_id`)

### Klasifikasi Tabel

| Kategori | Tabel |
|----------|-------|
| **Master** | `academic_periods`, `teachers`, `coaches`, `students`, `subjects`, `classes`, `extracurriculars`, `users` |
| **Period Junction** | `teacher_periods`, `coach_periods`, `student_periods`, `subject_periods`, `class_periods`, `extracurricular_periods` |
| **Asosiasi** | `class_subjects`, `extracurricular_coaches`, `extracurricular_students` |
| **Transaksi** | `teacher_attendance`, `coach_attendance`, `student_attendance`, `grades`, `student_daily_grades` |
| **Log** | `activity_logs` |

---

## 2. Skema Tabel (Desain Baru)

---

### GRUP A — Tabel Master

---

#### `academic_periods` — TIDAK BERUBAH

```sql
CREATE TABLE `academic_periods` (
  `id`            int(11)      NOT NULL AUTO_INCREMENT,
  `academic_year` varchar(20)  NOT NULL,           -- contoh: 2024/2025
  `semester`      varchar(10)  NOT NULL,            -- Ganjil / Genap
  `is_active`     tinyint(1)   NOT NULL DEFAULT 0,
  `created_at`    timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

#### `teachers` — DIUBAH: hapus `period_id`

```sql
CREATE TABLE `teachers` (
  `id`             int(11)      NOT NULL AUTO_INCREMENT,
  `name`           varchar(100) NOT NULL,
  `email`          varchar(100) NOT NULL,
  `nip`            varchar(50)  NOT NULL,
  `specialization` varchar(50)  NOT NULL,
  `status`         varchar(20)  NOT NULL,
  `created_at`     timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`     timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_teacher_email` (`email`),
  UNIQUE KEY `unique_teacher_nip`   (`nip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: period_id, unique_teacher_email_period (composite)
```

---

#### `coaches` — DIUBAH: hapus `period_id`

```sql
CREATE TABLE `coaches` (
  `id`             int(11)      NOT NULL AUTO_INCREMENT,
  `name`           varchar(100) NOT NULL,
  `email`          varchar(100) NOT NULL,
  `id_number`      varchar(50)  NOT NULL,
  `specialization` varchar(50)  NOT NULL,
  `status`         varchar(20)  NOT NULL,
  `created_at`     timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`     timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_coach_email`     (`email`),
  UNIQUE KEY `unique_coach_id_number` (`id_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: period_id
```

---

#### `students` — DIUBAH: hapus `period_id` dan `class_label`

```sql
CREATE TABLE `students` (
  `id`          int(11)     NOT NULL AUTO_INCREMENT,
  `name`        varchar(100) NOT NULL,
  `nisn`        varchar(20)  NOT NULL,
  `gender_text` varchar(20)  NOT NULL,
  `gender_code` char(1)      NOT NULL,
  `status`      varchar(20)  NOT NULL,
  `created_at`  timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`  timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_nisn` (`nisn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: period_id, class_label
-- Penempatan kelas per periode dikelola via student_periods.class_period_id
```

---

#### `subjects` — DIUBAH: hapus `period_id`

```sql
CREATE TABLE `subjects` (
  `id`          int(11)      NOT NULL AUTO_INCREMENT,
  `name`        varchar(100) NOT NULL,
  `code`        varchar(50)  NOT NULL,
  `description` text         DEFAULT NULL,
  `created_at`  timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`  timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_subject_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: period_id
```

---

#### `classes` — DIUBAH: hapus `academic_year`, `semester`, `homeroom_teacher_id`, `period_id`

```sql
CREATE TABLE `classes` (
  `id`         int(11)     NOT NULL AUTO_INCREMENT,
  `class_name` varchar(50) NOT NULL,              -- contoh: 1A, 2B
  `capacity`   int(11)     NOT NULL DEFAULT 30,
  `created_at` timestamp   NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp   NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_name` (`class_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: academic_year, semester, homeroom_teacher_id, period_id
-- academic_year & semester sudah ada di academic_periods
-- homeroom_teacher_id dipindah ke class_periods
```

---

#### `extracurriculars` — DIUBAH: hapus `period_id` dan `coach_id`

```sql
CREATE TABLE `extracurriculars` (
  `id`         int(11)      NOT NULL AUTO_INCREMENT,
  `name`       varchar(100) NOT NULL,
  `category`   varchar(50)  NOT NULL,
  `schedule`   varchar(100) NOT NULL,
  `location`   varchar(100) NOT NULL,
  `contact`    varchar(100) NOT NULL,
  `created_at` timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: period_id, coach_id
-- coach per periode dikelola via extracurricular_coaches
-- ekskul per periode dikelola via extracurricular_periods
```

---

#### `users` — TIDAK BERUBAH

```sql
CREATE TABLE `users` (
  `id`            int(11)      NOT NULL AUTO_INCREMENT,
  `email`         varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name`          varchar(100) NOT NULL,
  `role`          varchar(50)  NOT NULL,
  `created_at`    timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at`    timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### GRUP B — Tabel Period Junction

---

#### `teacher_periods` — BARU

```sql
CREATE TABLE `teacher_periods` (
  `id`         int(11)    NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11)    NOT NULL,
  `period_id`  int(11)    NOT NULL,
  `is_active`  tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp  NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_teacher_period` (`teacher_id`, `period_id`),
  KEY `fk_tp_teacher` (`teacher_id`),
  KEY `fk_tp_period`  (`period_id`),
  CONSTRAINT `fk_tp_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tp_period`  FOREIGN KEY (`period_id`)  REFERENCES `academic_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

#### `coach_periods` — BARU

```sql
CREATE TABLE `coach_periods` (
  `id`         int(11)    NOT NULL AUTO_INCREMENT,
  `coach_id`   int(11)    NOT NULL,
  `period_id`  int(11)    NOT NULL,
  `is_active`  tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp  NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_coach_period` (`coach_id`, `period_id`),
  KEY `fk_cp_coach`  (`coach_id`),
  KEY `fk_cp_period` (`period_id`),
  CONSTRAINT `fk_cp_coach`  FOREIGN KEY (`coach_id`)  REFERENCES `coaches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cp_period` FOREIGN KEY (`period_id`) REFERENCES `academic_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

#### `student_periods` — BARU

```sql
CREATE TABLE `student_periods` (
  `id`              int(11)    NOT NULL AUTO_INCREMENT,
  `student_id`      int(11)    NOT NULL,
  `period_id`       int(11)    NOT NULL,
  `class_period_id` int(11)    DEFAULT NULL,        -- penempatan kelas siswa di periode ini (nullable, bisa belum ditentukan)
  `is_active`       tinyint(1) NOT NULL DEFAULT 1,
  `created_at`      timestamp  NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_period` (`student_id`, `period_id`),
  KEY `fk_sp_student`      (`student_id`),
  KEY `fk_sp_period`       (`period_id`),
  KEY `fk_sp_class_period` (`class_period_id`),
  CONSTRAINT `fk_sp_student`      FOREIGN KEY (`student_id`)      REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sp_period`       FOREIGN KEY (`period_id`)       REFERENCES `academic_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sp_class_period` FOREIGN KEY (`class_period_id`) REFERENCES `class_periods` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- class_period_id menggantikan class_label: menentukan kelas siswa pada periode tertentu
```

---

#### `subject_periods` — BARU

```sql
CREATE TABLE `subject_periods` (
  `id`         int(11)    NOT NULL AUTO_INCREMENT,
  `subject_id` int(11)    NOT NULL,
  `period_id`  int(11)    NOT NULL,
  `is_active`  tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp  NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_subject_period` (`subject_id`, `period_id`),
  KEY `fk_subp_subject` (`subject_id`),
  KEY `fk_subp_period`  (`period_id`),
  CONSTRAINT `fk_subp_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_subp_period`  FOREIGN KEY (`period_id`)  REFERENCES `academic_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

#### `class_periods` — BARU

```sql
CREATE TABLE `class_periods` (
  `id`                    int(11)    NOT NULL AUTO_INCREMENT,
  `class_id`              int(11)    NOT NULL,
  `period_id`             int(11)    NOT NULL,
  `homeroom_teacher_id`   int(11)    DEFAULT NULL,    -- FK ke teacher_periods.id (guru wali kelas di periode ini)
  `created_at`            timestamp  NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_class_period` (`class_id`, `period_id`),
  KEY `fk_clp_class`            (`class_id`),
  KEY `fk_clp_period`           (`period_id`),
  KEY `fk_clp_homeroom_teacher` (`homeroom_teacher_id`),
  CONSTRAINT `fk_clp_class`            FOREIGN KEY (`class_id`)            REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_clp_period`           FOREIGN KEY (`period_id`)           REFERENCES `academic_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_clp_homeroom_teacher` FOREIGN KEY (`homeroom_teacher_id`) REFERENCES `teacher_periods` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- homeroom_teacher_id merujuk ke teacher_periods.id (bukan teachers.id)
-- karena guru wali kelas bersifat per-periode
```

---

#### `extracurricular_periods` — BARU

```sql
CREATE TABLE `extracurricular_periods` (
  `id`                 int(11)    NOT NULL AUTO_INCREMENT,
  `extracurricular_id` int(11)    NOT NULL,
  `period_id`          int(11)    NOT NULL,
  `is_active`          tinyint(1) NOT NULL DEFAULT 1,
  `created_at`         timestamp  NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ekskul_period` (`extracurricular_id`, `period_id`),
  KEY `fk_ep_ekskul`  (`extracurricular_id`),
  KEY `fk_ep_period`  (`period_id`),
  CONSTRAINT `fk_ep_ekskul`  FOREIGN KEY (`extracurricular_id`) REFERENCES `extracurriculars` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ep_period`  FOREIGN KEY (`period_id`)          REFERENCES `academic_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### GRUP C — Tabel Asosiasi

---

#### `class_subjects` — DIUBAH: semua FK diganti ke tabel period

```sql
CREATE TABLE `class_subjects` (
  `class_period_id`   int(11)     NOT NULL,    -- FK ke class_periods.id   (bukan classes.id)
  `subject_period_id` int(11)     NOT NULL,    -- FK ke subject_periods.id  (bukan subjects.id)
  `teacher_period_id` int(11)     NOT NULL,    -- FK ke teacher_periods.id  (bukan teachers.id)
  `schedule_day`      varchar(50) DEFAULT NULL,
  `start_time`        varchar(20) DEFAULT NULL,
  `end_time`          varchar(20) DEFAULT NULL,
  `created_at`        timestamp   NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`class_period_id`, `subject_period_id`, `teacher_period_id`),
  KEY `fk_cs_class_period`   (`class_period_id`),
  KEY `fk_cs_subject_period` (`subject_period_id`),
  KEY `fk_cs_teacher_period` (`teacher_period_id`),
  CONSTRAINT `fk_cs_class_period`   FOREIGN KEY (`class_period_id`)   REFERENCES `class_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cs_subject_period` FOREIGN KEY (`subject_period_id`) REFERENCES `subject_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cs_teacher_period` FOREIGN KEY (`teacher_period_id`) REFERENCES `teacher_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

#### `extracurricular_coaches` — DIUBAH dari tabel lama (coach_id di extracurriculars)

```sql
CREATE TABLE `extracurricular_coaches` (
  `extracurricular_period_id` int(11)   NOT NULL,    -- FK ke extracurricular_periods.id
  `coach_period_id`           int(11)   NOT NULL,    -- FK ke coach_periods.id
  `created_at`                timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`extracurricular_period_id`, `coach_period_id`),
  KEY `fk_ec_ekskul_period` (`extracurricular_period_id`),
  KEY `fk_ec_coach_period`  (`coach_period_id`),
  CONSTRAINT `fk_ec_ekskul_period` FOREIGN KEY (`extracurricular_period_id`) REFERENCES `extracurricular_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ec_coach_period`  FOREIGN KEY (`coach_period_id`)           REFERENCES `coach_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

#### `extracurricular_students` — DIUBAH: FK diganti ke tabel period

```sql
CREATE TABLE `extracurricular_students` (
  `extracurricular_period_id` int(11)     NOT NULL,    -- FK ke extracurricular_periods.id
  `student_period_id`         int(11)     NOT NULL,    -- FK ke student_periods.id
  `status`                    varchar(20) NOT NULL DEFAULT 'Aktif',
  `created_at`                timestamp   NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`extracurricular_period_id`, `student_period_id`),
  KEY `fk_es_ekskul_period`   (`extracurricular_period_id`),
  KEY `fk_es_student_period`  (`student_period_id`),
  CONSTRAINT `fk_es_ekskul_period`  FOREIGN KEY (`extracurricular_period_id`) REFERENCES `extracurricular_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_es_student_period` FOREIGN KEY (`student_period_id`)         REFERENCES `student_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### GRUP D — Tabel Transaksi

---

#### `teacher_attendance` — DIUBAH: ganti `teacher_id` + `period_id` menjadi `teacher_period_id`

```sql
CREATE TABLE `teacher_attendance` (
  `id`                int(11)     NOT NULL AUTO_INCREMENT,
  `teacher_period_id` int(11)     NOT NULL,    -- FK ke teacher_periods.id (menggantikan teacher_id + period_id)
  `check_in_time`     varchar(20) DEFAULT NULL,
  `check_out_time`    varchar(20) DEFAULT NULL,
  `status`            varchar(50) NOT NULL,
  `date`              date        NOT NULL,
  `created_at`        timestamp   NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_teacher_attendance_date` (`teacher_period_id`, `date`),
  KEY `fk_ta_teacher_period` (`teacher_period_id`),
  CONSTRAINT `fk_ta_teacher_period` FOREIGN KEY (`teacher_period_id`) REFERENCES `teacher_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: teacher_id, period_id (digabung jadi teacher_period_id)
```

---

#### `coach_attendance` — DIUBAH: ganti `coach_id` + `period_id` menjadi `coach_period_id`

```sql
CREATE TABLE `coach_attendance` (
  `id`               int(11)     NOT NULL AUTO_INCREMENT,
  `coach_period_id`  int(11)     NOT NULL,    -- FK ke coach_periods.id (menggantikan coach_id + period_id)
  `check_in_time`    varchar(20) DEFAULT NULL,
  `check_out_time`   varchar(20) DEFAULT NULL,
  `status`           varchar(50) NOT NULL,
  `date`             date        NOT NULL,
  `created_at`       timestamp   NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_coach_attendance_date` (`coach_period_id`, `date`),
  KEY `fk_ca_coach_period` (`coach_period_id`),
  CONSTRAINT `fk_ca_coach_period` FOREIGN KEY (`coach_period_id`) REFERENCES `coach_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: coach_id, period_id (digabung jadi coach_period_id)
```

---

#### `student_attendance` — DIUBAH: ganti `student_id` + `period_id` menjadi `student_period_id`

```sql
CREATE TABLE `student_attendance` (
  `id`                int(11)     NOT NULL AUTO_INCREMENT,
  `student_period_id` int(11)     NOT NULL,    -- FK ke student_periods.id
  `status`            varchar(50) NOT NULL,
  `date`              date        NOT NULL,
  `created_at`        timestamp   NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_attendance_date` (`student_period_id`, `date`),
  KEY `fk_sa_student_period` (`student_period_id`),
  CONSTRAINT `fk_sa_student_period` FOREIGN KEY (`student_period_id`) REFERENCES `student_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: student_id, period_id (digabung jadi student_period_id)
```

---

#### `grades` — DIUBAH: `student_id` -> `student_period_id`, `class_id` -> `class_period_id`, hapus `period_id`

```sql
CREATE TABLE `grades` (
  `id`                 int(11)        NOT NULL AUTO_INCREMENT,
  `student_period_id`  int(11)        NOT NULL,    -- FK ke student_periods.id
  `class_period_id`    int(11)        NOT NULL,    -- FK ke class_periods.id
  `daily_assignment`   decimal(5,2)   DEFAULT 0.00,
  `daily_status`       varchar(50)    DEFAULT NULL,
  `ekskul`             decimal(5,2)   DEFAULT 0.00,
  `uts`                decimal(5,2)   DEFAULT 0.00,
  `uas`                decimal(5,2)   DEFAULT 0.00,
  `average`            decimal(5,2)   DEFAULT 0.00,
  `status`             varchar(20)    NOT NULL,
  `created_at`         timestamp      NOT NULL DEFAULT current_timestamp(),
  `updated_at`         timestamp      NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_grades` (`student_period_id`, `class_period_id`),
  KEY `fk_gr_student_period` (`student_period_id`),
  KEY `fk_gr_class_period`   (`class_period_id`),
  CONSTRAINT `fk_gr_student_period` FOREIGN KEY (`student_period_id`) REFERENCES `student_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_gr_class_period`   FOREIGN KEY (`class_period_id`)   REFERENCES `class_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: student_id, class_id, period_id
```

---

#### `student_daily_grades` — DIUBAH: `student_id` -> `student_period_id`, `class_id` -> `class_period_id`, hapus `period_id`

```sql
CREATE TABLE `student_daily_grades` (
  `id`                int(11)       NOT NULL AUTO_INCREMENT,
  `student_period_id` int(11)       NOT NULL,    -- FK ke student_periods.id
  `class_period_id`   int(11)       NOT NULL,    -- FK ke class_periods.id
  `assignment_name`   varchar(100)  NOT NULL,
  `score`             decimal(5,2)  DEFAULT 0.00,
  `created_at`        timestamp     NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_assignment` (`student_period_id`, `class_period_id`, `assignment_name`),
  KEY `fk_sdg_student_period` (`student_period_id`),
  KEY `fk_sdg_class_period`   (`class_period_id`),
  CONSTRAINT `fk_sdg_student_period` FOREIGN KEY (`student_period_id`) REFERENCES `student_periods` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sdg_class_period`   FOREIGN KEY (`class_period_id`)   REFERENCES `class_periods` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Dihapus: student_id, class_id, period_id
```

---

### GRUP E — Tabel Log

---

#### `activity_logs` — TIDAK BERUBAH

```sql
CREATE TABLE `activity_logs` (
  `id`         int(11)      NOT NULL AUTO_INCREMENT,
  `action`     varchar(100) NOT NULL,
  `target`     varchar(100) NOT NULL,
  `user_id`    int(11)      DEFAULT NULL,
  `details`    text         DEFAULT NULL,
  `created_at` timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_al_user` (`user_id`),
  CONSTRAINT `fk_al_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 3. Peta Perubahan Tabel

| Tabel Lama | Status | Keterangan |
|---|---|---|
| `academic_periods` | TETAP | Tidak ada perubahan |
| `teachers` | UBAH | Hapus `period_id` |
| `coaches` | UBAH | Hapus `period_id` |
| `students` | UBAH | Hapus `period_id`, `class_label` |
| `subjects` | UBAH | Hapus `period_id` |
| `classes` | UBAH | Hapus `academic_year`, `semester`, `homeroom_teacher_id`, `period_id` |
| `extracurriculars` | UBAH | Hapus `period_id`, `coach_id` |
| `class_subjects` | UBAH | Semua FK diganti ke tabel period |
| `extracurricular_students` | UBAH | FK diganti ke `student_period_id`, `extracurricular_period_id` |
| `teacher_attendance` | UBAH | `teacher_id` + `period_id` → `teacher_period_id` |
| `coach_attendance` | UBAH | `coach_id` + `period_id` → `coach_period_id` |
| `student_attendance` | UBAH | `student_id` + `period_id` → `student_period_id` |
| `grades` | UBAH | `student_id` → `student_period_id`, `class_id` → `class_period_id`, hapus `period_id` |
| `student_daily_grades` | UBAH | Sama seperti grades |
| `users` | TETAP | Tidak ada perubahan |
| `activity_logs` | TETAP | Tidak ada perubahan |
| `teacher_periods` | BARU | Junction guru-periode |
| `coach_periods` | BARU | Junction coach-periode |
| `student_periods` | BARU | Junction siswa-periode, termasuk penempatan kelas |
| `subject_periods` | BARU | Junction mapel-periode |
| `class_periods` | BARU | Junction kelas-periode, menyimpan wali kelas |
| `extracurricular_periods` | BARU | Junction ekskul-periode |
| `extracurricular_coaches` | BARU | Relasi coach aktif di ekskul per periode |

---

## 4. ERD (Entity Relationship Diagram)

```
                        academic_periods
                              |
          ┌───────────────────┼───────────────────────┐
          |                   |                        |
    teacher_periods      coach_periods          student_periods ─── students
    (teacher_id,          (coach_id,            (student_id,
     period_id,            period_id,            period_id,
     is_active)            is_active)            class_period_id,
          |                   |                  is_active)
          |                   |                       |
     class_periods ───── class_subjects        subject_periods ─── subjects
     (class_id,          (class_period_id,      (subject_id,
      period_id,          subject_period_id,     period_id,
      homeroom_           teacher_period_id)     is_active)
      teacher_id)
          |
        classes                                 extracurricular_periods ─── extracurriculars
                                                (extracurricular_id,
                                                 period_id, is_active)
                                                         |
                                              ┌──────────┴──────────┐
                                    extracurricular_coaches   extracurricular_students
                                    (extracurricular_period_id, (extracurricular_period_id,
                                     coach_period_id)            student_period_id)

Tabel Transaksi (menggunakan period ID, bukan composite):
  teacher_attendance  → teacher_period_id
  coach_attendance    → coach_period_id
  student_attendance  → student_period_id
  grades              → student_period_id + class_period_id
  student_daily_grades → student_period_id + class_period_id
```

---

## 5. Keuntungan Desain Ini

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Data guru di 2 periode | 2 baris terpisah (duplikat) | 1 baris guru + 2 baris di teacher_periods |
| Wali kelas per periode | Tidak jelas, teacher_id di classes | Tersimpan di class_periods.homeroom_teacher_id |
| Filter presensi per periode | JOIN 2 kolom (teacher_id AND period_id) | JOIN 1 FK (teacher_period_id) |
| Salin data antar periode | Copy semua baris guru | INSERT ke teacher_periods saja |
| Integritas data | Guru bisa punya ID berbeda per periode | Guru selalu 1 ID, referensi konsisten |
| Query kompleksitas | Tinggi (banyak AND period_id) | Lebih bersih via JOIN tabel period |

---

*Dokumen ini adalah desain target — belum ada perubahan yang diterapkan ke database.*
