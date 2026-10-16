import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/services/ServiceLanding';
import { StructuredData } from '@/components/StructuredData';
import { getService } from '@/lib/services/content';
import { buildServiceMetadata } from '@/lib/services/metadata';

const service = getService('sat-prep-honolulu')!;

export const metadata: Metadata = buildServiceMetadata(service);

export default function SatPrepHonoluluPage() {
  return (
    <>
      <StructuredData
        type="service"
        service={{
          name: service.name,
          description: service.metaDescription,
          path: service.path,
          serviceType: service.navLabel,
          faqs: service.faqs,
        }}
      />
      <ServiceLanding service={service} />
    </>
  );
}
