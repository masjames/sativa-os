import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Business = { id: string; name: string; status: string; ownership?: Record<string, number>; revenue?: number; expenses?: number; investment?: number; netCash?: number; notes: string };
type Project = { id: string; business_id: string; business_name: string; name: string; status: string; horizon: string; priority: number; outcome: string; next_action: string; buubo_container_id: string | null; last_action?: string | null; last_action_at?: string | null };
type Metric = { business_id: string; business_name: string; shareholding: Record<string, number>; energy_hours_per_week: number; sustainability_score: number; vision_alignment_score: number; score_note: string };
type BusinessModelBlock = { business_id: string; block_key: string; block_name: string; elements: string[]; control_question: string; status?: string; updated_at?: string };
type OptionRow = { id: string; name: string };

type Change = { id: string; entity_type: string; entity_id: string; action: string; reason: string; created_at: string; label: string; sectionUrl: string; metadata?: Record<string, unknown> };
type MissionData = { source: string; loadedAt: string; summary: Record<string, any>; accounts: any[]; cashflow: { rows: any[] }; assets: any[]; businesses: Business[]; projects: Project[]; tax: Record<string, any>; mcp: string[] };
type ProjectPatch = Pick<Partial<Project>, 'name' | 'business_id' | 'status'>;
type DirectorData = { visionGoals: any[]; weeklyReviews: any[]; okrs: any[]; businesses: Business[]; projects: Project[]; mcp: string[] };

const nav = [
  ['/director', 'Director'],
  ['/projects', 'Projects'],
  ['/business-model', 'Business Model Canvas'],
  ['/mcp', 'MCP Manifest'],
] as const;

const bmcOrder = ['partners', 'activities', 'resources', 'value', 'relationships', 'channels', 'segments', 'costs', 'revenue'];
const bmcName: Record<string, string> = {
  partners: 'Key Partnerships', activities: 'Key Activities', resources: 'Key Resources', value: 'Value Propositions', relationships: 'Customer Relationships', channels: 'Channels', segments: 'Customer Segments', costs: 'Cost Structure', revenue: 'Revenue Streams',
};

function rupiah(value: unknown) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

function useCachedJson<T>(key: string, url: string, refreshMs = 0) {
  const [data, setData] = useState<T | null>(() => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') as T | null; } catch { return null; }
  });
  const [status, setStatus] = useState(data ? 'showing browser cache instantly; refreshing D1...' : 'loading from Cloudflare D1...');
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    async function load(background = false) {
      const started = performance.now();
      try {
        const fresh = await getJson<T>(url);
        if (cancelled) return;
        const previous = localStorage.getItem(key);
        localStorage.setItem(key, JSON.stringify(fresh));
        setData(fresh);
        setStatus(`${background && previous && previous !== JSON.stringify(fresh) ? 'updated from Cloudflare D1' : 'loaded from Cloudflare D1'} in ${Math.round(performance.now() - started)}ms; cached in browser`);
      } catch (error) {
        if (!cancelled) setStatus(`load failed: ${error instanceof Error ? error.message : 'unknown error'}`);
      }
    }
    load(false);
    if (refreshMs > 0) timer = window.setInterval(() => load(true), refreshMs);
    return () => { cancelled = true; if (timer) window.clearInterval(timer); };
  }, [key, url, refreshMs]);
  return { data, status, setData, setStatus };
}

function App() {
  const path = window.location.pathname;
  return <Shell>{path === '/director' ? <Director /> : path === '/projects' ? <Projects /> : path === '/business-model' ? <BusinessModelCanvas /> : path === '/add-transaction' ? <AddTransaction /> : <MissionControl />}</Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const changes = useCachedJson<{ changes: Change[] }>('sativa:status-changes:react:v1', '/api/status-changes', 12000);
  return <main><header className="top"><div className="brand"><a className="title" href="/">SATIVA OS</a><a className="quick" href="/add-transaction">+transaction</a></div><nav>{nav.map(([href, label]) => <a key={href} className={window.location.pathname === href ? 'active' : ''} href={href}>{label}</a>)}</nav></header><StatusBar changes={changes.data?.changes || []} status={changes.status} />{children}</main>;
}

