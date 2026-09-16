#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function argValue(name) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function main() {
  loadEnvFile(path.join(process.cwd(), '.env.local'));
  loadEnvFile(path.join(process.cwd(), '.env'));

  const to = argValue('--to') || process.env.EMAIL_TEST_TO;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_ADDRESS;
  const staffEmail = process.env.KHM_STAFF_EMAIL || process.env.DIAGNOSTIC_STAFF_EMAIL || 'khmtutoring1@gmail.com';

  const missing = [];
  if (!apiKey) missing.push('RESEND_API_KEY');
  if (!from) missing.push('RESEND_FROM_ADDRESS');
  if (!to) missing.push('EMAIL_TEST_TO or --to');

  if (missing.length) {
    console.error(`Missing required config: ${missing.join(', ')}`);
    console.error('Example: node scripts/verify-email.cjs --to parent@example.com');
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const stamp = new Date().toISOString();

  const parent = await resend.emails.send({
    from,
    to,
    replyTo: staffEmail,
    subject: `KHM email verification - parent copy - ${stamp}`,
    html: `<p>This verifies the parent email path for KHM forms.</p><p>Sent at ${stamp}.</p>`,
  });

  const staff = await resend.emails.send({
    from,
    to: staffEmail,
    replyTo: to,
    subject: `KHM email verification - staff copy - ${stamp}`,
    html: `<p>This verifies the Kody/staff email path for KHM forms.</p><p>Test parent recipient: ${to}</p><p>Sent at ${stamp}.</p>`,
  });

  const parentOk = !parent.error;
  const staffOk = !staff.error;

  console.log(JSON.stringify({
    parentOk,
    staffOk,
    parentError: parent.error?.message || null,
    staffError: staff.error?.message || null,
    from,
    parentTo: to,
    staffTo: staffEmail,
  }, null, 2));

  if (!parentOk || !staffOk) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
