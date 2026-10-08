// Vercel function: receives Close CRM webhooks and forwards them to Front Office (the Apps Script backend).
// Lives at /api/close-webhook. Verifies Close CRM's signature, then posts a compact event to the tool.
// Env vars (Vercel > Project > Settings > Environment Variables):
//   CLOSE_WEBHOOK_KEY   the signature_key the tool shows when you press "Connect Close CRM webhook" in Settings
//   PP_API_URL          the tool's Apps Script web app URL (https://script.google.com/macros/s/.../exec)
//   PP_WEBHOOK_SECRET   a long random string; the same value goes in Apps Script Script Properties as WEBHOOK_SECRET
import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

function readRaw(req) { return new Promise((resolve, reject) => { let data = ''; req.setEncoding('utf8'); req.on('data', c => data += c); req.on('end', () => resolve(data)); req.on('error', reject); }); }

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  const raw = await readRaw(req);
  const key = process.env.CLOSE_WEBHOOK_KEY || '';
  const ts = req.headers['close-sig-timestamp'], sig = req.headers['close-sig-hash'];
  if (key) {
    const expected = crypto.createHmac('sha256', Buffer.from(key, 'hex')).update(ts + raw).digest('hex');
    if (!ts || !sig || expected !== sig) { res.status(401).json({ ok: false, error: 'bad signature' }); return; }
  }
  let body; try { body = JSON.parse(raw); } catch (e) { res.status(400).json({ ok: false }); return; }
  const ev = body.event || {};
  const compact = {
    id: ev.id, type: ev.object_type, action: ev.action, objectId: ev.object_id, leadId: ev.lead_id, at: ev.date_created,
    data: ev.data ? {
      status: ev.data.status, status_label: ev.data.status_label, status_reason: ev.data.status_reason,
      direction: ev.data.direction, sender: ev.data.sender, to: ev.data.to, subject: ev.data.subject,
      contact_id: ev.data.contact_id, sequence_id: ev.data.sequence_id, lead_id: ev.data.lead_id,
      email: ev.data.email, user_id: ev.data.user_id, date_created: ev.data.date_created
    } : null,
    changed: ev.changed_fields || []
  };
  try {
    const params = new URLSearchParams({ action: 'closeEvent', secret: process.env.PP_WEBHOOK_SECRET || '', event: JSON.stringify(compact) });
    const r = await fetch(process.env.PP_API_URL, { method: 'POST', body: params, redirect: 'follow' });
    const text = await r.text();
    res.status(200).json({ ok: true, forwarded: r.status, reply: text.slice(0, 200) });
  } catch (e) {
    // Close CRM retries on non-2xx; a 500 here asks it to try again shortly
    res.status(500).json({ ok: false, error: String(e && e.message || e) });
  }
}