function MissionControl() {
  const { data, status, setData, setStatus } = useCachedJson<MissionData>('sativa:mission:react:v2', '/api/mission-control-data');
  if (!data) return <Status text={status} />;
  const s = data.summary;
  async function updateProject(project: Project, patch: ProjectPatch) {
    setStatus(`updating ${project.name}...`);
    const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch) });
    if (!response.ok) { setStatus(`project update failed: ${await response.text()}`); return; }
    const fresh = await getJson<MissionData>('/api/mission-control-data');
    localStorage.setItem('sativa:mission:react:v2', JSON.stringify(fresh));
    localStorage.setItem('sativa:projects:react:v2', JSON.stringify({ projects: fresh.projects }));
    setData(fresh);
    setStatus(`updated ${project.name}`);
  }
  return <><Status text={status} /><ProjectControlBoard projects={data.projects || []} businesses={data.businesses || []} onUpdate={updateProject} /><MiniBmcTiles businesses={data.businesses} /><section><h2>2. Financial / Money Flow</h2><div className="metrics"><Metric label="Free cash" value={rupiah(s.freeCash)} /><Metric label="Restricted assets" value={rupiah(s.restrictedAssets)} /><Metric label="Savings" value={rupiah(s.savings)} /><Metric label="Total tracked" value={rupiah(s.totalTrackedAssets)} /></div></section><section><h2>3. Horizon of Controls</h2><div className="thirds"><p>Critical control: keep WARAS separate from spendable cash.</p><p>Next cash action: create, collect, sell, deliver, or recover cash.</p><p>MCP Manifest is available in the top menu.</p></div></section><section><h2>4. All Detailed Data</h2><h3>Accounts</h3><AccountBalanceAudit accounts={data.accounts} onChanged={async () => { const fresh = await getJson<MissionData>('/api/mission-control-data'); localStorage.setItem('sativa:mission:react:v2', JSON.stringify(fresh)); setData(fresh); }} /><h3>Cashflow</h3><Table headers={['Date','Account','Business','In','Out','Balance','Notes']} rows={data.cashflow.rows.map((r) => [r.transaction_date, r.account_name, r.business_name, rupiah(r.cash_in), rupiah(r.cash_out), rupiah(r.running_balance), r.description])} /></section></>;
}


function AccountBalanceAudit({ accounts, onChanged }: { accounts: any[]; onChanged: () => Promise<void> }) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('Adjust balance first if real pocket balance differs; Sativa will create a required reconciliation entry with category.');
  async function reconcile(account: any) {
    const raw = drafts[account.id];
    if (raw === undefined || raw === '') { setStatus(`enter actual balance for ${account.name}`); return; }
    const actual = Number(raw);
    if (!Number.isFinite(actual)) { setStatus('actual balance must be a number'); return; }
    setStatus(`auditing ${account.name} balance...`);
    const response = await fetch('/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: `reconcile-${account.id}`, method: 'tools/call', params: { name: 'reconcile_account', arguments: { account_id: account.id, actual_balance: actual, reason: 'manual pocket balance audit before spending categorization' } } }) });
    const body = await response.json().catch(() => ({})) as { error?: { message?: string } };
    if (!response.ok || body.error) { setStatus(`balance audit failed: ${body.error?.message || response.statusText}`); return; }
    setDrafts({ ...drafts, [account.id]: '' });
    await onChanged();
    setStatus(`balance adjusted for ${account.name}; now add/recategorize spending entries at least by category.`);
  }
  return <div><p className="hint">Pocket balances are editable for quick audit. Each adjustment is saved as a reconciliation transaction, so later spending entries still need at least a category like coffee, dine out, or online shop.</p><Table headers={['Account','Type','Spendable','Current balance','Actual balance audit','Action']} rows={accounts.map((a) => [a.name, a.account_type, a.is_spendable ? 'yes' : 'no', rupiah(a.balance), <input key={`balance-${a.id}`} type="number" placeholder={String(a.balance)} value={drafts[a.id] || ''} onChange={(event) => setDrafts({ ...drafts, [a.id]: event.target.value })} />, <button key={`save-${a.id}`} onClick={() => reconcile(a)}>adjust balance</button>])} /><p className="hint">{status}</p></div>;
}

