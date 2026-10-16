import type { Metadata } from 'next';
import type { ServiceContent } from '@/lib/services/content';
import { BUSINESS } from '@/lib/business/config';

export function buildServiceMetadata(service: ServiceContent): Metadata {
  const url = `${BUSINESS.url}${service.path}`;
  const ogImage = {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: `${service.name} - KHM Tutoring`,
  };

  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
      images: ['/og-image.png'],
    },
  };
}
