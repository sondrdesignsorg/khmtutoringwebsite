'use client';

import { usePathname } from 'next/navigation';

/**
 * Hides the marketing chrome (Navigation / Footer) on the staff portal so it
 * renders as its own standalone app. Wrap the site nav + footer in the root
 * layout with this:
 *
 *   <HideOnStaff><Navigation /></HideOnStaff>
 *   ...
 *   <HideOnStaff><Footer /></HideOnStaff>
 *
 * Non-invasive: leaves the existing Navigation / Footer components untouched.
 */
export function HideOnStaff({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/staff')) return null;
  return <>{children}</>;
}
