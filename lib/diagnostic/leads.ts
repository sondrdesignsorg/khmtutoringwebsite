import { sql } from '@vercel/postgres';
import type { TopicResult } from './questions';

export type DiagnosticLeadStatus = 'new' | 'contacted' | 'client';

export interface DiagnosticLeadRow {
  id: string;
  parent_name: string;
  student_name: string;
  student_grade: string | null;
  email: string;
  phone: string | null;
  age_group: string;
  subject: string;
  length: number;
  score: number;
  tier: string;
  topic_breakdown: TopicResult[];
  answers: unknown;
  emailed_at: string | null;
  booked_at: string | null;
  client_status: DiagnosticLeadStatus;
  notes: string | null;
  created_at: string;
}

interface CreateLeadInput {
  parentName: string;
  studentName: string;
  studentGrade: string | null;
  email: string;
  phone: string | null;
  ageGroup: string;
  subject: string;
  length: number;
  score: number;
  tier: string;
  topicBreakdown: TopicResult[];
  answers?: unknown;
}

let schemaReady: Promise<void> | null = null;

function ensureSchema() {
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS diagnostic_leads (
        id text PRIMARY KEY,
        parent_name text NOT NULL,
        student_name text NOT NULL,
        student_grade text,
        email text NOT NULL,
        phone text,
        age_group text NOT NULL,
        subject text NOT NULL,
        length integer NOT NULL,
        score integer NOT NULL,
        tier text NOT NULL,
        topic_breakdown jsonb NOT NULL,
        answers jsonb,
        emailed_at timestamptz,
        booked_at timestamptz,
        client_status text NOT NULL DEFAULT 'new',
        notes text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS diagnostic_leads_email_idx ON diagnostic_leads (email)`;
    await sql`CREATE INDEX IF NOT EXISTS diagnostic_leads_created_idx ON diagnostic_leads (created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS diagnostic_leads_status_idx ON diagnostic_leads (client_status)`;
  })();
  return schemaReady;
}

export async function createDiagnosticLead(input: CreateLeadInput): Promise<string> {
  await ensureSchema();
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO diagnostic_leads (
      id,
      parent_name,
      student_name,
      student_grade,
      email,
      phone,
      age_group,
      subject,
      length,
      score,
      tier,
      topic_breakdown,
      answers
    )
    VALUES (
      ${id},
      ${input.parentName},
      ${input.studentName},
      ${input.studentGrade},
      ${input.email},
      ${input.phone},
      ${input.ageGroup},
      ${input.subject},
      ${input.length},
      ${input.score},
      ${input.tier},
      ${JSON.stringify(input.topicBreakdown)}::jsonb,
      ${input.answers == null ? null : JSON.stringify(input.answers)}::jsonb
    )
  `;
  return id;
}

export async function markDiagnosticLeadEmailed(id: string): Promise<void> {
  await ensureSchema();
  await sql`UPDATE diagnostic_leads SET emailed_at = now() WHERE id = ${id}`;
}

export async function markDiagnosticLeadBooked(id: string): Promise<void> {
  await ensureSchema();
  await sql`
    UPDATE diagnostic_leads
    SET booked_at = COALESCE(booked_at, now())
    WHERE id = ${id}
  `;
}

export async function listDiagnosticLeads(): Promise<DiagnosticLeadRow[]> {
  await ensureSchema();
  const { rows } = await sql<DiagnosticLeadRow>`
    SELECT
      id,
      parent_name,
      student_name,
      student_grade,
      email,
      phone,
      age_group,
      subject,
      length,
      score,
      tier,
      topic_breakdown,
      answers,
      emailed_at,
      booked_at,
      client_status,
      notes,
      created_at
    FROM diagnostic_leads
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function updateDiagnosticLead(
  id: string,
  updates: { client_status?: DiagnosticLeadStatus; notes?: string | null },
): Promise<{ id: string; client_status: DiagnosticLeadStatus; notes: string | null } | null> {
  await ensureSchema();

  if (updates.client_status !== undefined && updates.notes !== undefined) {
    const { rows } = await sql<{ id: string; client_status: DiagnosticLeadStatus; notes: string | null }>`
      UPDATE diagnostic_leads
      SET client_status = ${updates.client_status}, notes = ${updates.notes}
      WHERE id = ${id}
      RETURNING id, client_status, notes
    `;
    return rows[0] ?? null;
  }

  if (updates.client_status !== undefined) {
    const { rows } = await sql<{ id: string; client_status: DiagnosticLeadStatus; notes: string | null }>`
      UPDATE diagnostic_leads
      SET client_status = ${updates.client_status}
      WHERE id = ${id}
      RETURNING id, client_status, notes
    `;
    return rows[0] ?? null;
  }

  if (updates.notes !== undefined) {
    const { rows } = await sql<{ id: string; client_status: DiagnosticLeadStatus; notes: string | null }>`
      UPDATE diagnostic_leads
      SET notes = ${updates.notes}
      WHERE id = ${id}
      RETURNING id, client_status, notes
    `;
    return rows[0] ?? null;
  }

  return null;
}