function Director() {
  const { data, status } = useCachedJson<DirectorData>('sativa:director:react:v2', '/api/director-data');
  const metrics = useCachedJson<{ metrics: Metric[] }>('sativa:metrics:react:v2', '/api/business-metrics');
  if (!data) return <Status text={status} />;
  return <><Status text={status} /><section><h2>Project Kanban State</h2><ProjectStateSummary projects={data.projects || []} /></section><section><h2>Sativa 300T Vision Alignment</h2><Table headers={['Goal','Horizon','Target','Status','Alignment']} rows={data.visionGoals.map((g) => [g.name, g.horizon, g.target_value, g.status, g.alignment_note])} /></section><section><h2>Weekly Review</h2><Table headers={['Week','Cash','Delivery','Business','Decisions','Next Actions']} rows={data.weeklyReviews.map((r) => [r.week_start, r.cash_review, r.delivery_review, r.business_review, r.decisions_needed, r.next_actions])} /></section><section><h2>Business Metrics</h2>{metrics.data ? <Table headers={['Business','Shareholding','Hours / week','Sustainability','Vision','Note']} rows={metrics.data.metrics.map((m) => [m.business_name, JSON.stringify(m.shareholding), String(m.energy_hours_per_week), String(m.sustainability_score), String(m.vision_alignment_score), m.score_note])} /> : <p>{metrics.status}</p>}</section></>;
}

