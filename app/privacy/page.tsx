import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'KHM Tutoring privacy policy. Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://www.khmtutoring.com/privacy',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="pt-20">
      <section className="py-8 md:py-10 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-3 md:mb-4 text-3xl sm:text-4xl md:text-5xl font-heading font-bold">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Last updated: March 15, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-sm md:prose-base text-foreground space-y-6">
            <h2 className="text-xl md:text-2xl font-heading font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              When you use our contact form or book a consultation, we may collect the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Student grade level</li>
              <li>School name</li>
              <li>Subject of interest</li>
              <li>Message content</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information you provide to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Respond to your inquiry and schedule consultations</li>
              <li>Match your child with the most suitable tutor</li>
              <li>Communicate about our tutoring services</li>
              <li>Improve our services and website experience</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell, trade, or otherwise transfer your personal information to third parties. Your information may be shared with our tutoring staff solely for the purpose of providing tutoring services.
            </p>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement reasonable security measures to protect your personal information. Our website uses HTTPS encryption for all data transmission. However, no method of electronic transmission or storage is 100% secure.
            </p>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">5. Cookies and Analytics</h2>
            <p className="text-muted-foreground">
              Our website uses Google Analytics to understand how visitors interact with our site. This service may use cookies to collect anonymous usage data. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.
            </p>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">6. Third-Party Services</h2>
            <p className="text-muted-foreground">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>EmailJS</strong> — to process contact form submissions</li>
              <li><strong>Google Analytics</strong> — for website analytics</li>
              <li><strong>Vercel</strong> — for website hosting</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">7. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              Our services are designed for students, but our website contact form is intended to be used by parents or guardians. We do not knowingly collect personal information directly from children under 13 without parental consent.
            </p>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">8. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction or deletion of your personal information</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">9. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy or your personal data, please contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-1">
              <li><strong>Email:</strong> khmtutoring1@gmail.com</li>
              <li><strong>Phone:</strong> (808) 381-7856</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading font-semibold">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
