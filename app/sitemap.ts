import type { MetadataRoute } from 'next';
import { BUSINESS } from '@/lib/business/config';
import { SERVICES } from '@/lib/services/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS.url;

  const core: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-10-15'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-08-28'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/leadership`,
      lastModified: new Date('2026-10-02'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about/location`,
      lastModified: new Date('2026-10-15'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/educators`,
      lastModified: new Date('2026-08-28'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-08-28'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/group-sat-prep`,
      lastModified: new Date('2026-09-03'),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/diagnostic-test`,
      lastModified: new Date('2026-10-15'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const services: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${baseUrl}${service.path}`,
    lastModified: new Date(service.lastModified),
    changeFrequency: service.changeFrequency,
    priority: service.priority,
  }));

  return [...core, ...services];
}