function Projects() {
  const { data, status, setData, setStatus } = useCachedJson<{ projects: Project[] }>('sativa:projects:react:v2', '/api/projects', 15000);
  const sync = useCachedJson<any>('sativa:buubo-sync:react:v2', '/api/sync/buubo/status');
  if (!data) return <Status text={status} />;
  const groups = data.projects.reduce<Record<string, Project[]>>((acc, project) => { (acc[project.business_name] ||= []).push(project); return acc; }, {});
  async function act(project: Project, action: string) {
    setStatus(`${action} ${project.name}...`);
    const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}/action`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action }) });
    if (!response.ok) { setStatus(`project action failed: ${await response.text()}`); return; }
    const fresh = await getJson<{ projects: Project[] }>('/api/projects');
    localStorage.setItem('sativa:projects:react:v2', JSON.stringify(fresh));
    setData(fresh);
    setStatus(`${action} logged for ${project.name}`);
  }
  const ongoing = data.projects.filter((p) => laneFor(p.status) === 'doing').length;
  return <><Status text={`${status}; ongoing projects: ${ongoing}`} /><section><h2>Projects Horizon</h2><p>Every project is tied to one parent business. Buubo sync: {sync.data?.status || sync.status}</p>{Object.entries(groups).map(([business, projects]) => <div className="project-group" key={business}><h3>{business}</h3><Table headers={['Project','Status','Horizon','Priority','Outcome','Next Action','Actions','Last log']} rows={projects.map((p) => [p.name, p.status, p.horizon, String(p.priority), p.outcome, p.next_action, <ActionButtons key={p.id} project={p} onAction={act} />, p.last_action_at ? `${p.last_action} ${new Date(p.last_action_at).toLocaleString()}` : 'not logged'])} /></div>)}</section></>;
}

function BusinessModelCanvas() {
  const { data, status, setData, setStatus } = useCachedJson<{ businesses: Business[]; blocks: BusinessModelBlock[]; changes: { business_id: string; latest_updated_at: string | null; latest_changes: Change[] }[] }>('sativa:bmc:data:react:v2', '/api/business-model-data', 15000);
  const [businessId, setBusinessId] = useState(() => new URLSearchParams(window.location.search).get('business') || '');
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const selected = useMemo(() => data?.businesses.find((b) => b.id === businessId), [data, businessId]);
  if (!data) return <Status text={status} />;
  if (!selected) return <><Status text={status} /><section><h2>Business Model Canvas home</h2><p>Pick a business tile. Sativa OS no longer opens Adit / Sativa Personal by default.</p><div className="mini-tiles">{data.businesses.map((business) => { const change = data.changes.find((item) => item.business_id === business.id); return <button className="mini-tile" key={business.id} onClick={() => { window.history.replaceState(null, '', `/business-model?business=${encodeURIComponent(business.id)}`); setBusinessId(business.id); }}><strong>{business.name}</strong><span>Latest update: {change?.latest_updated_at ? new Date(change.latest_updated_at).toLocaleString() : 'not yet logged'}</span><span>{change?.latest_changes[0]?.reason || business.notes}</span></button>; })}</div></section></>;
  const selectedId = selected.id;
  const blocks = bmcOrder.map((key) => data.blocks.find((b) => b.business_id === selectedId && b.block_key === key) || { business_id: selectedId, block_key: key, block_name: bmcName[key], elements: [], control_question: '' });
  function startEdit() { setDrafts(Object.fromEntries(blocks.map((b) => [b.block_key, b.elements.join('\n')]))); setEditing(true); }
  function cancelEdit() { setDrafts({}); setEditing(false); setStatus('edit cancelled'); }
  async function refresh() { const fresh = await getJson<{ businesses: Business[]; blocks: BusinessModelBlock[]; changes: { business_id: string; latest_updated_at: string | null; latest_changes: Change[] }[] }>('/api/business-model-data'); localStorage.setItem('sativa:bmc:data:react:v2', JSON.stringify(fresh)); setData(fresh); setStatus('refreshed BMC data from Cloudflare D1 without reloading the page'); }
  async function saveAll() {
    setStatus('saving BMC blocks to Cloudflare D1...');
    const updated = await Promise.all(blocks.map((block) => fetch('/api/business-model', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ business_id: selectedId, block_key: block.block_key, elements_json: JSON.stringify((drafts[block.block_key] || '').split('\n').map((item) => item.trim()).filter(Boolean)), status: 'active', control_question: '' }) }).then((response) => response.json())));
    const fresh = await getJson<{ businesses: Business[]; blocks: BusinessModelBlock[]; changes: { business_id: string; latest_updated_at: string | null; latest_changes: Change[] }[] }>('/api/business-model-data');
    localStorage.setItem('sativa:bmc:data:react:v2', JSON.stringify(fresh));
    setData(fresh);
    setEditing(false);
    setStatus(`saved ${updated.length} BMC blocks`);
  }
  const selectedChanges = data.changes.find((item) => item.business_id === selectedId);
  return <><Status text={status} /><section className="canvas-wrap"><div className="business-tabs sticky-bmc-title"><strong>{selected.name}</strong>{data.businesses.map((b) => <button key={b.id} className={b.id === selected.id ? 'active' : ''} onClick={() => { setBusinessId(b.id); setEditing(false); }}>{b.name}</button>)}<button onClick={refresh}>refresh</button>{editing && <button onClick={cancelEdit}>cancel</button>}<button className="lock" onClick={editing ? saveAll : startEdit}>{editing ? 'save all' : '✎ edit'}</button></div><div className="latest-change">Latest update: {selectedChanges?.latest_updated_at ? new Date(selectedChanges.latest_updated_at).toLocaleString() : 'not yet logged'} {selectedChanges?.latest_changes[0]?.sectionUrl && <a href={selectedChanges.latest_changes[0].sectionUrl}>open changed section</a>}</div><div className="bmc-layout">{blocks.map((block) => <div className={`bmc-cell ${block.block_key}`} key={block.block_key}><h2>{block.block_name}</h2>{editing ? <textarea value={drafts[block.block_key] || ''} onChange={(event) => setDrafts({ ...drafts, [block.block_key]: event.target.value })} placeholder="one item per line" /> : block.elements.length ? <ul>{block.elements.map((element) => <li key={element}>{element}</li>)}</ul> : <p className="empty">empty</p>}</div>)}</div></section></>;
}


const projectLanes = [
  ['todo', 'Todo'],
  ['doing', 'Doing'],
  ['review', 'Review'],
] as const;
const statusAliases: Record<string, string> = { active: 'todo', ongoing: 'doing', paused: 'todo', stopped: 'done' };
function laneFor(status: string) { return statusAliases[status] || status; }
function statusLabel(status: string) { return laneFor(status).replace('-', ' '); }

function ProjectControlBoard({ projects, businesses, onUpdate }: { projects: Project[]; businesses: Business[]; onUpdate: (project: Project, patch: ProjectPatch) => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProjectPatch>({});
  const [newBacklog, setNewBacklog] = useState<ProjectPatch>({ name: '', business_id: businesses[0]?.id || '', status: 'backlog' });
  const lanes = projectLanes.map(([key, label]) => [key, label, projects.filter((p) => laneFor(p.status) === key)] as const);
  const backlog = projects.filter((p) => laneFor(p.status) === 'backlog');
  const done = projects.filter((p) => laneFor(p.status) === 'done');
  function start(project: Project) { setEditing(project.id); setDraft({ name: project.name, business_id: project.business_id, status: laneFor(project.status) }); }
  function editFields(project: Project) {
    return <><input aria-label="task name" value={draft.name || ''} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><select aria-label="associated project" value={draft.business_id || project.business_id} onChange={(event) => setDraft({ ...draft, business_id: event.target.value })}>{businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}</select><select aria-label="status" value={draft.status || laneFor(project.status)} onChange={(event) => setDraft({ ...draft, status: event.target.value })}><option value="todo">todo</option><option value="doing">doing</option><option value="review">review</option><option value="backlog">backlog</option><option value="done">done</option></select><div className="actions"><button onClick={() => { onUpdate(project, draft); setEditing(null); }}>save</button><button onClick={() => setEditing(null)}>cancel</button></div></>;
  }
  function card(project: Project) {
    const isEditing = editing === project.id;
    return <article className="kanban-card" draggable={!isEditing} onDragStart={(event) => event.dataTransfer.setData('text/plain', project.id)}>
      {isEditing ? editFields(project) : <><strong>{project.name}</strong><span>{project.business_name} · {statusLabel(project.status)}</span><button onClick={() => start(project)}>edit</button></>}
    </article>;
  }
  async function addBacklog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { name: newBacklog.name, business_id: newBacklog.business_id || businesses[0]?.id, status: 'backlog' };
    const response = await fetch('/api/projects', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    if (response.ok) window.location.reload();
  }
  return <section><h2>1. Project Scope Kanban</h2><p>Each card only edits three fields: task name, associated project/business, and status.</p><div className="kanban-board">{lanes.map(([key, label, items]) => <div className="kanban-lane" key={key} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const project = projects.find((p) => p.id === event.dataTransfer.getData('text/plain')); if (project) onUpdate(project, { status: key }); }}><h3>{label}</h3>{items.map(card)}</div>)}</div><div className="project-lists"><EditableProjectList title="Backlog" projects={backlog} businesses={businesses} editing={editing} draft={draft} setDraft={setDraft} setEditing={setEditing} onUpdate={onUpdate} /><EditableProjectList title="Done" projects={done} businesses={businesses} editing={editing} draft={draft} setDraft={setDraft} setEditing={setEditing} onUpdate={onUpdate} /></div><form className="add-backlog" onSubmit={addBacklog}><h3>Add card to backlog</h3><input required placeholder="task name" value={newBacklog.name || ''} onChange={(event) => setNewBacklog({ ...newBacklog, name: event.target.value })} /><select value={newBacklog.business_id || businesses[0]?.id || ''} onChange={(event) => setNewBacklog({ ...newBacklog, business_id: event.target.value })}>{businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}</select><button>add backlog card</button></form></section>;
}

function EditableProjectList({ title, projects, businesses, editing, draft, setDraft, setEditing, onUpdate }: { title: string; projects: Project[]; businesses: Business[]; editing: string | null; draft: ProjectPatch; setDraft: (draft: ProjectPatch) => void; setEditing: (id: string | null) => void; onUpdate: (project: Project, patch: ProjectPatch) => void }) {
  return <div className="project-list"><h3>{title}</h3>{projects.map((p) => {
    const isEditing = editing === p.id;
    return <article className="kanban-card" key={p.id}>{isEditing ? <><input value={draft.name || ''} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><select value={draft.business_id || p.business_id} onChange={(event) => setDraft({ ...draft, business_id: event.target.value })}>{businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}</select><select value={draft.status || laneFor(p.status)} onChange={(event) => setDraft({ ...draft, status: event.target.value })}><option value="todo">todo</option><option value="doing">doing</option><option value="review">review</option><option value="backlog">backlog</option><option value="done">done</option></select><div className="actions"><button onClick={() => { onUpdate(p, draft); setEditing(null); }}>save</button><button onClick={() => setEditing(null)}>cancel</button></div></> : <><strong>{p.name}</strong><span>{p.business_name} · {statusLabel(p.status)}</span><button onClick={() => { setDraft({ name: p.name, business_id: p.business_id, status: laneFor(p.status) }); setEditing(p.id); }}>edit</button></>}</article>;
  })}</div>;
}

function ProjectStateSummary({ projects }: { projects: Project[] }) {
  return <Table headers={['Business','Task','Kanban state']} rows={projects.map((p) => [p.business_name, p.name, statusLabel(p.status)])} />;
}

function ActionButtons({ project, onAction }: { project: Project; onAction: (project: Project, action: string) => void }) {
  return <div className="actions"><button onClick={() => onAction(project, 'play')}>play</button><button onClick={() => onAction(project, 'pause')}>pause</button><button onClick={() => onAction(project, 'stop')}>stop</button></div>;
}

function MiniBmcTiles({ businesses }: { businesses: Business[] }) {
  return <section><h2>Business Model Canvas tiles</h2><div className="mini-tiles">{businesses.map((business) => <a className="mini-tile" key={business.id} href={`/business-model?business=${encodeURIComponent(business.id)}`}><strong>{business.name}</strong><span>{business.notes}</span></a>)}</div></section>;
}

function StatusBar({ changes, status }: { changes: Change[]; status: string }) {
  const latest = changes[0];
  return <div className="status global-status">Live data: {latest ? <><strong>{latest.label}</strong> — {latest.reason} {latest.sectionUrl && <a href={latest.sectionUrl}>open section</a>}</> : status}</div>;
}

function AddTransaction() {
  const mission = useCachedJson<MissionData>('sativa:transaction-options:react:v2', '/api/mission-control-data');
  const categories = useCachedJson<{ categories: OptionRow[] }>('sativa:categories:react:v2', '/api/ledger/categories');
  const [status, setStatus] = useState('ready');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving transaction...');
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const form = event.currentTarget;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('/api/ledger/transactions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
      const body = await response.json().catch(() => ({})) as { error?: string; transaction?: { id?: string } };
      if (!response.ok) { setStatus(`save failed: ${body.error || response.statusText}`); return; }
      localStorage.removeItem('sativa:mission:react:v2');
      form.reset();
      setStatus(`saved transaction ${body.transaction?.id || ''}`.trim());
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === 'AbortError' ? 'save timed out; refresh data to confirm whether it was recorded' : `save failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    } finally {
      window.clearTimeout(timeout);
    }
  }
  return <><Status text={status} /><section><h2>+transaction</h2><form className="simple-form" onSubmit={submit}><input name="transaction_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /><select name="account_id">{(mission.data?.accounts || []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><select name="business_id">{(mission.data?.businesses || []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><select name="category_id">{(categories.data?.categories || []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><select name="transaction_type"><option value="income">income</option><option value="expense">expense</option><option value="investment">investment</option><option value="asset">asset</option><option value="transfer">transfer</option></select><input name="cash_in" type="number" placeholder="cash in" /><input name="cash_out" type="number" placeholder="cash out" /><input name="description" placeholder="description (what spending or balance adjustment is this?)" required /><button>save transaction</button></form></section></>;
}

function Status({ text }: { text: string }) { return <div className="status">Status: {text}</div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong></div>; }
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) { return <table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>; }

createRoot(document.getElementById('root')!).render(<App />);
