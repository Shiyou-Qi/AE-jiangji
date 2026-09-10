import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONTACT_TO = process.env.CONTACT_TO || 'shijuebaba@gmail.com';
const MAX_MESSAGE = 5000;
const MAX_FIELD = 240;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map();

function clean(value, max = MAX_FIELD) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanMessage(value) {
  return String(value || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().slice(0, MAX_MESSAGE);
}

function clientKey(request) {
  return (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'local')
    .split(',')[0]
    .trim();
}

function rateLimited(key) {
  const now = Date.now();
  const bucket = hits.get(key) || [];
  const fresh = bucket.filter((t) => now - t < WINDOW_MS);
  fresh.push(now);
  hits.set(key, fresh);
  return fresh.length > MAX_PER_WINDOW;
}

function transportConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 465);
  return {
    host,
    port,
    secure: String(process.env.SMTP_SECURE || port === 465).toLowerCase() !== 'false',
    auth: { user, pass },
  };
}

function textBody(data) {
  return [
    'AEBack contact form',
    '',
    `Type: ${data.type}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company/team: ${data.company || '-'}`,
    `Budget/timeline: ${data.budget || '-'}`,
    '',
    'Message:',
    data.message,
  ].join('\n');
}

export async function POST(request) {
  const key = clientKey(request);
  if (rateLimited(key)) {
    return Response.json({ ok: false, error: 'Too many requests.' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  if (clean(body.website)) {
    return Response.json({ ok: true });
  }

  const data = {
    type: clean(body.type || 'Contact'),
    name: clean(body.name),
    email: clean(body.email),
    company: clean(body.company),
    budget: clean(body.budget),
    message: cleanMessage(body.message),
  };

  if (!data.name || !data.email || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return Response.json({ ok: false, error: 'Missing or invalid fields.' }, { status: 400 });
  }

  const config = transportConfig();
  if (!config) {
    return Response.json({ ok: false, error: 'Email delivery is not configured.' }, { status: 503 });
  }

  const transporter = nodemailer.createTransport(config);
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from,
      to: CONTACT_TO,
      replyTo: data.email,
      subject: `[AEBack] ${data.type} - ${data.name}`,
      text: textBody(data),
    });
  } catch {
    return Response.json({ ok: false, error: 'Email delivery failed.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
