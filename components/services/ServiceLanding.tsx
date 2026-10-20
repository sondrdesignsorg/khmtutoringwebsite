import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import type { ServiceContent } from '@/lib/services/content';
import { getService } from '@/lib/services/content';
import { BUSINESS, SERVICE_AREAS } from '@/lib/business/config';

export function ServiceLanding({ service }: { service: ServiceContent }) {
  const related = service.related
    .map((slug) => getService(slug))
    .filter((item): item is ServiceContent => Boolean(item));

  return (
    <div className="pt-8 md:pt-12">
      <section className="bg-gradient-to-b from-muted/40 to-background py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-primary">Home</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="inline h-3.5 w-3.5" /></li>
              <li aria-current="page" className="text-foreground">{service.navLabel}</li>
            </ol>
          </nav>
          <h1 className="mb-5 text-4xl font-heading font-bold leading-tight text-foreground md:text-5xl">
            {service.h1}
          </h1>
          {service.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mb-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {paragraph}
            </p>
          ))}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book a free consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/diagnostic-test"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Brain className="h-4 w-4" />
              Free diagnostic test
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            {service.highlights.map((highlight) => (
              <div key={highlight.title} className="rounded-2xl border border-border bg-card p-6">
                <Sparkles className="mb-3 h-5 w-5 text-primary" />
                <h2 className="mb-2 text-lg font-heading font-bold text-foreground">{highlight.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{highlight.body}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-heading font-bold text-foreground">Who it&apos;s for</h2>
              <ul className="space-y-2.5">
                {service.audiences.map((audience) => (
                  <li key={audience} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{audience}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-heading font-bold text-foreground">What we cover</h2>
              <ul className="space-y-2.5">
                {service.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Where we tutor</p>
                <p className="text-sm text-muted-foreground">
                  In person in {SERVICE_AREAS.inPerson.label}, at our Kakaʻako space with {BUSINESS.location.partnerVenue}, and online across {SERVICE_AREAS.online.label}. {BUSINESS.location.spacePolicy}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarClock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Scheduling</p>
                <p className="text-sm text-muted-foreground">{BUSINESS.hours.note} Sessions are {BUSINESS.hours.label.toLowerCase()}.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-heading font-bold text-foreground md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="group overflow-hidden rounded-2xl border border-border bg-background">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-foreground transition-colors hover:bg-muted/30">
                  <span>{faq.question}</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-6 text-2xl font-heading font-bold text-foreground md:text-3xl">Related services</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={item.path}
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <span className="font-semibold text-foreground">{item.navLabel}</span>
                <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-14 text-primary-foreground md:py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-heading font-bold text-white md:text-4xl">Start with a free diagnostic</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-white/80">
            Take our free diagnostic test to see exactly where your student stands, then book a consultation to build a plan.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-white/90"
          >
            Book a free consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
