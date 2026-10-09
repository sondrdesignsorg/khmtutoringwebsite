'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Brain, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  isNew?: boolean;
  children?: { href: string; label: string }[];
};

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  {
    href: '/about',
    label: 'About Us',
    children: [
      { href: '/about', label: 'About Us' },
      { href: '/about/leadership', label: 'Leadership' },
    ],
  },
  { href: '/educators', label: 'Educators' },
  { href: '/group-sat-prep', label: 'Group SAT', isNew: true },
  { href: '/contact', label: 'Contact Us' },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setMobileExpanded(null);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm py-3 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 sm:space-x-4" onClick={closeMobileMenu}>
            <Image
              src="/images/khm-tutoring-logo.png"
              alt="KHM Tutoring Logo - Expert Tutors in Hawaii and Honolulu"
              width={1656}
              height={1156}
              className="h-9 w-auto sm:h-11 object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg sm:text-xl text-foreground leading-tight">
                KHM Tutoring
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground italic hidden sm:inline">
                Take it higher
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                item.children?.some((c) => pathname === c.href);
              if (item.children) {
                const isOpen = openDropdown === item.label;
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      className={cn(
                        'relative inline-flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground/80 hover:text-primary'
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')}
                      />
                    </button>
                    {isOpen && (
                      <div className="absolute left-0 top-full min-w-[180px] pt-2">
                        <div className="rounded-xl border border-border bg-background py-1.5 shadow-lg">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className={cn(
                                'block px-4 py-2 text-sm font-medium',
                                pathname === child.href
                                  ? 'text-primary bg-primary/10'
                                  : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-2 rounded-lg font-medium text-sm',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/80 hover:text-primary'
                  )}
                >
                  {item.label}
                  {item.isNew && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-background" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/diagnostic-test"
              className={cn(
                'ml-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border-2 transition-colors whitespace-nowrap',
                pathname === '/diagnostic-test'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
              )}
            >
              <Brain className="w-4 h-4" />
              Free Diagnostic
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-3 rounded-lg z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[72px] bg-background shadow-lg border-t border-border">
            <div className="px-4 py-4">
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    item.children?.some((c) => pathname === c.href);
                  if (item.children) {
                    const isOpen = mobileExpanded === item.label;
                    return (
                      <div key={item.href}>
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(isOpen ? null : item.label)}
                          aria-expanded={isOpen}
                          className={cn(
                            'inline-flex w-full items-center justify-between gap-2 px-4 py-3 rounded-lg font-medium text-lg',
                            isActive ? 'text-primary bg-primary/10' : 'text-foreground/80'
                          )}
                        >
                          {item.label}
                          <ChevronDown
                            className={cn('w-5 h-5 transition-transform', isOpen && 'rotate-180')}
                          />
                        </button>
                        {isOpen && (
                          <div className="ml-4 flex flex-col border-l border-border pl-3">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={closeMobileMenu}
                                className={cn(
                                  'px-4 py-2.5 rounded-lg font-medium text-base',
                                  pathname === child.href
                                    ? 'text-primary bg-primary/10'
                                    : 'text-foreground/80'
                                )}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        'inline-flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-lg',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground/80'
                      )}
                    >
                      {item.label}
                      {item.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 leading-none">
                          New
                        </span>
                      )}
                    </Link>
                  );
                })}
                <Link
                  href="/diagnostic-test"
                  onClick={closeMobileMenu}
                  className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-base bg-primary text-primary-foreground"
                >
                  <Brain className="w-4 h-4" />
                  Free Academic Diagnostic
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
