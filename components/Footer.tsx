import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/educators', label: 'Educators' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/privacy', label: 'Privacy Policy' },
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
              src="/images/khm-tutoring-logo.png"
              alt="KHM Tutoring - Expert Tutors in Hawaii and Honolulu"
              width={144}
              height={144}
              className="w-32 md:w-36 h-auto object-contain"
            />
          </div>

          {/* Right - Contact Information */}
          <div className="space-y-2 md:space-y-2.5 md:text-right">
            <div>
              <p className="text-white text-xs md:text-sm break-all">
                Email: <a href="mailto:khmtutoring1@gmail.com" className="hover:underline">khmtutoring1@gmail.com</a>
              </p>
            </div>
            <div>
              <p className="text-white text-xs md:text-sm">
                Phone: <a href="tel:+18083817856" className="hover:underline">(808) 381-7856</a>
              </p>
            </div>
            <div>
              <p className="text-white/80 text-xs md:text-sm font-semibold">
                Serving Honolulu, Oahu & All of Hawaii
              </p>
            </div>
            <div>
              <p className="text-white/80 text-xs md:text-sm">
                Open Daily: 8 AM – 10 PM
              </p>
            </div>
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
