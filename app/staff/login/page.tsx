import { Suspense } from 'react';
import { StaffLoginForm } from '@/components/staff/StaffLoginForm';

export default function StaffLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StaffLoginForm />
    </Suspense>
  );
}
