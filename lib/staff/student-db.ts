import type { Student } from './types';

export type DbStudentRow = {
  id: string;
  name: string;
  email: string | null;
  grade: string | null;
  parent_name: string | null;
  phone: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
};

export function toStudent(row: DbStudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? '',
    grade: row.grade ?? '',
    parentName: row.parent_name ?? '',
    phone: row.phone ?? '',
    notes: row.notes ?? '',
  };
}
