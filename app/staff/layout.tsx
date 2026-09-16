import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff Portal',
  robots: { index: false, follow: false }, // keep the portal out of search
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
