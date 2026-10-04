#!/usr/bin/env node
/**
 * Copy table data from one Supabase project into another.
 *
 *   SOURCE (original, read-only)  ──▶  TARGET (woodex2030, writable)
 *
 * Design rule: the original project is never written to. That is enforced in
 * code, not by care:
 *
 *   1. The source is accessed with raw HTTP GET only. No client capable of a
 *      write is ever constructed for it.
 *   2. PROTECTED_REFS is a denylist. If TARGET_URL names one of them, the
 *      script exits before a single request is made.
 *   3. Source and target must be different projects.
 *   4. Writes require --apply. The default run reports counts and stops.
 *
 * Credentials come from the environment. NEVER hardcode them, and never commit
 * a file containing them.
 *
 *   SOURCE_URL, SOURCE_KEY  - original project (KEY may be publishable if RLS
 *                             allows the reads; a secret key reads everything)
 *   TARGET_URL, TARGET_KEY  - woodex2030 (KEY must be a SECRET key - a
 *                             publishable key cannot write past RLS)
 *
 * Usage:
 *   node scripts/copy-project-data.mjs                 # dry-run
 *   node scripts/copy-project-data.mjs --list          # list tables + counts
 *   node scripts/copy-project-data.mjs --apply         # actually copy
 *   node scripts/copy-project-data.mjs --apply --only=products,categories
 *   node scripts/copy-project-data.mjs --apply --exclude=audit_log
 *   node scripts/copy-project-data.mjs --verify        # compare row counts
 */

// ── the original project. Writing here is always a bug. ────────────────────
const PROTECTED_REFS = ['vocqqajpznqyopjcymer'];

const PAGE = 1000;

const env = (k) => (process.env[k] || '').trim();

const die = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

const SOURCE_URL = env('SOURCE_URL').replace(/\/$/, '');
const SOURCE_KEY = env('SOURCE_KEY');
const TARGET_URL = env('TARGET_URL').replace(/\/$/, '');
const TARGET_KEY = env('TARGET_KEY');

const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const LIST = argv.includes('--list');
const VERIFY = argv.includes('--verify');
const listArg = (flag) => {
  const hit = argv.find((a) => a.startsWith(`--${flag}=`));
  return hit ? hit.split('=')[1].split(',').map((s) => s.trim()).filter(Boolean) : null;
};
const ONLY = listArg('only');
const EXCLUDE = listArg('exclude');

// ── guards: all of these run before any network I/O ────────────────────────
if (!SOURCE_URL || !SOURCE_KEY) {
  die('SOURCE_URL and SOURCE_KEY are required (the original project, read-only).');
}
if (!TARGET_URL || !TARGET_KEY) {
  die('TARGET_URL and TARGET_KEY are required (woodex2030, the copy destination).');
}

const refOf = (url) => {
  const m = url.match(/https?:\/\/([a-z0-9]+)\.supabase\./i);
  return m ? m[1] : null;
};
const SOURCE_REF = refOf(SOURCE_URL);
const TARGET_REF = refOf(TARGET_URL);

if (!SOURCE_REF || !TARGET_REF) {
  die('Could not read a project ref from SOURCE_URL / TARGET_URL. Expected https://<ref>.supabase.co');
}
if (SOURCE_REF === TARGET_REF) {
  die(`SOURCE and TARGET are the same project (${SOURCE_REF}). Refusing to copy onto itself.`);
}
for (const bad of PROTECTED_REFS) {
  if (TARGET_REF === bad) {
    die(
      `TARGET is ${bad}, which is on the protected list (the original project).\n` +
        `  This script may only READ from it. Set TARGET_URL to woodex2030 instead.`,
    );
  }
}
// A publishable/anon key cannot write past RLS, so the copy would silently
// insert nothing. Reject it up front rather than after a long run.
const isSecret = (k) => k.startsWith('sb_secret_') || /\.service_role\./.test(k) || /"role":"service_role"/.test(k);
const isPublishable = (k) => k.startsWith('sb_publishable_') || /\.anon\./.test(k) || /"role":"anon"/.test(k);
const looksLikeJwt = (k) => k.split('.').length === 3 && k.startsWith('eyJ');

