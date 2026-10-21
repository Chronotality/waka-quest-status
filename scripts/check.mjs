// Waka Quest status checks (owner 21-10-2026: a status page outside the app's own hosting). Runs in GitHub Actions every
// 10 minutes (.github/workflows/check.yml) with only GitHub's own short-lived token: no own keys, no code from others.
// For every check in checks.json: one request (15 s at most), one retry after 10 s when it fails. Writes:
//   data/state.json  the current state per check (ok, http code, time, since when, failures in a row)
//   data/days.json   per check per day (Paramaribo time) the runs that were ok and all runs, the last 90 days
// A check that fails on two runs in a row opens a GitHub issue "Storing: <id>" (GitHub mails and pushes it to the owner);
// when it works again the issue gets a comment and is closed. Nothing personal is stored; all URLs are public.
// Locally (no token): node scripts/check.mjs  -> writes the files, prints what it would open or close.
import fs from 'node:fs';

const CFG = JSON.parse(fs.readFileSync('checks.json', 'utf8'));
const read = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const state = read('data/state.json', { checks: {} }), days = read('data/days.json', {});
const DOWN_AFTER = 2, KEEP_DAYS = 90;
const now = new Date();
const day = new Date(now.getTime() - 3 * 3600e3).toISOString().slice(0, 10); // Paramaribo is UTC-3, all year

async function probe({ url, contains }) {
  const t0 = Date.now(), ac = new AbortController(), timer = setTimeout(() => ac.abort(), 15000);
  try {
    const r = await fetch(url, { signal: ac.signal, redirect: 'follow', headers: { 'user-agent': 'waka-quest-status', 'cache-control': 'no-cache' } });
    const body = contains ? await r.text() : '';
    const ok = r.ok && (!contains || body.includes(contains));
    return { ok, code: r.status, ms: Date.now() - t0, why: ok ? '' : r.ok ? 'text missing' : 'http ' + r.status };
  } catch (e) {
    return { ok: false, code: 0, ms: Date.now() - t0, why: e.name === 'AbortError' ? 'timeout' : String(e.cause?.code || e.message).slice(0, 80) };
  } finally { clearTimeout(timer); }
}

// GitHub issues: only in Actions (GITHUB_TOKEN and GITHUB_REPOSITORY are set there)
const TOKEN = process.env.GITHUB_TOKEN, REPO = process.env.GITHUB_REPOSITORY;
async function gh(path, body, method = 'POST') {
  if (!TOKEN || !REPO) { console.log(`(local, not sent) ${method} ${path}`, body?.title || body?.body || ''); return {}; }
  const r = await fetch(`https://api.github.com/repos/${REPO}${path}`, { method, headers: { authorization: `Bearer ${TOKEN}`, accept: 'application/vnd.github+json', 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) console.log('github', method, path, r.status, (await r.text()).slice(0, 200));
  return r.ok ? r.json() : {};
}

const results = await Promise.all(CFG.checks.map(async c => {
  let res = await probe(c);
  if (!res.ok) { await new Promise(r => setTimeout(r, 10000)); res = await probe(c); }
  return [c, res];
}));

for (const [c, res] of results) {
  const prev = state.checks[c.id] || {};
  const s = { ok: res.ok, code: res.code, ms: res.ms, why: res.why, since: prev.ok === res.ok && prev.since ? prev.since : now.toISOString(), fails: res.ok ? 0 : (prev.fails || 0) + 1, issue: prev.issue || null };
  if (!res.ok && s.fails === DOWN_AFTER && !s.issue) {
    const i = await gh('/issues', { title: `Storing: ${c.id}`, labels: ['storing'], body: `**${c.id}** (${c.url}) werkt niet sinds ${prev.since || now.toISOString()}.\n\nLaatste controle: ${res.why} (http ${res.code}, ${res.ms} ms).\n\nDe statuspagina staat op storing. Dit bericht sluit vanzelf zodra het weer werkt.` });
    s.issue = i.number || 'local';
  }
  if (res.ok && s.issue) {
    if (typeof s.issue === 'number') {
      await gh(`/issues/${s.issue}/comments`, { body: `Werkt weer sinds ${now.toISOString()} (http ${res.code}, ${res.ms} ms).` });
      await gh(`/issues/${s.issue}`, { state: 'closed' }, 'PATCH');
    } else console.log('(local) would close the issue for', c.id);
    s.issue = null;
  }
  state.checks[c.id] = s;
  const d = (days[c.id] ||= {}); const cell = (d[day] ||= [0, 0]); cell[0] += res.ok ? 1 : 0; cell[1] += 1;
  for (const k of Object.keys(d).sort().slice(0, -KEEP_DAYS)) delete d[k];
  console.log(`${res.ok ? 'ok  ' : 'FAIL'} ${c.id} ${res.code} ${res.ms} ms ${res.why}`);
}
for (const id of Object.keys(state.checks)) if (!CFG.checks.some(c => c.id === id)) delete state.checks[id]; // removed checks
state.checkedAt = now.toISOString();
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/state.json', JSON.stringify(state, null, 1) + '\n');
fs.writeFileSync('data/days.json', JSON.stringify(days) + '\n');
