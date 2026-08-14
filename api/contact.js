// /api/contact.js — Vercel Serverless Function
// Receives POST from portfolio contact form, sends email via Resend.
// RESEND_API_KEY is a server-side env variable — never exposed to the browser.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENT = 'soibjonov.0611@gmail.com';
const SENDER    = 'Portfolio Contact <onboarding@resend.dev>';

// Basic sanitisation — strip HTML tags, trim whitespace
function sanitize(str = '') {
  return String(str).replace(/<[^>]*>/g, '').trim();
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  // 1. Method check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { name, email, message, website } = req.body ?? {};

  // 2. Honeypot — bots fill the hidden `website` field; humans leave it empty
  if (website) {
    // Silently accept so bots don't know they were caught
    return res.status(200).json({ success: true });
  }

  // 3–5. Validate & sanitize
  const cleanName    = sanitize(name);
  const cleanEmail   = sanitize(email);
  const cleanMessage = sanitize(message);

  if (!cleanName || cleanName.length > 100) {
    return res.status(400).json({ error: 'Name is required (max 100 chars).' });
  }

  if (!cleanEmail || !isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  if (!cleanMessage || cleanMessage.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters.' });
  }

  if (cleanMessage.length > 2000) {
    return res.status(400).json({ error: 'Message must not exceed 2000 characters.' });
  }

  // 6. Send via Resend
  try {
    const { error } = await resend.emails.send({
      from:     SENDER,
      to:       [RECIPIENT],
      reply_to: cleanEmail,
      subject:  `New Portfolio Message — ${cleanName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:8px;">
          <h2 style="margin-top:0;color:#111827;">New message from your portfolio website.</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;width:160px;">Name</td>
              <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#111827;">${cleanName}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;">Visitor Email</td>
              <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#111827;">
                <a href="mailto:${cleanEmail}" style="color:#4f46e5;">${cleanEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 16px 12px 0;font-weight:600;color:#374151;vertical-align:top;">Message</td>
              <td style="padding:12px 0;color:#111827;white-space:pre-wrap;">${cleanMessage}</td>
            </tr>
          </table>
          <p style="margin-top:24px;font-size:13px;color:#6b7280;">
            Source: <strong>Saipov_00 Portfolio</strong><br/>
            Reply directly to this email to reach ${cleanName}.
          </p>
        </div>
      `,
      text: [
        'New message from your portfolio website.',
        '',
        `Name: ${cleanName}`,
        `Visitor Email: ${cleanEmail}`,
        '',
        `Message:\n${cleanMessage}`,
        '',
        'Source: Saipov_00 Portfolio',
      ].join('\n'),
    });

    // 7. Return success ONLY after confirmed delivery
    if (error) {
      console.error('Resend error:', error);
      return res.status(502).json({ error: 'Email delivery failed. Please try again.' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    // 8. Unexpected error
    console.error('Contact handler exception:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}
