const mysql = require("mysql2/promise");

async function seed() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dashb_monitoring",
  });

  console.log("Seeding extracurricular memberships...");

  // 1. Get all students
  const [students] = await db.query("SELECT id FROM students");
  if (students.length === 0) {
    console.log("No students found. Run student importer first.");
    await db.end();
    return;
  }

  // 2. Get all extracurriculars
  const [ekskuls] = await db.query("SELECT id FROM extracurriculars");
  if (ekskuls.length === 0) {
    // Insert some default extracurriculars if empty
    console.log("No extracurriculars found. Inserting default ones...");
    
    // Get coach IDs
    const [coaches] = await db.query("SELECT id FROM coaches LIMIT 5");
    const c1 = coaches[0]?.id || null;
    const c2 = coaches[1]?.id || null;
    const c3 = coaches[2]?.id || null;
    
    await db.query(`
      INSERT INTO extracurriculars (name, category, coach_id, schedule, location, contact) VALUES
      ('Robotik', 'Sains & Teknologi', ?, 'Selasa & Kamis, 15:30', 'Lab Komputer & Robotik', '0812-3456-7890'),
      ('Sepak Bola', 'Olahraga', ?, 'Senin & Rabu, 16:00', 'Lapangan Utama', '0812-3456-7891'),
      ('Basket', 'Olahraga', ?, 'Selasa & Jumat, 16:00', 'Lapangan Basket', '0812-3456-7892'),
      ('Seni Lukis', 'Seni', ?, 'Kamis, 14:00', 'Studio Seni', '0812-3456-7893'),
      ('Tari Tradisional', 'Seni', ?, 'Jumat, 14:00', 'Aula Utama', '0812-3456-7894')
    `, [c1, c2, c3, c1, c2]);

    console.log("Default extracurriculars inserted.");
  }

  // Reload ekskuls
  const [activeEkskuls] = await db.query("SELECT id FROM extracurriculars");

  // Empty existing memberships
  await db.query("DELETE FROM extracurricular_students");

  // Insert random memberships (15-20 students per extracurricular)
  const statuses = ["Aktif", "Izin", "Nonaktif"];
  for (const ekskul of activeEkskuls) {
    // Shuffle students
    const shuffled = [...students].sort(() => 0.5 - Math.random());
    const memberCount = Math.floor(Math.random() * 6) + 15; // 15 to 20 members
    const selected = shuffled.slice(0, memberCount);

    for (const student of selected) {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      await db.query(
        `INSERT IGNORE INTO extracurricular_students (extracurricular_id, student_id, status)
         VALUES (?, ?, ?)`,
        [ekskul.id, student.id, randomStatus]
      );
    }
    console.log(`Seeded ${selected.length} students to extracurricular ID: ${ekskul.id}`);
  }

  console.log("Extracurricular memberships seeding completed!");
  await db.end();
}

seed().catch(console.error);
