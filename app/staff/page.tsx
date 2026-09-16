import { redirect } from 'next/navigation';

// /staff -> the library (middleware enforces auth).
export default function StaffIndex() {
  redirect('/staff/library');
}
