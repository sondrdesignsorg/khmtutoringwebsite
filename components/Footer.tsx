import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS } from '@/lib/business/config';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/educators', label: 'Educators' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/privacy', label: 'Privacy Policy' },
];

const serviceLinks = [
  { href: '/sat-prep-honolulu', label: 'SAT Prep' },
  { href: '/math-tutoring-honolulu', label: 'Math Tutoring' },
  { href: '/ssat-prep-hawaii', label: 'SSAT Prep' },
  { href: '/ap-tutoring-honolulu', label: 'AP Tutoring' },
  { href: '/college-essay-help-honolulu', label: 'College Essay Help' },
  { href: '/online-tutoring-hawaii', label: 'Online Tutoring' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white w-full">
      {/* Main Footer Content */}
      <div className="w-full container mx-auto px-4 py-6 md:py-8">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start text-center md:text-left">
          {/* Left - Navigation Links */}
          <div className="space-y-2 md:space-y-2.5">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-white flex items-center gap-1.5 justify-center md:justify-start text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Center - Logo */}
          <div className="flex justify-center order-first md:order-none">
            <Image
              src="/images/khm-tutoring-lockup-white.png"
              alt="KHM Tutoring - Expert Tutors in Hawaii and Honolulu"
              width={2322}
              height={1598}
              className="w-44 md:w-52 h-auto object-contain"
            />
          </div>

          {/* Right - Contact Information */}
          <div className="space-y-2 md:space-y-2.5 md:text-right">
            <div>
              <p className="text-white text-xs md:text-sm break-all">
                Email: <a href={`mailto:${BUSINESS.email}`} className="hover:underline">{BUSINESS.email}</a>
              </p>
            </div>
            <div>
              <p className="text-white text-xs md:text-sm">
                Phone: <a href={BUSINESS.phone.href} className="hover:underline">{BUSINESS.phone.display}</a>
              </p>
            </div>
            <div>
              <p className="text-white/80 text-xs md:text-sm font-semibold">
                Serving Honolulu &amp; online across Hawaiʻi
              </p>
            </div>
            <div>
              <p className="text-white/80 text-xs md:text-sm">
                Visit: {BUSINESS.address.full}
              </p>
            </div>
            <div>
              <p className="text-white/80 text-xs md:text-sm">
                Hours: Daily after 3 PM · By appointment
              </p>
              <p className="text-white/70 text-xs md:text-sm">
                KHM private space after 2 PM — not open to the public
              </p>
            </div>
          </div>
        </div>

        {/* Services Links */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-white/60 md:text-left">
            Tutoring Services
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-start">
            {serviceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="w-full border-t border-white/10">
        <div className="container mx-auto px-4 py-2 md:py-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-center text-white/60 text-xs md:text-sm">
              © Copyright {currentYear} KHM Tutoring. All Rights Reserved.
            </p>
            <p className="text-center text-white/60 text-xs md:text-sm">
              Site by{' '}
              <a
                href="https://www.sondrdesigns.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white underline underline-offset-2"
              >
                Sondr Designs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
