import { SERVICES } from '@/lib/services/content';
import { ServiceStack, type ServiceStackItem } from '@/components/home/ServiceStack';

export function ServiceLinksSection() {
  const items: ServiceStackItem[] = SERVICES.map((service) => ({
    slug: service.slug,
    path: service.path,
    navLabel: service.navLabel,
    metaDescription: service.metaDescription,
    topics: service.topics,
  }));

  return (
    <section id="services" className="scroll-mt-28 py-12 md:py-16 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="mb-3 text-3xl sm:text-4xl md:text-5xl font-heading font-bold">
            Explore Our <span className="text-gradient font-bold">Tutoring Services</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Focused programs for Honolulu families — in person from Pearl City to Hawaiʻi Kai, and online across Hawaiʻi.
          </p>
        </div>

        <ServiceStack items={items} />

        <noscript>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <li key={service.slug} className="rounded-2xl border border-border bg-card p-4">
                <a href={service.path} className="font-semibold text-primary hover:underline">
                  {service.navLabel}
                </a>
              </li>
            ))}
          </ul>
        </noscript>
      </div>
    </section>
  );
}
