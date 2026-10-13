// Vercel function: receives Close CRM webhooks and forwards them to Front Office (the Apps Script backend).
// Lives at /api/close-webhook in the practiceplan-onboarding project. Opening the URL in a browser shows 405: correct, it only accepts POSTs from Close CRM.
// Env vars (Vercel > practiceplan-onboarding > Settings > Environment Variables, Production):
//   CLOSE_WEBHOOK_KEY   the signature_key the tool shows when you press "Connect" in Settings > Close CRM webhook
//   PP_API_URL          the tool's Apps Script web app URL (https://script.google.com/macros/s/.../exec)
//   PP_WEBHOOK_SECRET   a long random string; the same value goes in Apps Script Script Properties as WEBHOOK_SECRET
import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

function readRaw(req) { return new Promise((resolve, reject) => { let data = ''; req.setEncoding('utf8'); req.on('data', c => data += c); req.on('end', () => resolve(data)); req.on('error', reject); }); }

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'POST only; this endpoint is for Close CRM' }); return; }
  const missing = ['CLOSE_WEBHOOK_KEY', 'PP_API_URL', 'PP_WEBHOOK_SECRET'].filter(k => !process.env[k]);
  if (missing.length) { console.error('close-webhook: missing env', missing.join(',')); res.status(500).json({ ok: false, error: 'missing env: ' + missing.join(',') }); return; }
  const raw = await readRaw(req);
  const ts = req.headers['close-sig-timestamp'], sig = req.headers['close-sig-hash'];
  const expected = crypto.createHmac('sha256', Buffer.from(process.env.CLOSE_WEBHOOK_KEY, 'hex')).update(String(ts || '') + raw).digest('hex');
  if (!ts || !sig || expected !== sig) { console.warn('close-webhook: bad signature', { ts: !!ts, sig: !!sig }); res.status(401).json({ ok: false, error: 'bad signature' }); return; }
  let body; try { body = JSON.parse(raw); } catch (e) { res.status(400).json({ ok: false, error: 'not json' }); return; }
  const ev = body.event || {};
  // the whole event goes through: the tool updates its email log, meetings, lead index and follow-up state from ev.data
  const event = { id: ev.id, type: ev.object_type, action: ev.action, objectId: ev.object_id, leadId: ev.lead_id || (ev.data && ev.data.lead_id) || '', at: ev.date_created, data: ev.data || null, previous: ev.previous_data || null, changed: ev.changed_fields || [], meta: ev.meta || {} };
  try {
    // Apps Script answers a POST with a 302 to a googleusercontent URL that serves the result; following it is expected
    const r = await fetch(process.env.PP_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pp: true, action: 'closeEvent', secret: process.env.PP_WEBHOOK_SECRET, event }), redirect: 'follow' });
    const text = await r.text();
    let reply = null; try { reply = JSON.parse(text); } catch (e) {}
    const ok = reply && reply.success === true;
    console.log('close-webhook', event.type, event.action, event.objectId, '->', r.status, ok ? 'applied ' + ((reply.applied || []).join('; ') || 'nothing to do') : text.slice(0, 160));
    if (!ok) { res.status(502).json({ ok: false, forwarded: r.status, reply: text.slice(0, 300) }); return; }   // Close CRM retries non-2xx
    res.status(200).json({ ok: true, applied: reply.applied || [], duplicate: !!reply.duplicate });
  } catch (e) {
    console.error('close-webhook: forward failed', String(e && e.message || e));
    res.status(500).json({ ok: false, error: String(e && e.message || e) });
  }
}
