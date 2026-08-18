import { sql } from '@vercel/postgres';

export interface GroupSatInquiryInput {
  parentName: string;
  studentName: string;
  email: string;
  phone: string | null;
  grade: string | null;
  cohort: string;
  satDate: string | null;
  currentScore: string | null;
  goals: string | null;
  notes: string | null;
}

let schemaReady: Promise<void> | null = null;

function ensureSchema() {
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS group_sat_inquiries (
        id text PRIMARY KEY,
        parent_name text NOT NULL,
        student_name text NOT NULL,
        email text NOT NULL,
        phone text,
        grade text,
        cohort text NOT NULL,
        sat_date text,
        current_score text,
        goals text,
        notes text,
        confirmation_emailed_at timestamptz,
        staff_emailed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS group_sat_inquiries_email_idx ON group_sat_inquiries (email)`;
    await sql`CREATE INDEX IF NOT EXISTS group_sat_inquiries_created_idx ON group_sat_inquiries (created_at DESC)`;
  })();
  return schemaReady;
}

export async function createGroupSatInquiry(input: GroupSatInquiryInput): Promise<string> {
  await ensureSchema();
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO group_sat_inquiries (
      id,
      parent_name,
      student_name,
      email,
      phone,
      grade,
      cohort,
      sat_date,
      current_score,
      goals,
      notes
    )
    VALUES (
      ${id},
      ${input.parentName},
      ${input.studentName},
      ${input.email},
      ${input.phone},
      ${input.grade},
      ${input.cohort},
      ${input.satDate},
      ${input.currentScore},
      ${input.goals},
      ${input.notes}
    )
  `;
  return id;
}
export async function markGroupSatInquiryEmails(
  id: string,
  updates: { confirmation?: boolean; staff?: boolean },
): Promise<void> {
  await ensureSchema();

  if (updates.confirmation && updates.staff) {
    await sql`
      UPDATE group_sat_inquiries
      SET confirmation_emailed_at = now(), staff_emailed_at = now()
      WHERE id = ${id}
    `;
    return;
  }

  if (updates.confirmation) {
    await sql`
      UPDATE group_sat_inquiries
      SET confirmation_emailed_at = now()
      WHERE id = ${id}
    `;
    return;
  }

  if (updates.staff) {
    await sql`
      UPDATE group_sat_inquiries
      SET staff_emailed_at = now()
      WHERE id = ${id}
    `;
  }
}