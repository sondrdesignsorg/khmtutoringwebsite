import { sql } from '@vercel/postgres';
import { ensureStaffSchema } from './db';
import { toStudent, type DbStudentRow } from './student-db';
import type { Student, StudentDraft } from './types';

/**
 * Student roster used to email worksheets from the staff library.
 * Mutations are admin-gated by the calling route handlers.
 */

/** True when a create/update hit the students email unique index. */
export function isDuplicateEmailError(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  if (code === '23505') return true;
  return err instanceof Error && /students_email_unique|students_email/i.test(err.message);
}

export async function listStudents(): Promise<Student[]> {
  await ensureStaffSchema();
  const { rows } = await sql<DbStudentRow>`
    SELECT * FROM students ORDER BY name ASC
  `;
  return rows.map(toStudent);
}

export async function getStudent(id: string): Promise<Student | null> {
  await ensureStaffSchema();
  const { rows } = await sql<DbStudentRow>`
    SELECT * FROM students WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ? toStudent(rows[0]) : null;
}

function normalize(draft: Partial<StudentDraft>) {
  return {
    name: draft.name?.trim() ?? '',
    email: draft.email?.trim().toLowerCase() ?? '',
    grade: draft.grade?.trim() ?? '',
    parentName: draft.parentName?.trim() ?? '',
    phone: draft.phone?.trim() ?? '',
    notes: draft.notes?.trim() ?? '',
  };
}

export async function createStudent(draft: StudentDraft): Promise<Student> {
  await ensureStaffSchema();
  const id = crypto.randomUUID();
  const s = normalize(draft);
  const { rows } = await sql<DbStudentRow>`
    INSERT INTO students (id, name, email, grade, parent_name, phone, notes)
    VALUES (${id}, ${s.name}, ${s.email}, ${s.grade}, ${s.parentName}, ${s.phone}, ${s.notes})
    RETURNING *
  `;
  return toStudent(rows[0]);
}

export async function updateStudent(id: string, patch: Partial<StudentDraft>): Promise<Student | null> {
  await ensureStaffSchema();
  const current = await getStudent(id);
  if (!current) return null;

  const merged = normalize({ ...current, ...patch });
  const { rows } = await sql<DbStudentRow>`
    UPDATE students SET
      name = ${merged.name}, email = ${merged.email}, grade = ${merged.grade},
      parent_name = ${merged.parentName}, phone = ${merged.phone}, notes = ${merged.notes},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return toStudent(rows[0]);
}

export async function deleteStudent(id: string): Promise<boolean> {
  await ensureStaffSchema();
  const { rowCount } = await sql`DELETE FROM students WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}
