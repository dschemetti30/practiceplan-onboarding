// PracticePlan admin API layer on Vercel.
// Sits in front of the Apps Script deployment: reads are cached at Vercel's edge (fast, stale-while-revalidate),
// writes pass straight through. The Google Sheet stays the store; Apps Script keeps all its logic.
//
// Setup: add APPS_SCRIPT_URL (the /exec URL) in the Vercel project's Environment Variables, redeploy.
// The admin page detects this endpoint and uses it automatically; without it, it falls back to JSONP.

const READ = /^(get|bootstrap|ppPing|buildAudience|search|list)/i;
const NO_CACHE = new Set(['getActivity']);                      // always live
const SHORT = { ppPing: 5 };                                      // seconds of edge cache for specific reads
const DEFAULT_SMAXAGE = 45, SWR = 900;                            // fresh for 45s, then served stale while a refresh runs (up to 15 min)

module.exports = async function handler(req, res) {
  const upstream = process.env.APPS_SCRIPT_URL;
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!upstream) return res.status(500).json({ success: false, error: 'APPS_SCRIPT_URL is not set on this Vercel project' });

  try {
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      const r = await fetch(upstream, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body, redirect: 'follow' });
      const text = await r.text();
      res.setHeader('Cache-Control', 'no-store');
      return send(res, text);
    }
    const q = new URLSearchParams(req.query || {});
    q.delete('callback'); q.delete('rev');                        // rev only exists to vary the cache key after a write
    const action = q.get('action') || '';
    const url = upstream + (upstream.includes('?') ? '&' : '?') + q.toString();
    const r = await fetch(url, { redirect: 'follow' });
    const text = await r.text();
    const isRead = READ.test(action) && !NO_CACHE.has(action) && /"success"\s*:\s*true/.test(text.slice(0, 200));
    if (isRead) {
      const s = SHORT[action] !== undefined ? SHORT[action] : DEFAULT_SMAXAGE;
      res.setHeader('Cache-Control', `public, s-maxage=${s}, stale-while-revalidate=${SWR}`);
      res.setHeader('Vary', 'Accept');
    } else res.setHeader('Cache-Control', 'no-store');
    return send(res, text);
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ success: false, error: 'Upstream failed: ' + (e && e.message) });
  }
};

function send(res, text) {
  // Apps Script answers JSONP with a callback wrapper only when asked; we never ask, so this is plain JSON. Guard anyway.
  const m = text.match(/^\s*[\w$]+\((.*)\)\s*;?\s*$/s);
  const json = m ? m[1] : text;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).send(json);
}
