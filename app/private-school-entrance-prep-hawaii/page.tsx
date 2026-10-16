import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/services/ServiceLanding';
import { StructuredData } from '@/components/StructuredData';
import { getService } from '@/lib/services/content';
import { buildServiceMetadata } from '@/lib/services/metadata';

const service = getService('private-school-entrance-prep-hawaii')!;

export const metadata: Metadata = buildServiceMetadata(service);

export default function PrivateSchoolEntrancePrepHawaiiPage() {
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
