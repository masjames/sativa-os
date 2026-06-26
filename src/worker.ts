const SECTIONS = [
  'entities',
  'ledger',
  'ventures',
  'obligations',
  'decisions',
  'weekly',
  'intentions',
  'worries',
  'journal',
  'captures',
] as const;

type Section = (typeof SECTIONS)[number];

type Entry = {
  id: string;
  section: Section;
  title: string;
  body: string;
  status: string;
  priority: number;
  due_date: string | null;
  amount: number | null;
  metadata: string;
  created_at: string;
  updated_at: string;
};

type NewEntry = {
  section?: string;
  title?: string;
  body?: string;
  status?: string;
  priority?: number;
  due_date?: string | null;
  amount?: number | null;
  metadata?: unknown;
};

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PATCH, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { headers: jsonHeaders });

    const url = new URL(request.url);

    try {
      if (url.pathname === '/') return htmlResponse(renderApp());
      if (url.pathname === '/mcp') return jsonResponse(mcpManifest(url.origin));
      if (url.pathname === '/health') return jsonResponse({ ok: true, service: 'sativa-os', auth: 'disabled-for-test' });
      if (url.pathname === '/api/sections') return jsonResponse({ sections: SECTIONS });
      if (url.pathname === '/api/daily-brief') return jsonResponse(await dailyBrief(env));
      if (url.pathname === '/api/priority') return jsonResponse({ priority: await getPriority(env) });
      if (url.pathname === '/api/intentions') return jsonResponse({ intentions: await listEntries(env, 'intentions') });
      if (url.pathname === '/api/worries') return jsonResponse({ worries: await listEntries(env, 'worries') });
      if (url.pathname === '/api/obligations') return jsonResponse({ obligations: await listEntries(env, 'obligations') });

      if (url.pathname === '/api/entries' && request.method === 'GET') {
        const section = url.searchParams.get('section');
        return jsonResponse({ entries: await listEntries(env, parseSection(section, false)) });
      }

      if (url.pathname === '/api/entries' && request.method === 'POST') {
        const payload = await readJson<NewEntry>(request);
        return jsonResponse({ entry: await createEntry(env, payload) }, 201);
      }

      if (url.pathname === '/api/capture' && request.method === 'POST') {
        const payload = await readJson<NewEntry>(request);
        return jsonResponse({ entry: await createEntry(env, { ...payload, section: 'captures' }) }, 201);
      }

      if (url.pathname === '/api/journal' && request.method === 'POST') {
        const payload = await readJson<NewEntry>(request);
        return jsonResponse({ entry: await createEntry(env, { ...payload, section: 'journal' }) }, 201);
      }

      if (url.pathname === '/api/decision' && request.method === 'POST') {
        const payload = await readJson<NewEntry>(request);
        return jsonResponse({ entry: await createEntry(env, { ...payload, section: 'decisions' }) }, 201);
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return jsonResponse({ error: message }, message.startsWith('Invalid') || message.startsWith('Missing') ? 400 : 500);
    }
  },
};

async function dailyBrief(env: Env) {
  const [priority, intentions, worries, obligations, decisions, ledger] = await Promise.all([
    getPriority(env),
    listEntries(env, 'intentions', 5),
    listEntries(env, 'worries', 5),
    listEntries(env, 'obligations', 5),
    listEntries(env, 'decisions', 5),
    listEntries(env, 'ledger', 5),
  ]);

  return {
    date: new Date().toISOString().slice(0, 10),
    question: 'What should Adit pay attention to, build, sell, or ignore today so Sativa compounds?',
    priority,
    intentions,
    worries,
    obligations,
    decisions,
    ledger,
    calendar: { status: 'not-connected', items: [] },
    warnings: [...worries.filter((item) => item.status === 'open'), ...obligations.filter((item) => item.status === 'open')].slice(0, 5),
  };
}

