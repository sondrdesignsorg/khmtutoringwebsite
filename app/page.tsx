import { HeroSection } from '@/components/home/HeroSection';
import { ServiceLinksSection } from '@/components/home/ServiceLinksSection';
import { GroupSatCallout } from '@/components/home/GroupSatCallout';
import { MissionSection } from '@/components/home/MissionSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTASection } from '@/components/home/CTASection';
import { StructuredData } from '@/components/StructuredData';

export default function Home() {
  return (
    <>
      <StructuredData type="home" />
      <div className="bg-background">
        <HeroSection />
        <ServiceLinksSection />
        <GroupSatCallout />
        <MissionSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
  );
}
