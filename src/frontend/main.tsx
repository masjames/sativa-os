import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Business = { id: string; name: string; status: string; ownership?: Record<string, number>; revenue?: number; expenses?: number; investment?: number; netCash?: number; notes: string };
type Project = { id: string; business_id: string; business_name: string; name: string; status: string; horizon: string; priority: number; outcome: string; next_action: string; buubo_container_id: string | null };
type Metric = { business_id: string; business_name: string; shareholding: Record<string, number>; energy_hours_per_week: number; sustainability_score: number; vision_alignment_score: number; score_note: string };
type BusinessModelBlock = { business_id: string; block_key: string; block_name: string; elements: string[]; control_question: string; status?: string };
type OptionRow = { id: string; name: string };

type MissionData = { source: string; loadedAt: string; summary: Record<string, any>; accounts: any[]; cashflow: { rows: any[] }; assets: any[]; businesses: Business[]; tax: Record<string, any>; mcp: string[] };
type DirectorData = { visionGoals: any[]; weeklyReviews: any[]; okrs: any[]; businesses: Business[]; mcp: string[] };

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

function useCachedJson<T>(key: string, url: string) {
  const [data, setData] = useState<T | null>(() => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') as T | null; } catch { return null; }
  });
  const [status, setStatus] = useState(data ? 'showing browser cache instantly; refreshing D1...' : 'loading from Cloudflare D1...');
  useEffect(() => {
    let cancelled = false;
    const started = performance.now();
    getJson<T>(url).then((fresh) => {
      if (cancelled) return;
      localStorage.setItem(key, JSON.stringify(fresh));
      setData(fresh);
      setStatus(`loaded from Cloudflare D1 in ${Math.round(performance.now() - started)}ms; cached in browser`);
    }).catch((error) => setStatus(`load failed: ${error instanceof Error ? error.message : 'unknown error'}`));
    return () => { cancelled = true; };
  }, [key, url]);
  return { data, status, setData, setStatus };
}

function App() {
  const path = window.location.pathname;
  return <Shell>{path === '/director' ? <Director /> : path === '/projects' ? <Projects /> : path === '/business-model' ? <BusinessModelCanvas /> : path === '/add-transaction' ? <AddTransaction /> : <MissionControl />}</Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main><header className="top"><div className="brand"><a className="title" href="/">SATIVA OS</a><a className="quick" href="/add-transaction">+transaction</a></div><nav>{nav.map(([href, label]) => <a key={href} className={window.location.pathname === href ? 'active' : ''} href={href}>{label}</a>)}</nav></header>{children}</main>;
}

function MissionControl() {
  const { data, status } = useCachedJson<MissionData>('sativa:mission:react:v2', '/api/mission-control-data');
  if (!data) return <Status text={status} />;
  const s = data.summary;
  return <><Status text={status} /><section><h2>1. Money Flow</h2><div className="metrics"><Metric label="Free cash" value={rupiah(s.freeCash)} /><Metric label="Restricted assets" value={rupiah(s.restrictedAssets)} /><Metric label="Savings" value={rupiah(s.savings)} /><Metric label="Total tracked" value={rupiah(s.totalTrackedAssets)} /></div></section><section><h2>2. Horizon of Controls</h2><div className="thirds"><p>Critical control: keep WARAS separate from spendable cash.</p><p>Next cash action: create, collect, sell, deliver, or recover cash.</p><p>MCP Manifest is available in the top menu.</p></div></section><section><h2>3. All Detailed Data</h2><h3>Accounts</h3><Table headers={['Account','Type','Spendable','Balance']} rows={data.accounts.map((a) => [a.name, a.account_type, a.is_spendable ? 'yes' : 'no', rupiah(a.balance)])} /><h3>Cashflow</h3><Table headers={['Date','Account','Business','In','Out','Balance','Notes']} rows={data.cashflow.rows.map((r) => [r.transaction_date, r.account_name, r.business_name, rupiah(r.cash_in), rupiah(r.cash_out), rupiah(r.running_balance), r.description])} /></section></>;
}

function Director() {
  const { data, status } = useCachedJson<DirectorData>('sativa:director:react:v2', '/api/director-data');
  const metrics = useCachedJson<{ metrics: Metric[] }>('sativa:metrics:react:v2', '/api/business-metrics');
  if (!data) return <Status text={status} />;
  return <><Status text={status} /><section><h2>Sativa 300T Vision Alignment</h2><Table headers={['Goal','Horizon','Target','Status','Alignment']} rows={data.visionGoals.map((g) => [g.name, g.horizon, g.target_value, g.status, g.alignment_note])} /></section><section><h2>Weekly Review</h2><Table headers={['Week','Cash','Delivery','Business','Decisions','Next Actions']} rows={data.weeklyReviews.map((r) => [r.week_start, r.cash_review, r.delivery_review, r.business_review, r.decisions_needed, r.next_actions])} /></section><section><h2>Business Metrics</h2>{metrics.data ? <Table headers={['Business','Shareholding','Hours / week','Sustainability','Vision','Note']} rows={metrics.data.metrics.map((m) => [m.business_name, JSON.stringify(m.shareholding), String(m.energy_hours_per_week), String(m.sustainability_score), String(m.vision_alignment_score), m.score_note])} /> : <p>{metrics.status}</p>}</section></>;
}

