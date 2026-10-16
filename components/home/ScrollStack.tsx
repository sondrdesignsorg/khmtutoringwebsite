import Link from 'next/link';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface ScrollStackItem {
  icon: string;
  title: string;
  description: string;
  points: string[];
  cta: string;
  href: string;
}

const ICONS: Record<string, LucideIcon> = {
  pin: MapPin,
  users: Users,
  award: Award,
  clock: Clock,
  book: BookOpen,
  check: CheckCircle2,
};

type Theme = {
  bg: string;
  text: string;
  num: string;
  link: string;
  panel: string;
  icon: string;
};

const THEMES: Theme[] = [
  {
    bg: 'bg-[#2a476f]',
    text: 'text-white',
    num: 'text-[#9db8dc]',
    link: 'text-[#cdddf2]',
    panel: 'bg-white/10',
    icon: 'text-white/90',
  },
  {
    bg: 'bg-[#dbe6f3]',
    text: 'text-[#1f3552]',
    num: 'text-[#2a476f]',
    link: 'text-[#2a476f]',
    panel: 'bg-white/70',
    icon: 'text-[#2a476f]',
  },
  {
    bg: 'bg-white border border-[#d7e1ee]',
    text: 'text-[#1f3552]',
    num: 'text-[#6b8fbf]',
    link: 'text-[#2a476f]',
    panel: 'bg-[#eef3fa]',
    icon: 'text-[#4a6fa5]',
  },
  {
    bg: 'bg-[#4a6fa5]',
    text: 'text-white',
    num: 'text-[#dbe6f3]',
    link: 'text-[#dbe6f3]',
    panel: 'bg-white/10',
    icon: 'text-white/90',
  },
  {
    bg: 'bg-[#f0cf72]',
    text: 'text-[#3a2c05]',
    num: 'text-[#7a5a00]',
    link: 'text-[#3a2c05]',
    panel: 'bg-white/40',
    icon: 'text-[#7a5a00]',
  },
  {
    bg: 'bg-[#16263f]',
    text: 'text-white',
    num: 'text-[#7d9cc4]',
    link: 'text-[#cdddf2]',
    panel: 'bg-white/10',
    icon: 'text-white/90',
  },
];

const BASE_TOP = 96;
const OFFSET = 22;

export function ScrollStack({ items }: { items: ScrollStackItem[] }) {
  return (
    <div className="mx-auto max-w-[1000px] px-4">
      {items.map((item, index) => {
        const Icon = ICONS[item.icon] ?? CheckCircle2;
        const theme = THEMES[index % THEMES.length];
        return (
          <article
            key={item.title}
            style={{ top: BASE_TOP + index * OFFSET }}
            className={`sticky mb-8 grid min-h-[300px] grid-cols-1 gap-8 rounded-[32px] p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.6)] md:grid-cols-2 md:p-11 ${theme.bg} ${theme.text}`}
          >
            <div className="flex flex-col gap-3.5">
              <span className={`font-heading text-6xl font-bold leading-none ${theme.num}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-3xl font-bold leading-tight md:text-[34px]">
                {item.title}
              </h3>
              <p className="text-[17px] leading-relaxed opacity-90">{item.description}</p>
              <Link href={item.href} className={`mt-auto pt-4 font-semibold hover:underline ${theme.link}`}>
                {item.cta}
              </Link>
            </div>

            <div
              className={`relative flex min-h-[200px] flex-col justify-center gap-4 rounded-[22px] p-6 md:p-7 ${theme.panel}`}
            >
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] opacity-70">
                <Icon className={`h-4 w-4 ${theme.icon}`} />
                Highlights
              </span>
              <ul className="space-y-3">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm leading-snug md:text-base">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-shrink-0 ${theme.icon}`} />
                    <span className="opacity-95">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