if (!isSecret(TARGET_KEY)) {
  if (isPublishable(TARGET_KEY) || (looksLikeJwt(TARGET_KEY) && !isSecret(TARGET_KEY))) {
    die('TARGET_KEY looks publishable/anon. Copying data needs a SECRET key (sb_secret_...).');
  }
}
if (isSecret(SOURCE_KEY) && SOURCE_REF && PROTECTED_REFS.includes(SOURCE_REF)) {
  // Allowed - reading the original is the whole point - but say so loudly.
  console.log(`ℹ SOURCE is the protected original (${SOURCE_REF}). Read-only: GET requests only.\n`);
}

// ── HTTP helpers ───────────────────────────────────────────────────────────
// The source only ever gets GET. There is deliberately no sourcePost/PATCH.
const sourceGet = async (path, headers = {}) => {
  const res = await fetch(`${SOURCE_URL}/rest/v1${path}`, {
    method: 'GET',
    headers: { apikey: SOURCE_KEY, Authorization: `Bearer ${SOURCE_KEY}`, ...headers },
  });
  return res;
};

const targetReq = async (path, method, body, headers = {}) => {
  const res = await fetch(`${TARGET_URL}/rest/v1${path}`, {
    method,
    headers: {
      apikey: TARGET_KEY,
      Authorization: `Bearer ${TARGET_KEY}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return res;
};

const bodyText = async (res) => (await res.text()).slice(0, 400);

/** Reads every row of a table, paginating with Range headers. */
const readAll = async (table) => {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const res = await sourceGet(`/${table}?select=*`, {
      Range: `${from}-${from + PAGE - 1}`,
      'Range-Unit': 'items',
    });
    if (!res.ok) throw new Error(`read ${table}: HTTP ${res.status} ${await bodyText(res)}`);
    const chunk = await res.json();
    if (!Array.isArray(chunk)) throw new Error(`read ${table}: unexpected payload`);
    rows.push(...chunk);
    if (chunk.length < PAGE) break;
    if (from > 200_000) throw new Error(`read ${table}: exceeded 200k rows, aborting`);
  }
  return rows;
};

/** Row count without fetching the rows (HEAD + content-range). */
const countSource = async (table) => {
  const res = await sourceGet(`/${table}?select=*`, { Range: '0-0', Prefer: 'count=exact' });
  if (!res.ok) return null;
  const cr = res.headers.get('content-range');
  if (!cr || !cr.includes('/')) return null;
  const total = cr.split('/')[1];
  return total === '*' ? null : Number(total);
};

/** Table names come from the PostgREST OpenAPI document at the API root. */
const discoverTables = async () => {
  const res = await sourceGet('/');
  if (!res.ok) die(`Could not read the source API root: HTTP ${res.status} ${await bodyText(res)}`);
  const spec = await res.json();
  const names = Object.keys(spec.definitions || {});
  if (!names.length) die('Source exposed no tables. Check SOURCE_KEY has read access.');
  return names.sort();
};

const selected = (all) => {
  let t = all;
  if (ONLY) t = t.filter((n) => ONLY.includes(n));
  if (EXCLUDE) t = t.filter((n) => !EXCLUDE.includes(n));
  return t;
};

// ── main ───────────────────────────────────────────────────────────────────
console.log('Woodex project data copy');
console.log(`  SOURCE (read-only) : ${SOURCE_REF}`);
console.log(`  TARGET (writable)  : ${TARGET_REF}`);
console.log(`  mode               : ${APPLY ? 'APPLY' : 'DRY-RUN'}${VERIFY ? ' +verify' : ''}\n`);

const tables = selected(await discoverTables());
if (!tables.length) die('No tables left after --only/--exclude filtering.');

if (LIST || VERIFY) {
  console.log(`${'table'.padEnd(34)}${'source'.padStart(9)}${'target'.padStart(9)}`);
  let srcTotal = 0;
  for (const t of tables) {
    const s = await countSource(t);
    let g = null;
    if (VERIFY) {
      const r = await targetReq(`/${t}?select=*`, 'GET', undefined, {
        Range: '0-0',
        Prefer: 'count=exact',
      });
      if (r.ok) {
        const cr = r.headers.get('content-range');
        g = cr && cr.includes('/') && cr.split('/')[1] !== '*' ? Number(cr.split('/')[1]) : null;
      }
    }
    if (s !== null) srcTotal += s;
    console.log(
      t.padEnd(34) +
        String(s ?? '?').padStart(9) +
        String(VERIFY ? (g ?? '?') : '-').padStart(9) +
        (VERIFY && s !== null && g !== null && s !== g ? '   ⚠ differs' : ''),
    );
  }
  console.log(`\n${tables.length} tables, ${srcTotal} source rows.`);
  process.exit(0);
}

// Dry-run: measure the work without writing anything.
const staged = [];
let totalRows = 0;
for (const t of tables) {
  let rows;
  try {
    rows = await readAll(t);
  } catch (e) {
    console.log(`  ⚠ ${t}: skipped (${e.message.split('\n')[0]})`);
    continue;
  }
  if (!rows.length) {
    console.log(`  · ${t}: empty`);
    continue;
  }
  staged.push({ table: t, rows });
  totalRows += rows.length;
  console.log(`  ✓ ${t}: ${rows.length} rows`);
}

console.log(`\nRead ${totalRows} rows from ${staged.length} tables (source untouched).`);

if (!APPLY) {
  console.log('\nDRY-RUN complete - nothing was written.');
  console.log('Re-run with --apply to copy these rows into the target project.');
  process.exit(0);
}

// Writes go to the target only. FK order is unknown without the catalog, so
// insert in passes: whatever fails on FKs is retried after its parents land.
// The loop stops as soon as a pass makes no progress, so it cannot spin.
let pending = [...staged];
const done = new Map();
const failed = new Map();

for (let pass = 1; pending.length && pass <= 12; pass++) {
  console.log(`\n── pass ${pass}: ${pending.length} table(s) ──`);
  const next = [];
  for (const { table, rows } of pending) {
    const res = await targetReq(`/${table}`, 'POST', rows, {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    });
    if (res.ok) {
      done.set(table, rows.length);
      console.log(`  ✓ ${table}: ${rows.length} rows`);
    } else {
      const detail = await bodyText(res);
      const retryable = res.status === 409 || /foreign key|23503/i.test(detail);
      if (retryable) {
        next.push({ table, rows });
        console.log(`  ↻ ${table}: deferred (FK dependency)`);
      } else {
        failed.set(table, `HTTP ${res.status} ${detail}`);
        console.log(`  ✖ ${table}: HTTP ${res.status} ${detail.split('\n')[0]}`);
      }
    }
  }
  if (next.length === pending.length) {
    for (const { table } of next) failed.set(table, 'unresolved after all passes (likely a view, or a missing parent table)');
    pending = [];
    break;
  }
  pending = next;
}

console.log(`\n── result ──`);
console.log(`  copied : ${done.size} tables, ${[...done.values()].reduce((a, b) => a + b, 0)} rows`);
if (failed.size) {
  console.log(`  failed : ${failed.size} table(s)`);
  for (const [t, why] of failed) console.log(`           - ${t}: ${why}`);
}
console.log(`\n  SOURCE ${SOURCE_REF}: read-only throughout (${PROTECTED_REFS.includes(SOURCE_REF) ? 'protected original' : 'source'}).`);
console.log(`  TARGET ${TARGET_REF}: ${done.size} table(s) written.`);
console.log('\nNext: node scripts/copy-project-data.mjs --verify');
process.exit(failed.size ? 1 : 0);
