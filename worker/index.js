// Waka Quest status: the alarm clock (owner 21-10-2026, "optie 1 met Cloudflare"). GitHub starts its own scheduled
// runs only now and then (2 in 9 hours on 21-10), so this Cloudflare Worker starts the checks itself every 10 minutes:
// one call to GitHub "run the workflow checks.yml on main". It checks nothing itself and stores nothing.
// GH_TOKEN (a Worker secret, set by the owner in the Cloudflare dashboard) is a fine-grained GitHub token for the
// repository Chronotality/waka-quest-status only, with the permission Actions: read and write only; it cannot read or
// change any code. Cron trigger: */10 * * * * (set in the dashboard, Settings > Trigger events).
// Opening the Worker's address only says what it is; it never starts anything (nobody can use it to start runs).
const DISPATCH = 'https://api.github.com/repos/Chronotality/waka-quest-status/actions/workflows/check.yml/dispatches';

async function startChecks(env) {
  if (!env.GH_TOKEN) { console.log('no GH_TOKEN secret: nothing started'); return; }
  const r = await fetch(DISPATCH, {
    method: 'POST',
    headers: { authorization: `Bearer ${env.GH_TOKEN}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'user-agent': 'waka-status-cron', 'content-type': 'application/json' },
    body: JSON.stringify({ ref: 'main' }),
  });
  // 204 = started; 401/403 = the token is wrong or expired (renew it, see README), 404 = the token misses this repository
  if (r.status !== 204) console.log('GitHub did not start the checks:', r.status, (await r.text()).slice(0, 200));
  else console.log('checks started');
}

export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(startChecks(env)); },
  async fetch() { return new Response('Waka Quest status: the alarm clock for the checks (every 10 minutes). See status.waka-quest.com', { headers: { 'content-type': 'text/plain; charset=utf-8' } }); },
};
