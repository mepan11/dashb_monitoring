import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const classSubjectId = url.searchParams.get("class_subject_id");
    const subjectId = url.searchParams.get("subject_id");

    if (subjectId) {
      // Get global master tasks for the subject
      const [rows]: any = await db.query(
        "SELECT id, subject_id AS subjectId, name, description, created_at AS createdAt FROM task_names WHERE subject_id = ? ORDER BY id ASC",
        [subjectId]
      );
      return NextResponse.json({ success: true, data: rows });
    }

    if (!classSubjectId) {
      return NextResponse.json(
        { success: false, message: "class_subject_id atau subject_id wajib disertakan" },
        { status: 400 }
      );
    }

    // Get assignments assigned to this specific class subject
    const [rows]: any = await db.query(
      `SELECT sa.id AS id, t.name AS name, t.description AS description, sa.class_subject_id AS classSubjectId
       FROM subject_assignments sa
       JOIN task_names t ON sa.task_name_id = t.id
       WHERE sa.class_subject_id = ?
       ORDER BY sa.id ASC`,
      [classSubjectId]
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Assignments GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { subjectId, name, description } = await request.json();

    if (!subjectId || !name) {
      return NextResponse.json(
        { success: false, message: "subjectId dan nama tugas wajib diisi" },
        { status: 400 }
      );
    }

    // 1. Insert into global task_names
    const [result]: any = await db.query(
      "INSERT INTO task_names (subject_id, name, description) VALUES (?, ?, ?)",
      [subjectId, name, description || null]
    );
    const taskNameId = result.insertId;

    // 2. Auto-sync to subject_assignments for all class_subjects distributing this subject
    const [classSubjects]: any = await db.query(
      `SELECT cs.id AS classSubjectId
       FROM class_subjects cs
       JOIN subject_periods sp ON cs.subject_period_id = sp.id
       WHERE sp.subject_id = ?`,
      [subjectId]
    );

    for (const cs of classSubjects) {
      await db.query(
        "INSERT IGNORE INTO subject_assignments (class_subject_id, task_name_id) VALUES (?, ?)",
        [cs.classSubjectId, taskNameId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tugas master berhasil ditambahkan dan disinkronkan ke seluruh kelas",
      id: taskNameId,
    });
  } catch (error: any) {
    console.error("Assignments POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
