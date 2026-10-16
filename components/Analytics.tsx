'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Delegated conversion tracking. Phone clicks are tracked centrally so that
 * server-rendered `tel:` links (footer, location page, etc.) are covered
 * without turning every link into a client component.
 */
export function Analytics() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (anchor) {
        trackEvent('phone_click', { phone: anchor.getAttribute('href') });
      }
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
