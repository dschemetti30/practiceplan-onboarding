// PracticePlan admin API layer on Vercel (ES module: this repo's package.json has "type": "module").
// Sits in front of the Apps Script deployment: reads are cached at Vercel's edge, writes pass straight through.
// Setup: Vercel > Settings > Environments > Production (and Preview) > Environment Variables > APPS_SCRIPT_URL = the /exec URL. Redeploy.

const READ = /^(get|bootstrap|ppPing|buildAudience|search|list)/i;
const NO_CACHE = new Set(['getActivity']);
const SHORT = { ppPing: 5 };
const DEFAULT_SMAXAGE = 45, SWR = 900;

export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') { res.status(204).end(); return; }
    const upstream = process.env.APPS_SCRIPT_URL;
    if (!upstream) { res.setHeader('Cache-Control', 'no-store'); res.status(200).json({ success: false, error: 'APPS_SCRIPT_URL is not set on this Vercel project' }); return; }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      const r = await fetch(upstream, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body, redirect: 'follow' });
      const text = await r.text();
      res.setHeader('Cache-Control', 'no-store');
      send(res, text); return;
    }

    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(req.query || {})) { if (k === 'callback' || k === 'rev') continue; q.append(k, Array.isArray(v) ? v[0] : String(v)); }
    const action = q.get('action') || '';
    const url = upstream + (upstream.includes('?') ? '&' : '?') + q.toString();
    const r = await fetch(url, { redirect: 'follow' });
    const text = await r.text();
    const isRead = READ.test(action) && !NO_CACHE.has(action) && /"success"\s*:\s*true/.test(text.slice(0, 200));
    if (isRead) {
      const s = SHORT[action] !== undefined ? SHORT[action] : DEFAULT_SMAXAGE;
      res.setHeader('Cache-Control', 'public, s-maxage=' + s + ', stale-while-revalidate=' + SWR);
    } else res.setHeader('Cache-Control', 'no-store');
    send(res, text);
  } catch (e) {
    try { res.setHeader('Cache-Control', 'no-store'); res.status(200).json({ success: false, error: 'API layer error: ' + (e && e.message ? e.message : String(e)) }); } catch (e2) { res.status(500).end(); }
  }
}

function send(res, text) {
  const m = /^\s*[\w$]+\(([\s\S]*)\)\s*;?\s*$/.exec(text);
  const json = m ? m[1] : text;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).send(json);
}