async function getPriority(env: Env): Promise<Entry | null> {
  const result = await env.DB.prepare(
    `SELECT * FROM entries
     WHERE status = 'open' AND section IN ('obligations','decisions','intentions','ventures','captures')
     ORDER BY priority ASC, due_date IS NULL, due_date ASC, created_at ASC
     LIMIT 1`,
  ).first<Entry>();
  return result ?? null;
}

async function listEntries(env: Env, section?: Section, limit = 50): Promise<Entry[]> {
  if (section) {
    const result = await env.DB.prepare('SELECT * FROM entries WHERE section = ? ORDER BY updated_at DESC LIMIT ?')
      .bind(section, limit)
      .all<Entry>();
    return result.results ?? [];
  }

  const result = await env.DB.prepare('SELECT * FROM entries ORDER BY updated_at DESC LIMIT ?').bind(limit).all<Entry>();
  return result.results ?? [];
}

async function createEntry(env: Env, payload: NewEntry): Promise<Entry> {
  const section = parseSection(payload.section ?? 'captures', true);
  const title = sanitizeText(payload.title, 'Missing title');
  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  const status = typeof payload.status === 'string' && payload.status.trim() ? payload.status.trim() : 'open';
  const priority = Number.isFinite(payload.priority) ? Number(payload.priority) : 3;
  const dueDate = typeof payload.due_date === 'string' && payload.due_date.trim() ? payload.due_date.trim() : null;
  const amount = typeof payload.amount === 'number' && Number.isFinite(payload.amount) ? payload.amount : null;
  const metadata = JSON.stringify(payload.metadata ?? {});
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO entries (id, section, title, body, status, priority, due_date, amount, metadata, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, section, title, body, status, priority, dueDate, amount, metadata, now, now)
    .run();

  const entry = await env.DB.prepare('SELECT * FROM entries WHERE id = ?').bind(id).first<Entry>();
  if (!entry) throw new Error('Failed to create entry');
  return entry;
}

function parseSection(value: string | null | undefined, required: true): Section;
function parseSection(value: string | null | undefined, required?: false): Section | undefined;
function parseSection(value: string | null | undefined, required = false): Section | undefined {
  if (!value) {
    if (required) throw new Error('Missing section');
    return undefined;
  }
  if (!SECTIONS.includes(value as Section)) throw new Error(`Invalid section: ${value}`);
  return value as Section;
}

async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error('Invalid JSON body');
  }
}

function sanitizeText(value: unknown, error: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(error);
  return value.trim();
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), { status, headers: jsonHeaders });
}