function Projects() {
  const { data, status } = useCachedJson<{ projects: Project[] }>('sativa:projects:react:v2', '/api/projects');
  const sync = useCachedJson<any>('sativa:buubo-sync:react:v2', '/api/sync/buubo/status');
  if (!data) return <Status text={status} />;
  const groups = data.projects.reduce<Record<string, Project[]>>((acc, project) => { (acc[project.business_name] ||= []).push(project); return acc; }, {});
  return <><Status text={status} /><section><h2>Projects Horizon</h2><p>Every project is tied to one parent business. Buubo sync: {sync.data?.status || sync.status}</p>{Object.entries(groups).map(([business, projects]) => <div className="project-group" key={business}><h3>{business}</h3><Table headers={['Project','Status','Horizon','Priority','Outcome','Next Action','Buubo']} rows={projects.map((p) => [p.name, p.status, p.horizon, String(p.priority), p.outcome, p.next_action, p.buubo_container_id || 'pending'])} /></div>)}</section></>;
}

function BusinessModelCanvas() {
  const { data, status, setData, setStatus } = useCachedJson<{ businesses: Business[]; blocks: BusinessModelBlock[] }>('sativa:bmc:data:react:v2', '/api/business-model-data');
  const [businessId, setBusinessId] = useState('');
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const selected = useMemo(() => data?.businesses.find((b) => b.id === businessId) || data?.businesses[0], [data, businessId]);
  useEffect(() => { if (!businessId && data?.businesses[0]) setBusinessId(data.businesses[0].id); }, [data, businessId]);
  if (!data || !selected) return <Status text={status} />;
  const selectedId = selected.id;
  const blocks = bmcOrder.map((key) => data.blocks.find((b) => b.business_id === selectedId && b.block_key === key) || { business_id: selectedId, block_key: key, block_name: bmcName[key], elements: [], control_question: '' });
  function startEdit() { setDrafts(Object.fromEntries(blocks.map((b) => [b.block_key, b.elements.join('\n')]))); setEditing(true); }
  async function saveAll() {
    setStatus('saving BMC blocks to Cloudflare D1...');
    const updated = await Promise.all(blocks.map((block) => fetch('/api/business-model', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ business_id: selectedId, block_key: block.block_key, elements_json: JSON.stringify((drafts[block.block_key] || '').split('\n').map((item) => item.trim()).filter(Boolean)), status: 'active', control_question: '' }) }).then((response) => response.json())));
    const fresh = await getJson<{ businesses: Business[]; blocks: BusinessModelBlock[] }>('/api/business-model-data');
    localStorage.setItem('sativa:bmc:data:react:v2', JSON.stringify(fresh));
    setData(fresh);
    setEditing(false);
    setStatus(`saved ${updated.length} BMC blocks`);
  }
  return <><Status text={status} /><section className="canvas-wrap"><div className="business-tabs">{data.businesses.map((b) => <button key={b.id} className={b.id === selected.id ? 'active' : ''} onClick={() => { setBusinessId(b.id); setEditing(false); }}>{b.name}</button>)}<button className="lock" onClick={editing ? saveAll : startEdit}>{editing ? 'save all' : '✎ edit'}</button></div><div className="bmc-layout">{blocks.map((block) => <div className={`bmc-cell ${block.block_key}`} key={block.block_key}><h2>{block.block_name}</h2>{editing ? <textarea value={drafts[block.block_key] || ''} onChange={(event) => setDrafts({ ...drafts, [block.block_key]: event.target.value })} placeholder="one item per line" /> : block.elements.length ? <ul>{block.elements.map((element) => <li key={element}>{element}</li>)}</ul> : <p className="empty">empty</p>}</div>)}</div></section></>;
}

function AddTransaction() {
  const mission = useCachedJson<MissionData>('sativa:transaction-options:react:v2', '/api/mission-control-data');
  const categories = useCachedJson<{ categories: OptionRow[] }>('sativa:categories:react:v2', '/api/ledger/categories');
  const [status, setStatus] = useState('ready');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving transaction...');
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch('/api/ledger/transactions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) { setStatus('save failed'); return; }
    localStorage.removeItem('sativa:mission:react:v2');
    event.currentTarget.reset();
    setStatus('saved');
  }
  return <><Status text={status} /><section><h2>+transaction</h2><form className="simple-form" onSubmit={submit}><input name="transaction_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /><select name="account_id">{(mission.data?.accounts || []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><select name="business_id">{(mission.data?.businesses || []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><select name="category_id">{(categories.data?.categories || []).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select><select name="transaction_type"><option value="income">income</option><option value="expense">expense</option><option value="investment">investment</option><option value="asset">asset</option><option value="transfer">transfer</option></select><input name="cash_in" type="number" placeholder="cash in" /><input name="cash_out" type="number" placeholder="cash out" /><input name="description" placeholder="description" required /><button>save</button></form></section></>;
}

function Status({ text }: { text: string }) { return <div className="status">Status: {text}</div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="metric"><span>{label}</span><strong>{value}</strong></div>; }
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) { return <table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>; }

createRoot(document.getElementById('root')!).render(<App />);
