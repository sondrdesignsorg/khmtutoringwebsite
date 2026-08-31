import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'public', 'og-image.png');

const W = 1200;
const H = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2B4A75;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="goldBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#EDB33A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f5cc6a;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)" />

  <!-- Subtle grid pattern overlay -->
  <rect width="${W}" height="${H}" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.04"
        style="background-image: repeating-linear-gradient(0deg, transparent, transparent 59px, #fff 59px, #fff 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, #fff 59px, #fff 60px);" />

  <!-- Decorative circles -->
  <circle cx="1050" cy="80" r="180" fill="#ffffff" opacity="0.03" />
  <circle cx="1100" cy="120" r="120" fill="#ffffff" opacity="0.04" />
  <circle cx="150" cy="560" r="200" fill="#EDB33A" opacity="0.05" />

  <!-- Gold accent bar -->
  <rect x="80" y="260" width="6" height="120" rx="3" fill="url(#goldBar)" />

  <!-- KHM badge top-left -->
  <rect x="80" y="72" width="108" height="44" rx="8" fill="#EDB33A" />
  <text x="134" y="101" font-family="Arial Black, Arial, sans-serif" font-size="22" font-weight="900"
        fill="#1e3a5f" text-anchor="middle" letter-spacing="2">KHM</text>

  <!-- Main headline -->
  <text x="110" y="310" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800"
        fill="#ffffff" letter-spacing="-1">Expert Tutoring</text>
  <text x="110" y="385" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800"
        fill="#EDB33A" letter-spacing="-1">in Honolulu, Hawaii</text>

  <!-- Tagline -->
  <text x="110" y="448" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="400"
        fill="#a8c4e0" letter-spacing="0.5">Math · SAT Prep · In-Person &amp; Online</text>

  <!-- Divider line -->
  <rect x="80" y="500" width="520" height="2" rx="1" fill="#ffffff" opacity="0.15" />

  <!-- Bottom info -->
  <text x="110" y="540" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400"
        fill="#7ba8cc" letter-spacing="0.3">khmtutoring.com · (808) 381-7856</text>

  <!-- Right side accent shape -->
  <rect x="900" y="0" width="300" height="${H}" fill="#ffffff" opacity="0.02" />
  <text x="1050" y="340" font-family="Arial Black, Arial, sans-serif" font-size="160" font-weight="900"
        fill="#ffffff" text-anchor="middle" opacity="0.05">K</text>
</svg>
`;

await sharp(Buffer.from(svg))
  .png()
  .toFile(outPath);

console.log(`OG image written to ${outPath}`);