function htmlResponse(body: string): Response {
  return new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

function mcpManifest(origin: string) {
  return {
    name: 'sativa-os',
    description: 'Private Sativa OS tool surface for daily brief, priorities, intentions, worries, captures, journals, and decisions.',
    auth: 'disabled-for-test',
    tools: [
      { name: 'pull_daily_brief', method: 'GET', url: `${origin}/api/daily-brief` },
      { name: 'pull_priority', method: 'GET', url: `${origin}/api/priority` },
      { name: 'pull_intentions', method: 'GET', url: `${origin}/api/intentions` },
      { name: 'pull_worries', method: 'GET', url: `${origin}/api/worries` },
      { name: 'get_obligations', method: 'GET', url: `${origin}/api/obligations` },
      { name: 'capture_input', method: 'POST', url: `${origin}/api/capture` },
      { name: 'log_journal_entry', method: 'POST', url: `${origin}/api/journal` },
      { name: 'log_decision', method: 'POST', url: `${origin}/api/decision` },
    ],
  };
}

function renderApp(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sativa OS</title>
  <style>
    :root { color-scheme: dark; --bg:#07120d; --panel:#0f2017; --line:#214832; --text:#e8fff0; --muted:#98b8a4; --accent:#8dff9f; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at top, #163c25, var(--bg) 42rem); color:var(--text); }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 18px 56px; }
    header { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom:24px; }
    h1 { margin:0; font-size: clamp(2.1rem, 8vw, 5.4rem); letter-spacing:-0.08em; line-height:0.9; }
    h2 { margin:0 0 12px; }
    p { color:var(--muted); }
    .badge { border:1px solid var(--line); border-radius:999px; padding:8px 12px; color:var(--accent); background:rgba(15,32,23,.8); white-space:nowrap; }
    .grid { display:grid; grid-template-columns: repeat(12, 1fr); gap:16px; }
    .card { grid-column: span 4; background:rgba(15,32,23,.86); border:1px solid var(--line); border-radius:24px; padding:18px; box-shadow: 0 20px 80px rgba(0,0,0,.22); }
    .wide { grid-column: span 8; }
    .full { grid-column: 1 / -1; }
    input, textarea, select, button { width:100%; border-radius:14px; border:1px solid var(--line); background:#09150f; color:var(--text); padding:12px; font:inherit; }
    textarea { min-height:96px; resize:vertical; }
    button { cursor:pointer; background:linear-gradient(135deg, #d5ff74, #6dff9a); color:#07120d; font-weight:800; border:0; }
    ul { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
    li { border:1px solid var(--line); border-radius:16px; padding:12px; background:#0a1710; }
    small { color:var(--muted); }
    code { color:var(--accent); }
    @media (max-width: 860px) { header { display:block; } .card, .wide { grid-column: 1 / -1; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        <h1>Sativa OS</h1>
        <p>Private clarity surface. Auth intentionally skipped for this test deployment.</p>
      </div>
      <div class="badge">Worker + D1 · test mode</div>
    </header>
    <section class="grid">
      <article class="card wide"><h2>Daily Brief</h2><div id="brief"><p>Loading…</p></div></article>
      <article class="card"><h2>Capture</h2><form id="capture"><input name="title" placeholder="What needs attention?" required><textarea name="body" placeholder="Context"></textarea><select name="section"><option value="captures">Capture</option><option value="intentions">Intention</option><option value="worries">Worry</option><option value="obligations">Obligation</option><option value="decisions">Decision</option><option value="ledger">Ledger</option><option value="ventures">Venture</option><option value="entities">Entity</option></select><br><br><button>Save to Sativa OS</button></form></article>
      <article class="card"><h2>Intentions</h2><ul id="intentions"></ul></article>
      <article class="card"><h2>Worries</h2><ul id="worries"></ul></article>
      <article class="card"><h2>Obligations</h2><ul id="obligations"></ul></article>
      <article class="card full"><h2>Tool endpoints</h2><p><code>/mcp</code>, <code>/api/daily-brief</code>, <code>/api/priority</code>, <code>/api/capture</code>, <code>/api/journal</code>, <code>/api/decision</code></p></article>
    </section>
  </main>
  <script>
    const api = (path, options) => fetch(path, options).then((response) => response.json());
    const item = (entry) => '<li><strong>' + escapeHtml(entry.title) + '</strong><br><small>' + escapeHtml(entry.section) + ' · priority ' + entry.priority + '</small><p>' + escapeHtml(entry.body || '') + '</p></li>';
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    async function load() {
      const brief = await api('/api/daily-brief');
      document.querySelector('#brief').innerHTML = '<p><strong>Question:</strong> ' + escapeHtml(brief.question) + '</p>' + (brief.priority ? item(brief.priority) : '<p>No priority yet. Capture one.</p>');
      document.querySelector('#intentions').innerHTML = brief.intentions.map(item).join('') || '<li>No intentions yet.</li>';
      document.querySelector('#worries').innerHTML = brief.worries.map(item).join('') || '<li>No worries yet.</li>';
      document.querySelector('#obligations').innerHTML = brief.obligations.map(item).join('') || '<li>No obligations yet.</li>';
    }
    document.querySelector('#capture').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      await api('/api/entries', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(Object.fromEntries(form)) });
      event.currentTarget.reset();
      await load();
    });
    load();
  </script>
</body>
</html>`;
}
