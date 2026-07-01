const SECTIONS = ['entities', 'ledger', 'ventures', 'obligations', 'decisions', 'weekly', 'intentions', 'worries', 'journal', 'captures'] as const;
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

type Account = { id: string; name: string; account_type: string; owner: string; currency: string; is_spendable: number; is_restricted?: number; status?: string; notes: string };
type Business = { id: string; name: string; status: string; ownership_json: string; notes: string };
type BusinessMetric = { business_id: string; shareholding_json: string; energy_hours_per_week: number; sustainability_score: number; vision_alignment_score: number; score_note: string; updated_at: string };
type Project = { id: string; business_id: string; name: string; status: string; horizon: string; priority: number; outcome: string; next_action: string; source: string; buubo_container_id: string | null; created_at: string; updated_at: string };
type ProjectAction = { id: string; project_id: string; business_id: string; action: string; happened_at: string; note: string; created_at: string };
type StatusChange = { id: string; entity_type: string; entity_id: string; action: string; reason: string; created_at: string; metadata_json: string };
type BusinessChange = { business_id: string; latest_updated_at: string | null; latest_changes: StatusChange[] };
type BusinessCanvas = { id: string; business_id: string; canvas_type: string; snapshot_json: string; schema_version: string; updated_by: string; created_at: string; updated_at: string };
type NewProject = Partial<Project>;
type Category = { id: string; name: string; kind: string; tax_relevant: number; parent_category_id?: string | null; status?: string; notes: string };
type Transaction = {
  id: string;
  transaction_date: string;
  account_id: string;
  business_id: string | null;
  category_id: string;
  transaction_type: string;
  description: string;
  cash_in: number;
  cash_out: number;
  counterparty: string | null;
  tax_tag: string | null;
  reflection: string;
  metadata_json?: string;
  external_ref?: string | null;
  transfer_group_id?: string | null;
  split_parent_id?: string | null;
  receipt_ref?: string | null;
  is_void?: number;
  void_reason?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
};
type NewTransaction = Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>;
type VisionGoal = { id: string; name: string; horizon: string; target_value: string; status: string; alignment_note: string };
type Okr = { id: string; business_id: string | null; objective: string; key_results_json: string; period: string; status: string; confidence: number };
type WeeklyReview = { id: string; week_start: string; cash_review: string; delivery_review: string; business_review: string; decisions_needed: string; next_actions: string };
type BusinessModelBlock = { id: string; business_id: string; block_key: string; block_name: string; elements_json: string; status: string; control_question: string };
type NewBusinessModelBlock = Partial<BusinessModelBlock>;
type NewBusinessCanvas = Partial<BusinessCanvas> & { snapshot?: unknown };
type LedgerFilter = Record<string, unknown>;
type PatchPayload = { transaction_id?: string; account_id?: string; category_id?: string; business_id?: string; patch_json?: string | Record<string, unknown>; edit_reason?: string; delete_reason?: string; void_reason?: string; reason?: string; [key: string]: unknown };

type McpJsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

type McpToolDefinition = {
  name: string;
  description: string;
  method: 'GET' | 'POST';
  path: string;
  inputSchema: Record<string, unknown>;
};


const today = '2026-06-27';
const now = '2026-06-27T00:00:00.000Z';

const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'bank-main', name: 'Bank Account', account_type: 'cash', owner: 'Adit', currency: 'IDR', is_spendable: 1, notes: 'Main spendable bank cash.' },
  { id: 'gopay', name: 'GoPay', account_type: 'wallet', owner: 'Adit', currency: 'IDR', is_spendable: 1, notes: 'Current GoPay wallet pocket.' },
  { id: 'sonny-waras', name: "Sonny's WARAS Bank Account", account_type: 'business_asset_holding', owner: 'WARAS', currency: 'IDR', is_spendable: 0, notes: 'Empty Sonny bank account currently used to hold WARAS initial investment. Out of Adit free cash.' },
  { id: 'savings', name: 'Savings', account_type: 'savings', owner: 'Adit', currency: 'IDR', is_spendable: 1, notes: 'No savings currently.' },
];

const DEFAULT_BUSINESSES: Business[] = [
  { id: 'personal-sativa', name: 'Adit / Sativa Personal', status: 'active', ownership_json: JSON.stringify({ Adit: 100 }), notes: 'Personal/control-plane accounting bucket.' },
  { id: 'appworkz', name: 'AppWorkZ', status: 'active', ownership_json: JSON.stringify({ Adit: 100 }), notes: 'Delivery and client/product work engine.' },
  { id: 'waras', name: 'WARAS', status: 'active', ownership_json: JSON.stringify({ Adit: 65, Sonny: 35 }), notes: 'WARAS business. Initial asset held in Sonny bank account. Adit stake 65%, Sonny stake 35%.' },
  { id: 'coreitera', name: 'Coreitera', status: 'watch', ownership_json: JSON.stringify({ Adit: 10 }), notes: 'Weak income source; track salary but do not rely on it as stable foundation.' },
  { id: 'buubo', name: 'Buubo', status: 'parked', ownership_json: JSON.stringify({ Adit: 100 }), notes: 'Execution system/product context.' },
  { id: 'zippp', name: 'zippp.link', status: 'parked', ownership_json: JSON.stringify({ Adit: 100 }), notes: 'Separate product repo when active.' },
  { id: 'rileks', name: 'Rileks', status: 'parked', ownership_json: JSON.stringify({ Adit: 100 }), notes: 'Separate product repo when active.' },
  { id: 'kalana', name: 'Kalana', status: 'parked', ownership_json: JSON.stringify({ Adit: 100 }), notes: 'Separate product repo when active.' },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', kind: 'income', tax_relevant: 1, notes: 'Employment or recurring compensation.' },
  { id: 'bank-fee', name: 'Bank Fee / Admin', kind: 'expense', tax_relevant: 1, notes: 'Bank admin, transfer fee, and account costs.' },
  { id: 'wallet-opening', name: 'Wallet Opening Balance', kind: 'asset', tax_relevant: 0, notes: 'Current pocket balance brought into Sativa OS.' },
  { id: 'investment', name: 'Investment / Owner Contribution', kind: 'investment', tax_relevant: 1, notes: 'Money moved into a business or asset.' },
  { id: 'savings-opening', name: 'Savings Opening Balance', kind: 'asset', tax_relevant: 0, notes: 'Savings pocket opening balance.' },
  { id: 'client-revenue', name: 'Client Revenue', kind: 'income', tax_relevant: 1, notes: 'AppWorkZ or freelance/client revenue.' },
  { id: 'living-cost', name: 'Living Cost', kind: 'expense', tax_relevant: 0, notes: 'Personal spending.' },
  { id: 'software-tools', name: 'Software / Tools', kind: 'expense', tax_relevant: 1, notes: 'Business tools, subscriptions, SaaS.' },
  { id: 'food', name: 'Food', kind: 'expense', tax_relevant: 0, notes: 'Meals and food.' },
  { id: 'coffee', name: 'Coffee', kind: 'expense', tax_relevant: 0, notes: 'Coffee and cafe spending.' },
  { id: 'cigarettes', name: 'Cigarettes', kind: 'expense', tax_relevant: 0, notes: 'Cigarettes/rokok.' },
  { id: 'drinks', name: 'Drinks', kind: 'expense', tax_relevant: 0, notes: 'Water and drinks.' },
  { id: 'transport', name: 'Transport', kind: 'expense', tax_relevant: 0, notes: 'Transport and mobility.' },
  { id: 'phone-internet', name: 'Phone / Internet', kind: 'expense', tax_relevant: 1, notes: 'Mobile quota, internet, phone.' },
  { id: 'subscription', name: 'Subscription', kind: 'expense', tax_relevant: 1, notes: 'Recurring subscriptions.' },
  { id: 'health', name: 'Health', kind: 'expense', tax_relevant: 0, notes: 'Health expenses.' },
  { id: 'family', name: 'Family', kind: 'expense', tax_relevant: 0, notes: 'Family support.' },
  { id: 'rent', name: 'Rent', kind: 'expense', tax_relevant: 0, notes: 'Rent and housing.' },
  { id: 'debt', name: 'Debt', kind: 'liability', tax_relevant: 0, notes: 'Debt payment or liability.' },
  { id: 'transfer', name: 'Transfer', kind: 'transfer', tax_relevant: 0, notes: 'Internal transfer between accounts.' },
  { id: 'reconciliation', name: 'Reconciliation Adjustment', kind: 'adjustment', tax_relevant: 0, notes: 'Balance reconciliation adjustment.' },
  { id: 'uncategorized', name: 'Uncategorized', kind: 'review', tax_relevant: 0, notes: 'Needs review before report/tax handoff.' },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  tx('seed-salary-2026-06', today, 'bank-main', 'coreitera', 'salary', 'income', 'Monthly salary received', 2_000_000, 0, 'Coreitera', 'income_salary', 'Cash came in, but source is weak and should not be treated as stable foundation.'),
  tx('seed-bank-admin-2026-06', today, 'bank-main', 'personal-sativa', 'bank-fee', 'expense', 'Bank account admin spare', 0, 25_000, 'Bank', 'bank_fee', 'Small outflow reserved for account admin.'),
  tx('seed-waras-transfer-2026-06', today, 'bank-main', 'waras', 'investment', 'investment', 'Cash moved out to WARAS initial investment', 0, 1_000_000, 'Sonny / WARAS bank account', 'owner_investment', 'WARAS is out from Adit free cash.'),
  tx('seed-waras-asset-2026-06', today, 'sonny-waras', 'waras', 'investment', 'asset', 'WARAS initial asset held in Sonny bank account', 1_000_000, 0, 'Adit', 'business_asset', 'WARAS asset. Ownership: Adit 65%, Sonny 35%.'),
  tx('seed-gopay-opening-2026-06', today, 'gopay', 'personal-sativa', 'wallet-opening', 'opening_balance', 'GoPay current balance', 12_000, 0, 'GoPay', 'personal_cash', 'Spendable wallet cash.'),
  tx('seed-savings-opening-2026-06', today, 'savings', 'personal-sativa', 'savings-opening', 'opening_balance', 'Savings currently empty', 0, 0, 'Adit', 'personal_savings', 'No other savings sadly. Critical cash situation.'),
];

const DEFAULT_ENTRIES: Entry[] = [
  entry('seed-worry-cash-critical', 'worries', 'Critical cash situation', 'Free cash is low. WARAS is an asset but out of spendable cash. Need cash from somewhere else: sales, collection, delivery, or new earning path.', 'open', 1, { category: 'cash' }),
  entry('seed-intention-cash-energy', 'intentions', 'Cash is energy', 'Track, categorize, review, reflect, and retrospect the flow of cash without shame or fog.', 'open', 1, { rule: 'cash clarity' }),
  entry('seed-obligation-tax-ready', 'obligations', 'Make money records tax-ready', 'Categorize income, expenses, investments, business flows, and evidence so SPT/self-reporting can be filled without thinking later.', 'open', 2, { policy: 'tax readiness' }),
];

const DEFAULT_VISION_GOALS: VisionGoal[] = [
  { id: 'vision-sativa-300t', name: 'Sativa 300T Vision', horizon: 'long-term', target_value: '300T IDR empire-scale asset/value vision', status: 'active', alignment_note: 'Every business, service, product, and weekly review should compound cash, proof, reusable assets, network, and operating clarity toward the 300T vision.' },
  { id: 'vision-cash-first', name: 'Cash First Survival Bridge', horizon: 'now', target_value: 'stabilize cash and create external earning channels', status: 'active', alignment_note: 'Critical cash requires AppWorkZ service income, Upwork setup, and delivery momentum before speculative expansion.' },
];

const DEFAULT_OKRS: Okr[] = [
  { id: 'okr-appworkz-upwork', business_id: 'appworkz', objective: 'Launch AppWorkZ Upwork service channel', key_results_json: JSON.stringify(['Set up personal Upwork service profile', 'Offer AI-assisted 0-to-MVP development', 'Offer existing app restructure for AI development', 'Package agentic dev partner service', 'Get first qualified conversation/client']), period: 'current', status: 'active', confidence: 60 },
  { id: 'okr-zippp-deploy', business_id: 'zippp', objective: 'Deploy Zippp and use it as proof of shipping', key_results_json: JSON.stringify(['Deploy Zippp', 'Capture proof/case study', 'Link proof to AppWorkZ service offer']), period: 'current', status: 'active', confidence: 50 },
  { id: 'okr-rileks-deploy', business_id: 'rileks', objective: 'Deploy Rileks and use it as proof of product execution', key_results_json: JSON.stringify(['Deploy Rileks', 'Capture proof/case study', 'Extract reusable assets for AppWorkZ delivery']), period: 'current', status: 'active', confidence: 50 },
  { id: 'okr-weekly-review', business_id: null, objective: 'Run weekly control review every Monday', key_results_json: JSON.stringify(['Review cash situation', 'Review OKR progress', 'Review business model blocks', 'Decide next cash action']), period: 'weekly', status: 'active', confidence: 70 },
];

const DEFAULT_WEEKLY_REVIEWS: WeeklyReview[] = [
  { id: 'weekly-current-control', week_start: '2026-06-22', cash_review: 'Critical free cash. WARAS is asset, not spendable. Need external earning path.', delivery_review: 'Deploy Zippp and Rileks as proof. Use AppWorkZ to sell AI dev execution.', business_review: 'AppWorkZ service channel becomes near-term cash engine. WARAS, Zippp, Rileks are tracked as ventures/assets.', decisions_needed: 'Upwork positioning, first offer page, proof assets, which MVP to deploy first.', next_actions: 'Set up Upwork, define service packages, deploy Zippp/Rileks, log all cash movements.' },
];

const BMC_BLOCKS = [
  ['partners', 'Key Partners'], ['activities', 'Key Activities'], ['resources', 'Key Resources'], ['value', 'Value Proposition'], ['relationships', 'Customer Relationships'], ['channels', 'Channels'], ['segments', 'Customer Segments'], ['costs', 'Cost Structure'], ['revenue', 'Revenue Streams'],
] as const;

const DEFAULT_BMC: BusinessModelBlock[] = [
  bmc('appworkz', 'segments', ['Founders/nontechnical builders needing 0-to-MVP', 'Existing app owners needing AI-dev restructuring', 'Teams wanting agentic development partner']),
  bmc('appworkz', 'value', ['Dev with AI service from 0 to MVP', 'Existing app restructure for AI development', 'Agentic dev partner using AppWorkZ delivery system']),
  bmc('appworkz', 'channels', ['Personal Upwork service', 'Proof from Zippp and Rileks deployments', 'Direct network/referrals']),
  bmc('appworkz', 'revenue', ['MVP build service fees', 'App restructure fees', 'Ongoing AI-dev partner retainers']),
  bmc('appworkz', 'activities', ['Scope MVP', 'Build with AI agents', 'Restructure existing apps', 'Ship proof and handoff']),
  bmc('appworkz', 'resources', ['Adit time', 'Katalyst', 'Codex/agents', 'Cloudflare/Supabase patterns', 'Reusable templates']),
  bmc('appworkz', 'partners', ['Upwork clients', 'AI tools', 'future contractors/agents']),
  bmc('appworkz', 'costs', ['Adit time', 'tooling subscriptions', 'infrastructure', 'contractor support later']),
  bmc('appworkz', 'relationships', ['High-context partner', 'weekly build updates', 'clear handoff and docs']),
  bmc('zippp', 'value', ['Link/product utility and proof of shipping speed']),
  bmc('rileks', 'value', ['Product proof and reusable delivery asset']),
  bmc('waras', 'resources', ["Sonny's empty bank account holding initial WARAS asset", 'Adit 65% stake', 'Sonny 35% stake']),
];


const DEFAULT_BUSINESS_METRICS: BusinessMetric[] = [
  metric('personal-sativa', { Adit: 100 }, 4, 60, 80, 'Personal control layer; useful only if it reduces decision fog.'),
  metric('appworkz', { Adit: 100 }, 30, 75, 90, 'Near-term cash engine through AI dev services, Upwork, MVP builds, and app restructuring.'),
  metric('waras', { Adit: 65, Sonny: 35 }, 8, 55, 70, 'WARAS has asset potential but must stay separate from spendable cash.'),
  metric('coreitera', { Adit: 10 }, 12, 45, 45, 'Weak bridge income; keep scope controlled and watch energy drain.'),
  metric('buubo', { Adit: 100 }, 6, 65, 85, 'Execution/time tracking product; should sync project reality back into Mission Control.'),
  metric('zippp', { Adit: 100 }, 5, 55, 65, 'Deployment proof and reusable AppWorkZ case study.'),
  metric('rileks', { Adit: 100 }, 6, 55, 65, 'Initial MVP proof and reusable delivery asset.'),
  metric('kalana', { Adit: 100 }, 1, 35, 45, 'Parked until cash and focus allow it.'),
];

const DEFAULT_PROJECTS: Project[] = [
  project('project-coreitera-onboarding', 'coreitera', 'Coreitera mental health onboarding', 'active', 'now', 1, 'Complete onboarding and clarify value/cash/energy tradeoff.', 'Define next onboarding deliverable and timebox it.', 'mission-control'),
  project('project-appworkz-cv', 'appworkz', 'AppWorkZ CV preparation', 'active', 'now', 1, 'Prepare personal Upwork/CV positioning for AI dev partner services.', 'Draft CV/service proof around 0-to-MVP and AI app restructure.', 'mission-control'),
  project('project-appworkz-upwork', 'appworkz', 'AppWorkZ Upwork service setup', 'active', 'now', 1, 'Open personal Upwork service channel under AppWorkZ positioning.', 'Publish profile and first service offer.', 'mission-control'),
  project('project-rileks-mvp', 'rileks', 'Rileks initial MVP', 'active', 'near', 2, 'Ship Rileks as proof of product execution.', 'Identify smallest deployable Rileks slice.', 'mission-control'),
  project('project-zippp-deploy', 'zippp', 'Zippp.link deployment', 'active', 'near', 2, 'Deploy Zippp.link and convert it into AppWorkZ proof.', 'Deploy and capture proof/case study.', 'mission-control'),
];


const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

let seedPromise: Promise<void> | null = null;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { headers: jsonHeaders });
    const url = new URL(request.url);

    try {
      if (url.pathname === '/health') return jsonResponse({ ok: true, service: 'sativa-os', auth: 'disabled-for-test', ledger: 'enabled', app: 'react-fast-bmc' });
      if (url.pathname === '/mcp' && request.method === 'POST') return mcpResponse(await handleMcpRequest(request, env));
      if (url.pathname === '/mcp') return jsonResponse(mcpManifest(url.origin));

      if (url.pathname === '/api/seed' && request.method === 'POST') { await ensureSeededOnce(env); return jsonResponse({ ok: true, seeded: true }); }
      if (url.pathname === '/api/mission-control-data') return jsonResponse(await missionControlData(env));
      if (url.pathname === '/api/director-data') return jsonResponse(await directorData(env));
      if (url.pathname === '/api/business-model-data') return jsonResponse(await businessModelData(env));
      if (url.pathname === '/api/status-changes') return jsonResponse(await statusChanges(env));
      if (url.pathname === '/api/projects' && request.method === 'GET') return jsonResponse({ projects: await projectsWithBusiness(env) });
      if (url.pathname === '/api/projects' && request.method === 'POST') { await ensureSeededOnce(env); return jsonResponse({ project: await createProject(env, await readJson<NewProject>(request)) }, 201); }
      if (url.pathname.match(/^\/api\/projects\/[^/]+$/) && request.method === 'POST') return jsonResponse({ project: await updateProject(env, decodeURIComponent(url.pathname.split('/')[3]), await readJson<NewProject>(request)) });
      if (url.pathname.match(/^\/api\/projects\/[^/]+\/action$/) && request.method === 'POST') return jsonResponse(await recordProjectAction(env, decodeURIComponent(url.pathname.split('/')[3]), await readJson<Record<string, unknown>>(request)), 201);
      if (url.pathname === '/api/business-metrics') return jsonResponse({ metrics: await businessMetricsWithBusiness(env) });
      if (url.pathname.match(/^\/api\/businesses\/[^/]+\/canvas$/) && request.method === 'GET') return jsonResponse(await getBusinessCanvas(env, decodeURIComponent(url.pathname.split('/')[3])));
      if (url.pathname.match(/^\/api\/businesses\/[^/]+\/canvas$/) && request.method === 'PUT') { await ensureSeededOnce(env); return jsonResponse(await saveBusinessCanvas(env, decodeURIComponent(url.pathname.split('/')[3]), await readJson<NewBusinessCanvas>(request))); }
      if (url.pathname === '/api/sync/buubo/status') return jsonResponse(await buuboSyncStatus(env));
      if (url.pathname === '/api/overview') return jsonResponse(await overview(env));
      if (url.pathname === '/api/daily-brief') return jsonResponse(await dailyBrief(env));
      if (url.pathname === '/api/ledger/summary') return jsonResponse(await ledgerSummary(env));
      if (url.pathname === '/api/ledger/accounts') return jsonResponse({ accounts: await accountsWithBalances(env) });
      if (url.pathname === '/api/ledger/transactions' && request.method === 'GET') return jsonResponse({ transactions: await transactionsWithJoins(env) });
      if (url.pathname === '/api/ledger/transactions' && request.method === 'POST') { await ensureSeededOnce(env); return jsonResponse({ transaction: await createTransaction(env, await readJson<NewTransaction>(request)) }, 201); }
      if (url.pathname === '/api/ledger/cashflow') return jsonResponse(await cashflowReport(env));
      if (url.pathname === '/api/ledger/assets') return jsonResponse(await assetTable(env));
      if (url.pathname === '/api/ledger/categories') return jsonResponse({ categories: await listCategories(env) });
      if (url.pathname === '/api/businesses') return jsonResponse({ businesses: await businessesWithReports(env) });
      if (url.pathname === '/api/reports/tax-summary') return jsonResponse(await taxSummary(env));
      if (url.pathname === '/api/director/summary') return jsonResponse(await directorSummary(env));
      if (url.pathname === '/api/weekly-review') return jsonResponse({ weeklyReviews: await listWeeklyReviews(env) });
      if (url.pathname === '/api/okrs') return jsonResponse({ okrs: await okrsWithBusiness(env) });
      if (url.pathname === '/api/vision') return jsonResponse({ visionGoals: await listVisionGoals(env) });
      if (url.pathname === '/api/business-model' && request.method === 'GET') return jsonResponse({ blocks: await businessModelWithBusiness(env) });
      if (url.pathname === '/api/business-model' && request.method === 'POST') { await ensureSeededOnce(env); return jsonResponse({ block: await upsertBusinessModelBlock(env, await readJson<NewBusinessModelBlock>(request)) }, 201); }

      if (url.pathname === '/api/entries' && request.method === 'GET') return jsonResponse({ entries: DEFAULT_ENTRIES });
      if (url.pathname === '/api/capture' && request.method === 'POST') { await ensureSeededOnce(env); return jsonResponse({ entry: await createEntry(env, await readJson<Partial<Entry>>(request), 'captures') }, 201); }
      if (url.pathname === '/api/journal' && request.method === 'POST') { await ensureSeededOnce(env); return jsonResponse({ entry: await createEntry(env, await readJson<Partial<Entry>>(request), 'journal') }, 201); }
      if (url.pathname === '/api/decision' && request.method === 'POST') { await ensureSeededOnce(env); return jsonResponse({ entry: await createEntry(env, await readJson<Partial<Entry>>(request), 'decisions') }, 201); }

      return serveFrontend(request, env);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return jsonResponse({ error: message }, message.startsWith('Invalid') || message.startsWith('Missing') ? 400 : 500);
    }
  },
};

async function ensureSeededOnce(env: Env) {
  seedPromise ??= ensureSeeded(env);
  await seedPromise;
}

function tx(id: string, transactionDate: string, accountId: string, businessId: string, categoryId: string, transactionType: string, description: string, cashIn: number, cashOut: number, counterparty: string, taxTag: string, reflection: string): Transaction {
  return { id, transaction_date: transactionDate, account_id: accountId, business_id: businessId, category_id: categoryId, transaction_type: transactionType, description, cash_in: cashIn, cash_out: cashOut, counterparty, tax_tag: taxTag, reflection, created_at: now, updated_at: now };
}

function bmc(businessId: string, blockKey: string, elements: string[]): BusinessModelBlock {
  const found = BMC_BLOCKS.find(([key]) => key === blockKey);
  const blockName = found ? found[1] : blockKey;
  return { id: `bmc-${businessId}-${blockKey}`, business_id: businessId, block_key: blockKey, block_name: blockName, elements_json: JSON.stringify(elements), status: 'active', control_question: `What must be true for ${blockName} to compound toward Sativa 300T?` };
}

function metric(businessId: string, shareholding: Record<string, number>, hours: number, sustainability: number, vision: number, note: string): BusinessMetric {
  return { business_id: businessId, shareholding_json: JSON.stringify(shareholding), energy_hours_per_week: hours, sustainability_score: sustainability, vision_alignment_score: vision, score_note: note, updated_at: now };
}

function project(id: string, businessId: string, name: string, status: string, horizon: string, priority: number, outcome: string, nextAction: string, source: string): Project {
  return { id, business_id: businessId, name, status, horizon, priority, outcome, next_action: nextAction, source, buubo_container_id: null, created_at: now, updated_at: now };
}

function entry(id: string, section: Section, title: string, body: string, status: string, priority: number, metadata: Record<string, unknown>): Entry {
  return { id, section, title, body, status, priority, due_date: null, amount: null, metadata: JSON.stringify(metadata), created_at: now, updated_at: now };
}

async function ensureSeeded(env: Env) {
  for (const account of DEFAULT_ACCOUNTS) {
    await env.DB.prepare('INSERT OR IGNORE INTO accounts (id, name, account_type, owner, currency, is_spendable, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(account.id, account.name, account.account_type, account.owner, account.currency, account.is_spendable, account.notes, now, now)
      .run();
  }
  for (const business of DEFAULT_BUSINESSES) {
    await env.DB.prepare('INSERT OR IGNORE INTO businesses (id, name, status, ownership_json, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(business.id, business.name, business.status, business.ownership_json, business.notes, now, now)
      .run();
  }
  for (const category of DEFAULT_CATEGORIES) {
    await env.DB.prepare('INSERT OR IGNORE INTO ledger_categories (id, name, kind, tax_relevant, notes) VALUES (?, ?, ?, ?, ?)')
      .bind(category.id, category.name, category.kind, category.tax_relevant, category.notes)
      .run();
  }
  for (const transaction of DEFAULT_TRANSACTIONS) {
    await env.DB.prepare(`INSERT OR IGNORE INTO ledger_transactions
      (id, transaction_date, account_id, business_id, category_id, transaction_type, description, cash_in, cash_out, counterparty, tax_tag, reflection, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(transaction.id, transaction.transaction_date, transaction.account_id, transaction.business_id, transaction.category_id, transaction.transaction_type, transaction.description, transaction.cash_in, transaction.cash_out, transaction.counterparty, transaction.tax_tag, transaction.reflection, transaction.created_at, transaction.updated_at)
      .run();
  }

  for (const goal of DEFAULT_VISION_GOALS) {
    await env.DB.prepare('INSERT OR IGNORE INTO vision_goals (id, name, horizon, target_value, status, alignment_note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(goal.id, goal.name, goal.horizon, goal.target_value, goal.status, goal.alignment_note, now, now)
      .run();
  }
  for (const okr of DEFAULT_OKRS) {
    await env.DB.prepare('INSERT OR IGNORE INTO okrs (id, business_id, objective, key_results_json, period, status, confidence, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(okr.id, okr.business_id, okr.objective, okr.key_results_json, okr.period, okr.status, okr.confidence, now, now)
      .run();
  }
  for (const review of DEFAULT_WEEKLY_REVIEWS) {
    await env.DB.prepare('INSERT OR IGNORE INTO weekly_reviews (id, week_start, cash_review, delivery_review, business_review, decisions_needed, next_actions, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(review.id, review.week_start, review.cash_review, review.delivery_review, review.business_review, review.decisions_needed, review.next_actions, now, now)
      .run();
  }
  for (const block of DEFAULT_BMC) {
    await env.DB.prepare('INSERT OR IGNORE INTO business_model_blocks (id, business_id, block_key, block_name, elements_json, status, control_question, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(block.id, block.business_id, block.block_key, block.block_name, block.elements_json, block.status, block.control_question, now, now)
      .run();
  }
  for (const metricRow of DEFAULT_BUSINESS_METRICS) {
    await env.DB.prepare('INSERT OR IGNORE INTO business_metrics (business_id, shareholding_json, energy_hours_per_week, sustainability_score, vision_alignment_score, score_note, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(metricRow.business_id, metricRow.shareholding_json, metricRow.energy_hours_per_week, metricRow.sustainability_score, metricRow.vision_alignment_score, metricRow.score_note, metricRow.updated_at)
      .run();
  }
  for (const projectRow of DEFAULT_PROJECTS) {
    await env.DB.prepare('INSERT OR IGNORE INTO projects (id, business_id, name, status, horizon, priority, outcome, next_action, source, buubo_container_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(projectRow.id, projectRow.business_id, projectRow.name, projectRow.status, projectRow.horizon, projectRow.priority, projectRow.outcome, projectRow.next_action, projectRow.source, projectRow.buubo_container_id, projectRow.created_at, projectRow.updated_at)
      .run();
  }
  for (const business of DEFAULT_BUSINESSES) {
    await env.DB.prepare('INSERT OR IGNORE INTO business_canvases (id, business_id, canvas_type, snapshot_json, schema_version, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(`canvas-${business.id}`, business.id, 'structured_bmc_snapshot', '{}', 'structured-bmc-snapshot', 'sativa-os-seed', now, now)
      .run();
  }
}


async function overview(env: Env) {
  const [summary, accounts, transactions, businesses] = await Promise.all([ledgerSummary(env), accountsWithBalances(env), transactionsWithJoins(env), businessesWithReports(env)]);
  return { summary, accounts, transactions, businesses, entries: DEFAULT_ENTRIES };
}

async function missionControlData(env: Env) {
  const [summary, accounts, cashflow, assets, businesses, projects, tax] = await Promise.all([
    ledgerSummary(env), accountsWithBalances(env), cashflowReport(env), assetTable(env), businessesWithReports(env), projectsWithBusiness(env), taxSummary(env),
  ]);
  return { loadedAt: new Date().toISOString(), source: 'Cloudflare D1', summary, accounts, cashflow, assets: assets.assets, businesses, projects, tax, mcp: mcpManifest('').tools.map((tool) => tool.name) };
}

async function directorData(env: Env) {
  const [director, projects] = await Promise.all([directorSummary(env), projectsWithBusiness(env)]);
  return { loadedAt: new Date().toISOString(), source: 'Cloudflare D1', ...director, projects, mcp: mcpManifest('').tools.map((tool) => tool.name) };
}

async function businessModelData(env: Env) {
  const [businesses, blocks, changes] = await Promise.all([businessesWithReports(env), businessModelWithBusiness(env), businessModelChanges(env)]);
  return { loadedAt: new Date().toISOString(), source: 'Cloudflare D1', businesses, blocks, changes };
}

async function dailyBrief(env: Env) {
  const summary = await ledgerSummary(env);
  return {
    date: new Date().toISOString().slice(0, 10),
    question: 'What should Adit pay attention to, build, sell, or ignore today so Sativa compounds?',
    moneySituation: summary,
    warnings: summary.status === 'critical' ? ['Critical cash situation', 'WARAS is an asset but out of free cash', 'Find external cash source: sell, collect, deliver, or earn'] : [],
    nextAction: 'Protect free cash, categorize every flow, and create/collect new cash.',
  };
}

async function ledgerSummary(env: Env) {
  const accounts = await accountsWithBalances(env);
  const transactions = await transactionsWithJoins(env);
  const cashIn = transactions.reduce((sum, transaction) => sum + Number(transaction.cash_in), 0);
  const cashOut = transactions.reduce((sum, transaction) => sum + Number(transaction.cash_out), 0);
  const freeCash = accounts.filter((account) => account.is_spendable === 1).reduce((sum, account) => sum + Number(account.balance), 0);
  const restrictedAssets = accounts.filter((account) => account.is_spendable === 0).reduce((sum, account) => sum + Number(account.balance), 0);
  const savings = accounts.filter((account) => account.account_type === 'savings').reduce((sum, account) => sum + Number(account.balance), 0);
  const totalTrackedAssets = freeCash + restrictedAssets;
  return { currency: 'IDR', cashIn, cashOut, netCashflow: cashIn - cashOut, freeCash, restrictedAssets, savings, totalTrackedAssets, status: freeCash < 1_500_000 ? 'critical' : 'stable', warasOwnership: { Adit: 65, Sonny: 35 }, note: 'WARAS Rp1,000,000 is out of Adit free cash and tracked as WARAS asset in Sonny bank account.' };
}

async function accountsWithBalances(env: Env) {
  const accounts = await listAccounts(env);
  const transactions = await listTransactions(env);
  return accounts.map((account) => {
    const balance = transactions.filter((transaction) => transaction.account_id === account.id).reduce((sum, transaction) => sum + Number(transaction.cash_in) - Number(transaction.cash_out), 0);
    return { ...account, balance };
  });
}

async function transactionsWithJoins(env: Env): Promise<Array<Transaction & Record<string, unknown> & { running_balance: number }>> {
  const result = await env.DB.prepare(`SELECT t.*, a.name AS account_name, a.account_type, a.is_spendable, b.name AS business_name, b.ownership_json, c.name AS category_name, c.kind AS category_kind, c.tax_relevant
    FROM ledger_transactions t
    JOIN accounts a ON a.id = t.account_id
    LEFT JOIN businesses b ON b.id = t.business_id
    JOIN ledger_categories c ON c.id = t.category_id
    WHERE t.deleted_at IS NULL AND COALESCE(t.is_void, 0) = 0
    ORDER BY t.transaction_date ASC, t.created_at ASC`).all<Transaction & Record<string, unknown>>();
  let balances: Record<string, number> = {};
  return (result.results ?? []).map((transaction) => {
    const accountId = String(transaction.account_id);
    balances[accountId] = (balances[accountId] ?? 0) + Number(transaction.cash_in) - Number(transaction.cash_out);
    return { ...transaction, running_balance: balances[accountId] };
  });
}

async function cashflowReport(env: Env) {
  const transactions = await transactionsWithJoins(env);
  return {
    period: { start: today, end: today },
    rows: transactions,
    totals: {
      cashIn: transactions.reduce((sum, transaction) => sum + Number(transaction.cash_in), 0),
      cashOut: transactions.reduce((sum, transaction) => sum + Number(transaction.cash_out), 0),
      net: transactions.reduce((sum, transaction) => sum + Number(transaction.cash_in) - Number(transaction.cash_out), 0),
    },
  };
}

async function assetTable(env: Env) {
  const accounts = await accountsWithBalances(env);
  return {
    assets: accounts.map((account) => ({ name: account.name, type: account.account_type, owner: account.owner, liquidity: account.is_spendable ? 'high/spendable' : 'restricted/business asset', value: account.balance, notes: account.notes })),
  };
}

async function businessesWithReports(env: Env) {
  const businesses = await listBusinesses(env);
  const transactions = await transactionsWithJoins(env);
  return businesses.map((business) => {
    const rows = transactions.filter((transaction) => transaction.business_id === business.id);
    const revenue = rows.filter((transaction) => Number(transaction.cash_in) > 0 && transaction.transaction_type !== 'asset').reduce((sum, transaction) => sum + Number(transaction.cash_in), 0);
    const expenses = rows.filter((transaction) => Number(transaction.cash_out) > 0 && transaction.transaction_type !== 'investment').reduce((sum, transaction) => sum + Number(transaction.cash_out), 0);
    const investment = rows.filter((transaction) => transaction.transaction_type === 'asset').reduce((sum, transaction) => sum + Number(transaction.cash_in), 0);
    return { ...business, ownership: JSON.parse(business.ownership_json || '{}'), revenue, expenses, investment, netCash: revenue - expenses, transactionCount: rows.length };
  });
}

async function taxSummary(env: Env) {
  const transactions = await transactionsWithJoins(env);
  const taxRows = transactions.filter((transaction) => Number(transaction['tax_relevant']) === 1 || Boolean(transaction.tax_tag));
  return { period: { start: today, end: today }, rows: taxRows, income: taxRows.reduce((sum, transaction) => sum + (Number(transaction.cash_in) > 0 ? Number(transaction.cash_in) : 0), 0), deductionsOrTrackedOutflows: taxRows.reduce((sum, transaction) => sum + Number(transaction.cash_out), 0), note: 'Simplified tax/SPT preparation view. Review with accountant before filing.' };
}

async function directorSummary(env: Env) {
  const [summary, visionGoals, okrs, weeklyReviews, businesses, blocks] = await Promise.all([
    ledgerSummary(env), listVisionGoals(env), okrsWithBusiness(env), listWeeklyReviews(env), businessesWithReports(env), businessModelWithBusiness(env),
  ]);
  return { money: summary, visionGoals, okrs, weeklyReviews, businesses, businessModelBlocks: blocks, directorQuestion: 'What must Adit control this week so Sativa compounds toward the 300T vision?' };
}

async function listVisionGoals(env: Env) {
  const result = await env.DB.prepare('SELECT * FROM vision_goals ORDER BY horizon ASC, name ASC').all<VisionGoal>();
  return result.results ?? [];
}

async function listWeeklyReviews(env: Env) {
  const result = await env.DB.prepare('SELECT * FROM weekly_reviews ORDER BY week_start DESC').all<WeeklyReview>();
  return result.results ?? [];
}

async function okrsWithBusiness(env: Env) {
  const result = await env.DB.prepare(`SELECT o.*, b.name AS business_name FROM okrs o LEFT JOIN businesses b ON b.id = o.business_id ORDER BY o.period ASC, o.objective ASC`).all<Okr & Record<string, unknown>>();
  return (result.results ?? []).map((okr) => ({ ...okr, keyResults: JSON.parse(String(okr.key_results_json || '[]')) }));
}

async function businessModelWithBusiness(env: Env) {
  const result = await env.DB.prepare(`SELECT bm.*, b.name AS business_name FROM business_model_blocks bm JOIN businesses b ON b.id = bm.business_id ORDER BY b.name ASC, bm.block_key ASC`).all<BusinessModelBlock & Record<string, unknown>>();
  return (result.results ?? []).map((block) => ({ ...block, elements: JSON.parse(String(block.elements_json || '[]')) }));
}

async function upsertBusinessModelBlock(env: Env, payload: NewBusinessModelBlock) {
  const businessId = requireText(payload.business_id, 'Missing business_id');
  const blockKey = requireText(payload.block_key, 'Missing block_key');
  const found = BMC_BLOCKS.find(([key]) => key === blockKey);
  const blockName = typeof payload.block_name === 'string' && payload.block_name ? payload.block_name : found ? found[1] : blockKey;
  const elements = typeof payload.elements_json === 'string' ? payload.elements_json : JSON.stringify([]);
  const id = `bmc-${businessId}-${blockKey}`;
  const updatedAt = new Date().toISOString();
  const oldBlock = await env.DB.prepare('SELECT * FROM business_model_blocks WHERE id = ? LIMIT 1').bind(id).first<BusinessModelBlock>();
  await env.DB.prepare(`INSERT INTO business_model_blocks (id, business_id, block_key, block_name, elements_json, status, control_question, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET elements_json = excluded.elements_json, status = excluded.status, control_question = excluded.control_question, updated_at = excluded.updated_at`)
    .bind(id, businessId, blockKey, blockName, elements, payload.status ?? 'active', payload.control_question ?? `What must be true for ${blockName} to compound toward Sativa 300T?`, now, updatedAt)
    .run();
  const block = { id, business_id: businessId, block_key: blockKey, block_name: blockName, elements: JSON.parse(elements), updated_at: updatedAt };
  await audit(env, 'business_model_block', id, oldBlock ? 'update' : 'create', oldBlock ?? {}, block, `${blockName} BMC block saved`, 'sativa-ui', { business_id: businessId, block_key: blockKey, section_url: `/business-model?business=${encodeURIComponent(businessId)}#${encodeURIComponent(blockKey)}` });
  return block;
}

async function createTransaction(env: Env, payload: NewTransaction) {
  await validateTransactionPayload(env, payload);
  if (payload.external_ref) {
    const duplicate = await env.DB.prepare('SELECT * FROM ledger_transactions WHERE external_ref = ? AND deleted_at IS NULL LIMIT 1').bind(payload.external_ref).first<Transaction>();
    if (duplicate) return duplicate;
  }
  const createdAt = new Date().toISOString();
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    transaction_date: typeof payload.transaction_date === 'string' ? payload.transaction_date : new Date().toISOString().slice(0, 10),
    account_id: requireText(payload.account_id, 'Missing account_id'),
    business_id: typeof payload.business_id === 'string' && payload.business_id ? payload.business_id : 'personal-sativa',
    category_id: typeof payload.category_id === 'string' && payload.category_id ? payload.category_id : 'uncategorized',
    transaction_type: typeof payload.transaction_type === 'string' && payload.transaction_type ? payload.transaction_type : 'expense',
    description: requireText(payload.description, 'Missing description'),
    cash_in: toInteger(payload.cash_in),
    cash_out: toInteger(payload.cash_out),
    counterparty: typeof payload.counterparty === 'string' ? payload.counterparty : null,
    tax_tag: typeof payload.tax_tag === 'string' ? payload.tax_tag : null,
    reflection: typeof payload.reflection === 'string' ? payload.reflection : '',
    metadata_json: typeof payload.metadata_json === 'string' ? payload.metadata_json : '{}',
    external_ref: typeof payload.external_ref === 'string' && payload.external_ref ? payload.external_ref : null,
    transfer_group_id: typeof payload.transfer_group_id === 'string' ? payload.transfer_group_id : null,
    split_parent_id: typeof payload.split_parent_id === 'string' ? payload.split_parent_id : null,
    receipt_ref: typeof payload.receipt_ref === 'string' ? payload.receipt_ref : null,
    is_void: 0,
    void_reason: null,
    deleted_at: null,
    created_at: createdAt,
    updated_at: createdAt,
  };
  await env.DB.prepare(`INSERT INTO ledger_transactions
    (id, transaction_date, account_id, business_id, category_id, transaction_type, description, cash_in, cash_out, counterparty, tax_tag, reflection, metadata_json, external_ref, transfer_group_id, split_parent_id, receipt_ref, is_void, void_reason, deleted_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(transaction.id, transaction.transaction_date, transaction.account_id, transaction.business_id, transaction.category_id, transaction.transaction_type, transaction.description, transaction.cash_in, transaction.cash_out, transaction.counterparty, transaction.tax_tag, transaction.reflection, transaction.metadata_json, transaction.external_ref, transaction.transfer_group_id, transaction.split_parent_id, transaction.receipt_ref, transaction.is_void, transaction.void_reason, transaction.deleted_at, transaction.created_at, transaction.updated_at)
    .run();
  await audit(env, 'transaction', transaction.id, 'create', {}, transaction, 'create transaction');
  return transaction;
}

async function createEntry(env: Env, payload: Partial<Entry>, section: Section) {
  const createdAt = new Date().toISOString();
  const entryRecord = { id: crypto.randomUUID(), section, title: requireText(payload.title, 'Missing title'), body: typeof payload.body === 'string' ? payload.body : '', status: 'open', priority: 3, due_date: null, amount: null, metadata: '{}', created_at: createdAt, updated_at: createdAt };
  await env.DB.prepare('INSERT INTO entries (id, section, title, body, status, priority, due_date, amount, metadata, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(entryRecord.id, entryRecord.section, entryRecord.title, entryRecord.body, entryRecord.status, entryRecord.priority, entryRecord.due_date, entryRecord.amount, entryRecord.metadata, entryRecord.created_at, entryRecord.updated_at)
    .run();
  return entryRecord;
}

async function listAccounts(env: Env) {
  const result = await env.DB.prepare('SELECT * FROM accounts ORDER BY name ASC').all<Account>();
  return result.results ?? [];
}

async function listBusinesses(env: Env) {
  const result = await env.DB.prepare('SELECT * FROM businesses ORDER BY name ASC').all<Business>();
  return result.results ?? [];
}

async function listCategories(env: Env) {
  const result = await env.DB.prepare('SELECT * FROM ledger_categories ORDER BY kind ASC, name ASC').all<Category>();
  return result.results ?? [];
}

async function listTransactions(env: Env, filters: LedgerFilter = {}) {
  const result = await env.DB.prepare('SELECT * FROM ledger_transactions ORDER BY transaction_date ASC, created_at ASC').all<Transaction>();
  let rows = result.results ?? [];
  if (!truthy(filters.include_deleted)) rows = rows.filter((row) => !row.deleted_at);
  if (!truthy(filters.include_voided)) rows = rows.filter((row) => Number(row.is_void ?? 0) === 0);
  if (filters.account_id) rows = rows.filter((row) => row.account_id === filters.account_id);
  if (filters.business_id) rows = rows.filter((row) => row.business_id === filters.business_id);
  if (filters.category_id) rows = rows.filter((row) => row.category_id === filters.category_id);
  if (filters.transaction_type) rows = rows.filter((row) => row.transaction_type === filters.transaction_type);
  if (filters.date_from) rows = rows.filter((row) => row.transaction_date >= String(filters.date_from));
  if (filters.date_to) rows = rows.filter((row) => row.transaction_date <= String(filters.date_to));
  if (filters.counterparty) rows = rows.filter((row) => String(row.counterparty ?? '').toLowerCase().includes(String(filters.counterparty).toLowerCase()));
  if (filters.search) {
    const needle = String(filters.search).toLowerCase();
    rows = rows.filter((row) => [row.description, row.counterparty, row.reflection, row.tax_tag].some((value) => String(value ?? '').toLowerCase().includes(needle)));
  }
  if (filters.min_amount !== undefined) rows = rows.filter((row) => Math.max(Number(row.cash_in), Number(row.cash_out)) >= Number(filters.min_amount));
  if (filters.max_amount !== undefined) rows = rows.filter((row) => Math.max(Number(row.cash_in), Number(row.cash_out)) <= Number(filters.max_amount));
  if (filters.sort === 'date_desc') rows = [...rows].reverse();
  const offset = Math.max(0, toInteger(filters.offset));
  const limit = filters.limit === undefined ? rows.length : Math.max(1, toInteger(filters.limit));
  return rows.slice(offset, offset + limit);
}

async function getTransactionById(env: Env, id: string, includeInactive = true) {
  const transaction = await env.DB.prepare('SELECT * FROM ledger_transactions WHERE id = ? LIMIT 1').bind(id).first<Transaction>();
  if (!transaction) throw new Error(`Missing transaction: ${id}`);
  if (!includeInactive && (transaction.deleted_at || Number(transaction.is_void ?? 0) === 1)) throw new Error(`Inactive transaction: ${id}`);
  return transaction;
}

async function getAccountById(env: Env, id: string) {
  const account = await env.DB.prepare('SELECT * FROM accounts WHERE id = ? LIMIT 1').bind(id).first<Account>();
  if (!account) throw new Error(`Missing account: ${id}`);
  return account;
}

async function getBusinessById(env: Env, id: string) {
  const business = await env.DB.prepare('SELECT * FROM businesses WHERE id = ? LIMIT 1').bind(id).first<Business>();
  if (!business) throw new Error(`Missing business: ${id}`);
  return business;
}

async function getCategoryById(env: Env, id: string) {
  const category = await env.DB.prepare('SELECT * FROM ledger_categories WHERE id = ? LIMIT 1').bind(id).first<Category>();
  if (!category) throw new Error(`Missing category: ${id}`);
  return category;
}

async function validateTransactionPayload(env: Env, payload: NewTransaction) {
  const cashIn = toInteger(payload.cash_in);
  const cashOut = toInteger(payload.cash_out);
  if (cashIn < 0 || cashOut < 0) throw new Error('Amount cannot be negative');
  if (cashIn > 0 && cashOut > 0) throw new Error('cash_in and cash_out cannot both be positive');
  await getAccountById(env, requireText(payload.account_id, 'Missing account_id'));
  await getCategoryById(env, typeof payload.category_id === 'string' && payload.category_id ? payload.category_id : 'uncategorized');
  if (payload.business_id) await getBusinessById(env, String(payload.business_id));
}

async function audit(env: Env, entityType: string, entityId: string, action: string, oldValue: unknown, newValue: unknown, reason: string, actor = 'sativa-mcp', metadata: unknown = {}) {
  const timestamp = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO ledger_audit_log (id, entity_type, entity_id, action, old_value_json, new_value_json, reason, actor, created_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), entityType, entityId, action, JSON.stringify(oldValue ?? {}), JSON.stringify(newValue ?? {}), reason, actor, timestamp, JSON.stringify(metadata ?? {}))
    .run();
}

function parsePatch(payload: PatchPayload) {
  if (typeof payload.patch_json === 'string') return JSON.parse(payload.patch_json) as Record<string, unknown>;
  if (typeof payload.patch_json === 'object' && payload.patch_json !== null) return payload.patch_json as Record<string, unknown>;
  return {};
}

function truthy(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true';
}


async function projectsWithBusiness(env: Env) {
  const result = await env.DB.prepare(`SELECT p.*, b.name AS business_name, b.ownership_json,
      (SELECT action FROM project_action_events e WHERE e.project_id = p.id ORDER BY e.happened_at DESC LIMIT 1) AS last_action,
      (SELECT happened_at FROM project_action_events e WHERE e.project_id = p.id ORDER BY e.happened_at DESC LIMIT 1) AS last_action_at
    FROM projects p JOIN businesses b ON b.id = p.business_id
    ORDER BY b.name ASC, p.priority ASC, p.name ASC`).all<Project & Record<string, unknown>>();
  return (result.results ?? []).map((row) => ({ ...row, ownership: JSON.parse(String(row.ownership_json || '{}')) }));
}


async function updateProject(env: Env, projectId: string, payload: NewProject) {
  const current = await env.DB.prepare('SELECT * FROM projects WHERE id = ? LIMIT 1').bind(projectId).first<Project>();
  if (!current) throw new Error(`Missing project: ${projectId}`);
  const allowedStatus = new Set(['todo', 'doing', 'review', 'backlog', 'done', 'active', 'ongoing', 'paused', 'stopped']);
  const status = typeof payload.status === 'string' && allowedStatus.has(payload.status) ? normalizeProjectStatus(payload.status) : current.status;
  const name = typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : current.name;
  const horizon = typeof payload.horizon === 'string' && payload.horizon.trim() ? payload.horizon.trim() : current.horizon;
  const priority = Number.isFinite(Number(payload.priority)) ? Number(payload.priority) : current.priority;
  const outcome = typeof payload.outcome === 'string' ? payload.outcome : current.outcome;
  const nextAction = typeof payload.next_action === 'string' ? payload.next_action : current.next_action;
  const updatedAt = new Date().toISOString();
  await env.DB.prepare('UPDATE projects SET name = ?, status = ?, horizon = ?, priority = ?, outcome = ?, next_action = ?, updated_at = ? WHERE id = ?')
    .bind(name, status, horizon, priority, outcome, nextAction, updatedAt, projectId).run();
  const updated = await env.DB.prepare('SELECT * FROM projects WHERE id = ? LIMIT 1').bind(projectId).first<Project>();
  await audit(env, 'project', projectId, 'update', current, updated, `project updated to ${status}`, 'sativa-ui', { business_id: current.business_id, section_url: `/#${encodeURIComponent(projectId)}` });
  return updated;
}

function normalizeProjectStatus(status: string) {
  return ({ active: 'todo', ongoing: 'doing', paused: 'backlog', stopped: 'done' } as Record<string, string>)[status] || status;
}

async function recordProjectAction(env: Env, projectId: string, payload: Record<string, unknown>) {
  const action = requireText(payload.action, 'Missing action');
  if (!['play', 'pause', 'stop', 'todo', 'doing', 'review', 'backlog', 'done'].includes(action)) throw new Error('Invalid project action');
  const project = await env.DB.prepare('SELECT * FROM projects WHERE id = ? LIMIT 1').bind(projectId).first<Project>();
  if (!project) throw new Error(`Missing project: ${projectId}`);
  const happenedAt = new Date().toISOString();
  const status = ({ play: 'doing', pause: 'backlog', stop: 'done' } as Record<string, string>)[action] || normalizeProjectStatus(action);
  const event: ProjectAction = { id: crypto.randomUUID(), project_id: projectId, business_id: project.business_id, action, happened_at: happenedAt, note: typeof payload.note === 'string' ? payload.note : '', created_at: happenedAt };
  await env.DB.prepare('INSERT INTO project_action_events (id, project_id, business_id, action, happened_at, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(event.id, event.project_id, event.business_id, event.action, event.happened_at, event.note, event.created_at).run();
  await env.DB.prepare('UPDATE projects SET status = ?, updated_at = ? WHERE id = ?').bind(status, happenedAt, projectId).run();
  await audit(env, 'project', projectId, action, project, { ...project, status, updated_at: happenedAt }, `project ${action}`, 'sativa-ui', { business_id: project.business_id, section_url: `/projects#${encodeURIComponent(projectId)}` });
  return { event, project: await env.DB.prepare('SELECT * FROM projects WHERE id = ? LIMIT 1').bind(projectId).first<Project>(), ongoingProjectCount: await ongoingProjectCount(env) };
}

async function ongoingProjectCount(env: Env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM projects WHERE status = 'ongoing'").first<{ count: number }>();
  return Number(row?.count ?? 0);
}

async function createProject(env: Env, payload: NewProject) {
  const createdAt = new Date().toISOString();
  const projectRecord: Project = {
    id: crypto.randomUUID(),
    business_id: requireText(payload.business_id, 'Missing business_id'),
    name: requireText(payload.name, 'Missing name'),
    status: typeof payload.status === 'string' && payload.status ? payload.status : 'active',
    horizon: typeof payload.horizon === 'string' && payload.horizon ? payload.horizon : 'now',
    priority: toInteger(payload.priority || 3),
    outcome: typeof payload.outcome === 'string' ? payload.outcome : '',
    next_action: typeof payload.next_action === 'string' ? payload.next_action : '',
    source: typeof payload.source === 'string' && payload.source ? payload.source : 'mission-control',
    buubo_container_id: typeof payload.buubo_container_id === 'string' ? payload.buubo_container_id : null,
    created_at: createdAt,
    updated_at: createdAt,
  };
  await env.DB.prepare('INSERT INTO projects (id, business_id, name, status, horizon, priority, outcome, next_action, source, buubo_container_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(projectRecord.id, projectRecord.business_id, projectRecord.name, projectRecord.status, projectRecord.horizon, projectRecord.priority, projectRecord.outcome, projectRecord.next_action, projectRecord.source, projectRecord.buubo_container_id, projectRecord.created_at, projectRecord.updated_at)
    .run();
  return projectRecord;
}

async function businessMetricsWithBusiness(env: Env) {
  const result = await env.DB.prepare(`SELECT bm.*, b.name AS business_name, b.status AS business_status
    FROM business_metrics bm JOIN businesses b ON b.id = bm.business_id
    ORDER BY b.name ASC`).all<BusinessMetric & Record<string, unknown>>();
  return (result.results ?? []).map((row) => ({ ...row, shareholding: JSON.parse(String(row.shareholding_json || '{}')) }));
}

async function getBusinessCanvas(env: Env, businessId: string) {
  const result = await env.DB.prepare('SELECT * FROM business_canvases WHERE business_id = ?').bind(businessId).first<BusinessCanvas>();
  if (!result) return { business_id: businessId, snapshot: null, updated_at: null };
  return { ...result, snapshot: JSON.parse(result.snapshot_json || '{}') };
}

async function saveBusinessCanvas(env: Env, businessId: string, payload: NewBusinessCanvas) {
  const updatedAt = new Date().toISOString();
  const snapshotJson = JSON.stringify(payload.snapshot ?? (typeof payload.snapshot_json === 'string' ? JSON.parse(payload.snapshot_json || '{}') : {}));
  await env.DB.prepare(`INSERT INTO business_canvases (id, business_id, canvas_type, snapshot_json, schema_version, updated_by, created_at, updated_at)
    VALUES (?, ?, 'structured_bmc_snapshot', ?, 'structured-bmc-snapshot', 'sativa-os-ui', ?, ?)
    ON CONFLICT(business_id) DO UPDATE SET snapshot_json = excluded.snapshot_json, updated_by = excluded.updated_by, updated_at = excluded.updated_at`)
    .bind(`canvas-${businessId}`, businessId, snapshotJson, updatedAt, updatedAt)
    .run();
  return getBusinessCanvas(env, businessId);
}

async function statusChanges(env: Env) {
  const result = await env.DB.prepare('SELECT * FROM ledger_audit_log ORDER BY created_at DESC LIMIT 12').all<StatusChange>();
  return { loadedAt: new Date().toISOString(), changes: (result.results ?? []).map(formatChange) };
}

async function businessModelChanges(env: Env): Promise<BusinessChange[]> {
  const result = await env.DB.prepare(`SELECT * FROM ledger_audit_log WHERE entity_type = 'business_model_block' ORDER BY created_at DESC LIMIT 50`).all<StatusChange>();
  const byBusiness: Record<string, BusinessChange> = {};
  for (const change of result.results ?? []) {
    const metadata = safeJson(change.metadata_json);
    const businessId = String(metadata.business_id ?? '');
    if (!businessId) continue;
    byBusiness[businessId] ??= { business_id: businessId, latest_updated_at: change.created_at, latest_changes: [] };
    byBusiness[businessId].latest_updated_at ||= change.created_at;
    if (byBusiness[businessId].latest_changes.length < 3) byBusiness[businessId].latest_changes.push(formatChange(change));
  }
  return Object.values(byBusiness);
}

function formatChange(change: StatusChange) {
  const metadata = safeJson(change.metadata_json);
  return { ...change, metadata, label: `${change.action} ${change.entity_type.replaceAll('_', ' ')}`, sectionUrl: String(metadata.section_url ?? '') };
}

async function buuboSyncStatus(env: Env) {
  const projects = await projectsWithBusiness(env);
  return {
    status: 'pending_adapter',
    note: 'Mission Control project containers are ready. Real two-way Buubo sync requires Buubo API/webhook credentials or shared database access.',
    provisionableProjects: projects.length,
    directions: ['mission-control-to-buubo containers/tags', 'buubo-to-mission-control time/status rollups'],
  };
}

async function serveFrontend(request: Request, env: Env) {
  if ('ASSETS' in env && env.ASSETS) {
    const url = new URL(request.url);
    const isStaticAsset = url.pathname.includes('.');
    const assetRequest = new Request(isStaticAsset ? request : new URL('/', request.url), request);
    const response = await env.ASSETS.fetch(assetRequest);
    if (isStaticAsset) return response;
    const headers = new Headers(response.headers);
    headers.set('cache-control', 'no-store, must-revalidate');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
  const url = new URL(request.url);
  if (url.pathname === '/') return htmlResponse(renderMissionControlShell());
  if (url.pathname === '/add-transaction') return htmlResponse(renderAddTransactionShell());
  if (url.pathname === '/director') return htmlResponse(renderDirectorShell());
  if (url.pathname === '/business-model') return htmlResponse(renderBusinessModelShell());
  if (url.pathname === '/projects') return htmlResponse(renderProjectsShell());
  return jsonResponse({ error: 'Not found' }, 404);
}

async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error('Invalid JSON body');
  }
}

function requireText(value: unknown, message: string) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(message);
  return value.trim();
}

function toInteger(value: unknown) {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? Math.round(numberValue) : 0;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), { status, headers: jsonHeaders });
}

function htmlResponse(body: string): Response {
  return new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}


async function updateTransaction(env: Env, payload: PatchPayload) {
  const id = requireText(payload.transaction_id, 'Missing transaction_id');
  const oldRow = await getTransactionById(env, id);
  const patch = parsePatch(payload);
  const allowed = ['transaction_date', 'account_id', 'business_id', 'category_id', 'transaction_type', 'description', 'cash_in', 'cash_out', 'counterparty', 'tax_tag', 'reflection', 'metadata_json'];
  const next: Record<string, unknown> = { ...oldRow };
  for (const key of allowed) if (key in patch) next[key] = patch[key];
  await validateTransactionPayload(env, next as NewTransaction);
  next.cash_in = toInteger(next.cash_in);
  next.cash_out = toInteger(next.cash_out);
  next.updated_at = new Date().toISOString();
  await env.DB.prepare(`UPDATE ledger_transactions SET transaction_date = ?, account_id = ?, business_id = ?, category_id = ?, transaction_type = ?, description = ?, cash_in = ?, cash_out = ?, counterparty = ?, tax_tag = ?, reflection = ?, metadata_json = ?, updated_at = ? WHERE id = ?`)
    .bind(next.transaction_date, next.account_id, next.business_id, next.category_id, next.transaction_type, next.description, next.cash_in, next.cash_out, next.counterparty, next.tax_tag, next.reflection, next.metadata_json ?? '{}', next.updated_at, id)
    .run();
  await audit(env, 'transaction', id, 'update', oldRow, next, requireText(payload.edit_reason, 'Missing edit_reason'), String(payload.edited_by || payload.actor || 'chatgpt/mcp'), { source_tool: 'edit_transaction', patch });
  return { transaction: await getTransactionById(env, id), moneySituation: await ledgerSummary(env) };
}

async function reclassifyTransaction(env: Env, payload: PatchPayload) {
  const patch: Record<string, unknown> = {};
  for (const key of ['category_id', 'business_id', 'description', 'counterparty', 'tax_tag']) if (payload[key] !== undefined) patch[key] = payload[key];
  return updateTransaction(env, { transaction_id: payload.transaction_id, patch_json: patch, edit_reason: String(payload.classification_note || payload.edit_reason || 'reclassify transaction') });
}

async function voidTransaction(env: Env, payload: PatchPayload) {
  const id = requireText(payload.transaction_id, 'Missing transaction_id');
  const oldRow = await getTransactionById(env, id);
  const updatedAt = new Date().toISOString();
  await env.DB.prepare('UPDATE ledger_transactions SET is_void = 1, void_reason = ?, updated_at = ? WHERE id = ?').bind(requireText(payload.void_reason, 'Missing void_reason'), updatedAt, id).run();
  const transaction = await getTransactionById(env, id);
  await audit(env, 'transaction', id, 'void', oldRow, transaction, String(payload.void_reason), String(payload.voided_by || payload.actor || 'chatgpt/mcp'), { source_tool: 'void_transaction' });
  return { transaction, moneySituation: await ledgerSummary(env) };
}

async function deleteTransaction(env: Env, payload: PatchPayload) {
  const id = requireText(payload.transaction_id, 'Missing transaction_id');
  const oldRow = await getTransactionById(env, id);
  const deletedAt = new Date().toISOString();
  await env.DB.prepare('UPDATE ledger_transactions SET deleted_at = ?, updated_at = ? WHERE id = ?').bind(deletedAt, deletedAt, id).run();
  const transaction = await getTransactionById(env, id);
  await audit(env, 'transaction', id, 'soft_delete', oldRow, transaction, requireText(payload.delete_reason, 'Missing delete_reason'), String(payload.deleted_by || payload.actor || 'chatgpt/mcp'), { source_tool: 'soft_delete_transaction' });
  return { transaction, moneySituation: await ledgerSummary(env) };
}

async function recordTransfer(env: Env, payload: Record<string, unknown>) {
  const amount = toInteger(payload.amount);
  const feeAmount = toInteger(payload.fee_amount);
  if (amount <= 0) throw new Error('Transfer amount must be positive');
  if (feeAmount < 0) throw new Error('fee_amount cannot be negative');
  const from = requireText(payload.from_account_id, 'Missing from_account_id');
  const to = requireText(payload.to_account_id, 'Missing to_account_id');
  if (from === to) throw new Error('from_account_id and to_account_id must differ');
  await getAccountById(env, from); await getAccountById(env, to);
  if (payload.external_ref) {
    const existing = await env.DB.prepare('SELECT transfer_group_id FROM ledger_transactions WHERE external_ref = ? LIMIT 1').bind(`${payload.external_ref}:source`).first<Record<string, string>>();
    if (existing?.transfer_group_id) return { transferGroup: await env.DB.prepare('SELECT * FROM transfer_groups WHERE id = ?').bind(existing.transfer_group_id).first(), accounts: await accountsWithBalances(env), moneySituation: await ledgerSummary(env), idempotent: true };
  }
  const groupId = crypto.randomUUID();
  const date = typeof payload.transaction_date === 'string' ? payload.transaction_date : new Date().toISOString().slice(0, 10);
  const description = typeof payload.description === 'string' && payload.description ? payload.description : 'Account transfer';
  await env.DB.prepare('INSERT INTO transfer_groups (id, transaction_date, description, from_account_id, to_account_id, amount, fee_amount, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(groupId, date, description, from, to, amount, feeAmount, new Date().toISOString()).run();
  const businessId = typeof payload.business_id === 'string' && payload.business_id ? payload.business_id : 'personal-sativa';
  const reflection = typeof payload.reflection === 'string' ? payload.reflection : '';
  const out = await createTransaction(env, { transaction_date: date, account_id: from, business_id: businessId, category_id: String(payload.category_id || 'transfer'), transaction_type: 'transfer', description: `${description} — source leg`, cash_in: 0, cash_out: amount, counterparty: String(payload.counterparty ?? to), reflection, transfer_group_id: groupId, external_ref: payload.external_ref ? `${payload.external_ref}:source` : undefined, metadata_json: JSON.stringify({ transfer_group_id: groupId, leg: 'source' }) });
  const inn = await createTransaction(env, { transaction_date: date, account_id: to, business_id: businessId, category_id: String(payload.category_id || 'transfer'), transaction_type: 'transfer', description: `${description} — destination leg`, cash_in: amount, cash_out: 0, counterparty: String(payload.counterparty ?? from), reflection, transfer_group_id: groupId, external_ref: payload.external_ref ? `${payload.external_ref}:destination` : undefined, metadata_json: JSON.stringify({ transfer_group_id: groupId, leg: 'destination' }) });
  let fee: Transaction | null = null;
  if (feeAmount > 0) fee = await createTransaction(env, { transaction_date: date, account_id: String(payload.fee_account_id || from), business_id: businessId, category_id: String(payload.fee_category_id || 'bank-fee'), transaction_type: 'expense', description: `${description} — transfer fee`, cash_in: 0, cash_out: feeAmount, counterparty: String(payload.counterparty ?? 'transfer fee'), reflection, transfer_group_id: groupId, external_ref: payload.external_ref ? `${payload.external_ref}:fee` : undefined, metadata_json: JSON.stringify({ transfer_group_id: groupId, leg: 'fee' }) });
  await audit(env, 'transfer_group', groupId, 'create', {}, { out, inn, fee }, String(payload.creation_reason || payload.edit_reason || 'record transfer'), 'chatgpt/mcp', { source_tool: 'create_transfer', metadata: safeJson(payload.metadata_json) });
  return { transferGroup: { id: groupId, source: out, destination: inn, fee }, accounts: await accountsWithBalances(env), moneySituation: await ledgerSummary(env) };
}

async function splitTransaction(env: Env, payload: Record<string, unknown>) {
  const id = requireText(payload.parent_transaction_id ?? payload.transaction_id, 'Missing parent_transaction_id');
  const parent = await getTransactionById(env, id, false);
  const splits = JSON.parse(requireText(payload.splits_json, 'Missing splits_json')) as Array<Record<string, unknown>>;
  const original = Math.max(Number(parent.cash_in), Number(parent.cash_out));
  const total = splits.reduce((sum, split) => sum + toInteger(split.amount), 0);
  if (total !== original) throw new Error(`Split total ${total} must equal original amount ${original}`);
  await voidTransaction(env, { transaction_id: id, void_reason: requireText(payload.split_reason, 'Missing split_reason') });
  const children: Transaction[] = [];
  for (const split of splits) {
    const amount = toInteger(split.amount);
    children.push(await createTransaction(env, { transaction_date: parent.transaction_date, account_id: parent.account_id, business_id: parent.business_id ?? undefined, category_id: requireText(split.category_id, 'Missing split category_id'), transaction_type: parent.transaction_type, description: requireText(split.description, 'Missing split description'), cash_in: Number(parent.cash_in) > 0 ? amount : 0, cash_out: Number(parent.cash_out) > 0 ? amount : 0, counterparty: parent.counterparty, tax_tag: parent.tax_tag, reflection: parent.reflection, split_parent_id: parent.id, metadata_json: JSON.stringify({ split_parent_id: parent.id }) }));
  }
  await audit(env, 'transaction', id, 'split', parent, children, requireText(payload.split_reason, 'Missing split_reason'), 'chatgpt/mcp', { source_tool: 'create_split', child_count: children.length });
  return { parent: await getTransactionById(env, id), splits: children, moneySituation: await ledgerSummary(env) };
}

async function addTransactionNote(env: Env, payload: Record<string, unknown>) {
  const transactionId = requireText(payload.transaction_id, 'Missing transaction_id');
  await getTransactionById(env, transactionId);
  const note = { id: crypto.randomUUID(), transaction_id: transactionId, note: requireText(payload.note, 'Missing note'), note_type: typeof payload.note_type === 'string' ? payload.note_type : 'note', created_at: new Date().toISOString() };
  await env.DB.prepare('INSERT INTO transaction_notes (id, transaction_id, note, note_type, created_at) VALUES (?, ?, ?, ?, ?)').bind(note.id, note.transaction_id, note.note, note.note_type, note.created_at).run();
  await audit(env, 'transaction', transactionId, 'add_note', {}, note, note.note_type, 'chatgpt/mcp', { source_tool: 'add_transaction_note', metadata: safeJson(payload.metadata_json) });
  return { note, transaction: await getTransactionFull(env, transactionId) };
}

async function attachReceipt(env: Env, payload: Record<string, unknown>) {
  const transactionId = requireText(payload.transaction_id, 'Missing transaction_id');
  const oldRow = await getTransactionById(env, transactionId);
  const receipt = { file_ref: requireText(payload.receipt_ref ?? payload.file_ref, 'Missing receipt_ref'), receipt_url: String(payload.receipt_url ?? ''), ocr_text: String(payload.receipt_text ?? payload.ocr_text ?? ''), source: String(payload.source ?? 'manual'), metadata: safeJson(payload.metadata_json) };
  await env.DB.prepare('UPDATE ledger_transactions SET receipt_ref = ?, metadata_json = ?, updated_at = ? WHERE id = ?').bind(receipt.file_ref, JSON.stringify({ ...safeJson(oldRow.metadata_json), receipt }), new Date().toISOString(), transactionId).run();
  const transaction = await getTransactionById(env, transactionId);
  await audit(env, 'transaction', transactionId, 'attach_receipt', oldRow, transaction, 'attach receipt', 'chatgpt/mcp', { source_tool: 'attach_receipt', receipt_ref: receipt.file_ref });
  return { receipt, transaction };
}

async function getTransactionFull(env: Env, transactionId: string) {
  const transaction = await getTransactionById(env, transactionId);
  const notes = (await env.DB.prepare('SELECT * FROM transaction_notes WHERE transaction_id = ? ORDER BY created_at ASC').bind(transactionId).all()).results ?? [];
  const auditRows = (await env.DB.prepare('SELECT * FROM ledger_audit_log WHERE entity_type = ? AND entity_id = ? ORDER BY created_at ASC').bind('transaction', transactionId).all()).results ?? [];
  const splits = (await env.DB.prepare('SELECT * FROM ledger_transactions WHERE split_parent_id = ? ORDER BY transaction_date ASC, created_at ASC').bind(transactionId).all()).results ?? [];
  const transferGroup = transaction.transfer_group_id ? await env.DB.prepare('SELECT * FROM transfer_groups WHERE id = ?').bind(transaction.transfer_group_id).first() : null;
  return { transaction, transferGroup, splits, notes, audit: auditRows, receipt: transaction.receipt_ref ? { file_ref: transaction.receipt_ref, metadata: safeJson(transaction.metadata_json) } : null };
}

async function reconcileAccount(env: Env, payload: Record<string, unknown>) {
  const accountId = requireText(payload.account_id, 'Missing account_id');
  const actual = toInteger(payload.actual_balance);
  const before = (await accountsWithBalances(env)).find((account) => account.id === accountId);
  if (!before) throw new Error(`Missing account: ${accountId}`);
  const expected = Number(before.balance);
  const diff = actual - expected;
  let adjustment: Transaction | null = null;
  if (diff !== 0) adjustment = await createTransaction(env, { transaction_date: String(payload.reconciliation_date || new Date().toISOString().slice(0, 10)), account_id: accountId, business_id: 'personal-sativa', category_id: 'reconciliation', transaction_type: 'adjustment', description: `Reconcile ${before.name} to actual balance`, cash_in: diff > 0 ? diff : 0, cash_out: diff < 0 ? Math.abs(diff) : 0, counterparty: 'reconciliation', reflection: String(payload.reason ?? '') });
  await audit(env, 'account', accountId, 'reconcile', { expected }, { actual, diff, adjustment }, String(payload.reason ?? 'reconcile account'), 'chatgpt/mcp', { source_tool: 'reconcile_account' });
  return { account_id: accountId, expected_balance: expected, actual_balance: actual, difference: diff, adjustment, after: (await accountsWithBalances(env)).find((account) => account.id === accountId), moneySituation: await ledgerSummary(env) };
}

async function createAccount(env: Env, payload: Record<string, unknown>) {
  const account = { id: requireText(payload.account_id ?? payload.id, 'Missing account_id'), name: requireText(payload.name, 'Missing name'), account_type: String(payload.account_type ?? 'cash'), owner: String(payload.owner ?? 'Adit'), currency: String(payload.currency ?? 'IDR'), is_spendable: truthy(payload.spendable ?? payload.is_spendable) ? 1 : 0, is_restricted: truthy(payload.is_restricted) ? 1 : 0, status: String(payload.status ?? 'active'), notes: String(payload.notes ?? ''), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  await env.DB.prepare('INSERT INTO accounts (id, name, account_type, owner, currency, is_spendable, is_restricted, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(account.id, account.name, account.account_type, account.owner, account.currency, account.is_spendable, account.is_restricted, account.status, account.notes, account.created_at, account.updated_at).run();
  await audit(env, 'account', account.id, 'create', {}, account, 'create account');
  return { account, accounts: await accountsWithBalances(env) };
}

async function updateAccount(env: Env, payload: PatchPayload) {
  const id = requireText(payload.account_id, 'Missing account_id');
  const oldRow = await getAccountById(env, id);
  const patch = parsePatch(payload);
  const next = { ...oldRow, ...patch, updated_at: new Date().toISOString() } as Account & Record<string, unknown>;
  await env.DB.prepare('UPDATE accounts SET name = ?, account_type = ?, owner = ?, currency = ?, is_spendable = ?, is_restricted = ?, status = ?, notes = ?, updated_at = ? WHERE id = ?')
    .bind(next.name, next.account_type, next.owner, next.currency, toInteger(next.is_spendable), toInteger(next.is_restricted), next.status ?? 'active', next.notes, next.updated_at, id).run();
  await audit(env, 'account', id, 'update', oldRow, next, requireText(payload.edit_reason, 'Missing edit_reason'));
  return { account: await getAccountById(env, id), accounts: await accountsWithBalances(env) };
}

async function archiveAccount(env: Env, payload: PatchPayload) {
  return updateAccount(env, { account_id: payload.account_id, patch_json: { status: 'archived' }, edit_reason: String(payload.archive_reason || payload.reason || 'archive account') });
}

async function createCategory(env: Env, payload: Record<string, unknown>) {
  const category = { id: requireText(payload.category_id ?? payload.id, 'Missing category_id'), name: requireText(payload.name, 'Missing name'), kind: String(payload.kind ?? 'expense'), parent_category_id: typeof payload.parent_category_id === 'string' ? payload.parent_category_id : null, tax_relevant: truthy(payload.tax_relevant) ? 1 : 0, status: 'active', notes: String(payload.notes ?? '') };
  await env.DB.prepare('INSERT INTO ledger_categories (id, name, kind, tax_relevant, notes, parent_category_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(category.id, category.name, category.kind, category.tax_relevant, category.notes, category.parent_category_id, category.status).run();
  await audit(env, 'category', category.id, 'create', {}, category, 'create category');
  return { category, categories: await listCategories(env) };
}

async function updateCategory(env: Env, payload: PatchPayload) {
  const id = requireText(payload.category_id, 'Missing category_id');
  const oldRow = await getCategoryById(env, id);
  const patch = parsePatch(payload);
  const next = { ...oldRow, ...patch } as Category & Record<string, unknown>;
  await env.DB.prepare('UPDATE ledger_categories SET name = ?, kind = ?, tax_relevant = ?, notes = ?, parent_category_id = ?, status = ? WHERE id = ?')
    .bind(next.name, next.kind, toInteger(next.tax_relevant), next.notes, next.parent_category_id ?? null, next.status ?? 'active', id).run();
  await audit(env, 'category', id, 'update', oldRow, next, requireText(payload.edit_reason, 'Missing edit_reason'));
  return { category: await getCategoryById(env, id), categories: await listCategories(env) };
}

async function mergeCategories(env: Env, payload: Record<string, unknown>) {
  const from = requireText(payload.from_category_id, 'Missing from_category_id');
  const to = requireText(payload.to_category_id, 'Missing to_category_id');
  await getCategoryById(env, from); await getCategoryById(env, to);
  const before = await listTransactions(env, { category_id: from, include_voided: true, include_deleted: true });
  await env.DB.prepare('UPDATE ledger_transactions SET category_id = ?, updated_at = ? WHERE category_id = ?').bind(to, new Date().toISOString(), from).run();
  await updateCategory(env, { category_id: from, patch_json: { status: 'archived' }, edit_reason: String(payload.merge_reason || payload.reason || 'merge categories') });
  await audit(env, 'category', from, 'merge', { from, count: before.length }, { to }, String(payload.merge_reason || payload.reason || 'merge categories'));
  return { moved_count: before.length, from_category_id: from, to_category_id: to };
}

async function createBusiness(env: Env, payload: Record<string, unknown>) {
  const business = { id: requireText(payload.business_id ?? payload.id, 'Missing business_id'), name: requireText(payload.name, 'Missing name'), status: String(payload.status ?? 'active'), ownership_json: String(payload.ownership_json ?? '{}'), notes: String(payload.notes ?? ''), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  await env.DB.prepare('INSERT INTO businesses (id, name, status, ownership_json, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(business.id, business.name, business.status, business.ownership_json, business.notes, business.created_at, business.updated_at).run();
  await audit(env, 'business', business.id, 'create', {}, business, 'create business');
  return { business, businesses: await businessesWithReports(env) };
}

async function updateBusiness(env: Env, payload: PatchPayload) {
  const id = requireText(payload.business_id, 'Missing business_id');
  const oldRow = await getBusinessById(env, id);
  const patch = parsePatch(payload);
  const next = { ...oldRow, ...patch, updated_at: new Date().toISOString() } as Business & Record<string, unknown>;
  await env.DB.prepare('UPDATE businesses SET name = ?, status = ?, ownership_json = ?, notes = ?, updated_at = ? WHERE id = ?').bind(next.name, next.status, next.ownership_json, next.notes, next.updated_at, id).run();
  await audit(env, 'business', id, 'update', oldRow, next, requireText(payload.edit_reason, 'Missing edit_reason'));
  return { business: await getBusinessById(env, id), businesses: await businessesWithReports(env) };
}

async function listTransactionsReport(env: Env, filters: LedgerFilter) {
  const transactions = await listTransactions(env, filters);
  let balances: Record<string, number> = {};
  const rows = transactions.map((transaction) => {
    balances[transaction.account_id] = (balances[transaction.account_id] ?? 0) + Number(transaction.cash_in) - Number(transaction.cash_out);
    return { ...transaction, running_balance: balances[transaction.account_id] };
  });
  return { rows, totals: { cashIn: rows.reduce((sum, row) => sum + Number(row.cash_in), 0), cashOut: rows.reduce((sum, row) => sum + Number(row.cash_out), 0), net: rows.reduce((sum, row) => sum + Number(row.cash_in) - Number(row.cash_out), 0) } };
}

async function spendingByCategory(env: Env, filters: LedgerFilter) {
  const report = await listTransactionsReport(env, { ...filters, include_voided: false, include_deleted: false });
  const expenses = report.rows.filter((row) => Number(row.cash_out) > 0);
  const total = expenses.reduce((sum, row) => sum + Number(row.cash_out), 0);
  const byCategory: Record<string, { category_id: string; total: number; count: number; percentage: number }> = {};
  for (const row of expenses) {
    const key = row.category_id;
    byCategory[key] ??= { category_id: key, total: 0, count: 0, percentage: 0 };
    byCategory[key].total += Number(row.cash_out);
    byCategory[key].count += 1;
  }
  const categoryTotals = Object.values(byCategory).map((item) => ({ ...item, percentage: total ? Math.round((item.total / total) * 10000) / 100 : 0 })).sort((a, b) => b.total - a.total);
  return { date_from: filters.date_from ?? null, date_to: filters.date_to ?? null, total_spending: total, categoryTotals, warnings: categoryTotals.filter((item) => item.category_id === 'uncategorized').length ? ['Uncategorized spending needs review'] : [] };
}

async function recurringExpenses(env: Env) {
  const rows = await listTransactions(env, {});
  const groups: Record<string, Transaction[]> = {};
  for (const row of rows.filter((row) => Number(row.cash_out) > 0)) {
    const key = `${String(row.counterparty || row.description).toLowerCase()}-${row.cash_out}`;
    (groups[key] ||= []).push(row);
  }
  return { recurring: Object.values(groups).filter((items) => items.length > 1).map((items) => ({ merchant: items[0].counterparty || items[0].description, amount: items[0].cash_out, frequency: 'possible recurring', last_charged_date: items.at(-1)?.transaction_date, category: items[0].category_id, suggested_action: 'Review if this is still needed.' })) };
}

async function exportLedger(env: Env, payload: LedgerFilter) {
  const rows = await listTransactions(env, payload);
  const format = String(payload.format || 'json');
  if (format === 'csv') {
    const headers = ['id','transaction_date','account_id','business_id','category_id','transaction_type','description','cash_in','cash_out','counterparty','tax_tag'];
    return { format, data: [headers.join(','), ...rows.map((row) => headers.map((key) => JSON.stringify((row as Record<string, unknown>)[key] ?? '')).join(','))].join('\n') };
  }
  if (format === 'markdown') return { format, data: rows.map((row) => `- ${row.transaction_date} ${row.account_id} ${row.description}: +${row.cash_in} -${row.cash_out}`).join('\n') };
  return { format: 'json', data: rows };
}

async function importTransactions(env: Env, payload: Record<string, unknown>) {
  const rows = JSON.parse(requireText(payload.transactions_json ?? payload.rows_json, 'Missing transactions_json')) as NewTransaction[];
  if (truthy(payload.dry_run ?? true)) return { imported_count: 0, dry_run: true, transactions: rows, moneySituation: await ledgerSummary(env) };
  const created: Transaction[] = [];
  for (const row of rows) created.push(await createTransaction(env, { ...row, metadata_json: JSON.stringify({ ...safeJson(row.metadata_json), import_source: payload.source ?? 'manual' }) }));
  await audit(env, 'ledger_import', crypto.randomUUID(), 'import_transactions', {}, { count: created.length, dedupe_by_external_ref: payload.dedupe_by_external_ref ?? true }, 'import transactions', 'chatgpt/mcp', { source_tool: 'import_transactions' });
  return { imported_count: created.length, dry_run: false, transactions: created, moneySituation: await ledgerSummary(env) };
}

async function bulkUpdateTransactions(env: Env, payload: Record<string, unknown>) {
  const ids = JSON.parse(requireText(payload.transaction_ids_json ?? payload.transaction_ids, 'Missing transaction_ids_json')) as string[];
  const updated = [];
  for (const id of ids) updated.push(await updateTransaction(env, { transaction_id: id, patch_json: payload.patch_json as string | Record<string, unknown> | undefined, edit_reason: String(payload.edit_reason || 'bulk update') }));
  await audit(env, 'ledger_bulk', crypto.randomUUID(), 'bulk_update_transactions', { transaction_ids: ids }, { updated_count: updated.length, patch: safeJson(payload.patch_json) }, String(payload.edit_reason || 'bulk update'), 'chatgpt/mcp', { source_tool: 'bulk_update_transactions' });
  return { updated_count: updated.length, updated, moneySituation: await ledgerSummary(env) };
}

async function bulkReclassifyByRule(env: Env, payload: Record<string, unknown>) {
  const match = JSON.parse(requireText(payload.match_json, 'Missing match_json')) as Record<string, unknown>;
  const classification = JSON.parse(requireText(payload.patch_json ?? payload.classification_json, 'Missing patch_json')) as Record<string, unknown>;
  let rows = await listTransactions(env, {});
  if (match.counterparty_contains) rows = rows.filter((row) => String(row.counterparty ?? '').toLowerCase().includes(String(match.counterparty_contains).toLowerCase()));
  if (match.description_contains) rows = rows.filter((row) => row.description.toLowerCase().includes(String(match.description_contains).toLowerCase()));
  const updated = [];
  for (const row of rows) {
    const patch = { ...classification };
    if (typeof patch.description_template === 'string') { patch.description = patch.description_template; delete patch.description_template; }
    if (!truthy(payload.dry_run ?? true)) updated.push(await updateTransaction(env, { transaction_id: row.id, patch_json: patch, edit_reason: String(payload.edit_reason || 'bulk reclassify by rule') }));
  }
  if (!truthy(payload.dry_run ?? true)) await audit(env, 'ledger_bulk', crypto.randomUUID(), 'bulk_reclassify_by_rule', { match }, { updated_count: updated.length, patch: classification }, String(payload.edit_reason || 'bulk reclassify by rule'), 'chatgpt/mcp', { source_tool: 'bulk_reclassify_by_rule' });
  return { matched_count: rows.length, updated_count: updated.length, dry_run: truthy(payload.dry_run ?? true), updated, matched: truthy(payload.dry_run ?? true) ? rows : undefined };
}

async function getAuditLog(env: Env, filters: LedgerFilter) {
  const result = await env.DB.prepare('SELECT * FROM ledger_audit_log ORDER BY created_at DESC').all<Record<string, unknown>>();
  let rows = result.results ?? [];
  if (filters.entity_type) rows = rows.filter((row) => row.entity_type === filters.entity_type);
  if (filters.entity_id) rows = rows.filter((row) => row.entity_id === filters.entity_id);
  if (filters.transaction_id) rows = rows.filter((row) => row.entity_type === 'transaction' && row.entity_id === filters.transaction_id);
  if (filters.since_date || filters.date_from) rows = rows.filter((row) => String(row.created_at) >= String(filters.since_date || filters.date_from));
  if (filters.until_date || filters.date_to) rows = rows.filter((row) => String(row.created_at) <= String(filters.until_date || filters.date_to));
  return { audit: rows.slice(0, filters.limit === undefined ? 50 : Math.max(1, toInteger(filters.limit))) };
}

function safeJson(value: unknown) {
  try { return typeof value === 'string' ? JSON.parse(value) : (value && typeof value === 'object' ? value : {}); } catch { return {}; }
}

const editTransactionSchema = objectSchema({ transaction_id: stringProp('Transaction id'), patch_json: stringProp('JSON object patch'), edit_reason: stringProp('Reason for audit log'), edited_by: stringProp('Optional actor/source; defaults to chatgpt/mcp') }, ['transaction_id', 'patch_json', 'edit_reason']);
const deleteTransactionSchema = objectSchema({ transaction_id: stringProp('Transaction id'), delete_reason: stringProp('Reason for audit log'), deleted_by: stringProp('Optional actor/source') }, ['transaction_id', 'delete_reason']);
const transferSchema = objectSchema({ transaction_date: stringProp('YYYY-MM-DD transfer date; defaults to today'), from_account_id: stringProp('Source account id'), to_account_id: stringProp('Destination account id'), amount: numberProp('Transfer amount in IDR'), description: stringProp('Human-readable transfer description'), business_id: stringProp('Optional business id'), category_id: stringProp('Optional category id; defaults to transfer'), fee_amount: numberProp('Optional fee amount'), fee_account_id: stringProp('Optional fee account id'), fee_category_id: stringProp('Optional fee category id'), external_ref: stringProp('Optional idempotency/reference key'), metadata_json: stringProp('Optional JSON object metadata'), edit_reason: stringProp('Optional edit/audit reason'), creation_reason: stringProp('Optional creation reason') }, ['from_account_id', 'to_account_id', 'amount', 'description']);
const splitSchema = objectSchema({ parent_transaction_id: stringProp('Parent transaction id'), splits_json: stringProp('JSON array of child split rows'), split_reason: stringProp('Reason for splitting this transaction') }, ['parent_transaction_id', 'splits_json', 'split_reason']);
const auditLogSchema = objectSchema({ entity_type: stringProp('Optional entity type filter'), entity_id: stringProp('Optional entity id filter'), transaction_id: stringProp('Optional transaction id filter'), limit: numberProp('Optional max rows; defaults to 50'), since_date: stringProp('Optional YYYY-MM-DD or ISO lower bound'), until_date: stringProp('Optional YYYY-MM-DD or ISO upper bound') }, []);

const MCP_TOOL_DEFINITIONS: McpToolDefinition[] = [
  { name: 'get_money_situation', description: 'Get the current Sativa OS money situation: free cash, restricted assets, savings, total tracked assets, status, and WARAS ownership.', method: 'GET', path: '/api/ledger/summary', inputSchema: emptySchema() },
  { name: 'list_accounts', description: 'List accounts and pockets with balances, spendability, owners, and notes.', method: 'GET', path: '/api/ledger/accounts', inputSchema: emptySchema() },
  { name: 'list_transactions', description: 'List ledger transactions with accounts, businesses, categories, cash in, cash out, and running balances.', method: 'GET', path: '/api/ledger/transactions', inputSchema: emptySchema() },
  { name: 'add_transaction', description: 'Add a ledger transaction for cash in, cash out, investment, transfer, or asset movement.', method: 'POST', path: '/api/ledger/transactions', inputSchema: objectSchema({ transaction_date: stringProp('YYYY-MM-DD transaction date'), account_id: stringProp('Account id, for example bank-main or gopay'), business_id: stringProp('Business id, for example personal-sativa, appworkz, waras, or coreitera'), category_id: stringProp('Ledger category id, for example client-revenue, living-cost, software-tools, uncategorized'), transaction_type: stringProp('income, expense, investment, asset, transfer, opening_balance, or adjustment'), description: stringProp('Human-readable transaction description'), cash_in: numberProp('Cash amount entering this account in IDR'), cash_out: numberProp('Cash amount leaving this account in IDR'), counterparty: stringProp('Optional counterparty'), tax_tag: stringProp('Optional tax tag'), reflection: stringProp('Optional cash reflection') }, ['account_id', 'description']) },
  { name: 'get_transaction', description: 'Read one transaction with transfer group, splits, notes, audit history, and receipt references.', method: 'GET', path: '/mcp', inputSchema: objectSchema({ transaction_id: stringProp('Transaction id') }, ['transaction_id']) },
  { name: 'edit_transaction', description: 'Preferred: edit an existing transaction with audit trail.', method: 'POST', path: '/mcp', inputSchema: editTransactionSchema },
  { name: 'update_transaction', description: 'Compatibility alias for edit_transaction.', method: 'POST', path: '/mcp', inputSchema: editTransactionSchema },
  { name: 'reclassify_transaction', description: 'Change category, business, counterparty, description, or tax tag without changing amount.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ transaction_id: stringProp('Transaction id'), category_id: stringProp('Optional category id'), business_id: stringProp('Optional business id'), counterparty: stringProp('Optional counterparty'), description: stringProp('Optional description'), tax_tag: stringProp('Optional tax tag'), edit_reason: stringProp('Reason for audit log') }, ['transaction_id', 'edit_reason']) },
  { name: 'void_transaction', description: 'Void a transaction while preserving history and excluding it from balances.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ transaction_id: stringProp('Transaction id'), void_reason: stringProp('Reason for voiding'), voided_by: stringProp('Optional actor/source') }, ['transaction_id', 'void_reason']) },
  { name: 'soft_delete_transaction', description: 'Preferred: soft-delete a wrong transaction with audit trail.', method: 'POST', path: '/mcp', inputSchema: deleteTransactionSchema },
  { name: 'delete_transaction', description: 'Compatibility alias for soft_delete_transaction.', method: 'POST', path: '/mcp', inputSchema: deleteTransactionSchema },
  { name: 'create_transfer', description: 'Preferred: record a two-leg transfer between accounts with optional fee leg.', method: 'POST', path: '/mcp', inputSchema: transferSchema },
  { name: 'record_transfer', description: 'Compatibility alias for create_transfer.', method: 'POST', path: '/mcp', inputSchema: transferSchema },
  { name: 'create_split', description: 'Preferred: split one transaction into multiple categorized child rows.', method: 'POST', path: '/mcp', inputSchema: splitSchema },
  { name: 'split_transaction', description: 'Compatibility alias for create_split.', method: 'POST', path: '/mcp', inputSchema: splitSchema },
  { name: 'add_transaction_note', description: 'Attach a clarification, memory, receipt, tax, or decision note to a transaction.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ transaction_id: stringProp('Transaction id'), note_type: enumProp(['clarification','memory','receipt','tax','decision','other'], 'Note type'), note: stringProp('Note text'), metadata_json: stringProp('Optional JSON object metadata') }, ['transaction_id', 'note_type', 'note']) },
  { name: 'attach_receipt', description: 'Attach receipt/image metadata and optional OCR text to a transaction.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ transaction_id: stringProp('Transaction id'), receipt_ref: stringProp('Receipt reference'), receipt_url: stringProp('Optional receipt URL'), receipt_text: stringProp('Optional receipt OCR/text'), metadata_json: stringProp('Optional JSON object metadata') }, ['transaction_id', 'receipt_ref']) },
  { name: 'reconcile_account', description: 'Create an adjustment so Sativa OS matches a real account balance.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ account_id: stringProp('Account id'), actual_balance: numberProp('Actual account balance'), reconciliation_date: stringProp('YYYY-MM-DD date; defaults to today'), description: stringProp('Optional adjustment description'), reason: stringProp('Reason for audit log') }, ['account_id', 'actual_balance', 'reason']) },
  { name: 'read_audit_log', description: 'Preferred: read audit trail entries.', method: 'GET', path: '/mcp', inputSchema: auditLogSchema },
  { name: 'get_audit_log', description: 'Compatibility alias for read_audit_log.', method: 'GET', path: '/mcp', inputSchema: auditLogSchema },
  { name: 'bulk_update_transactions', description: 'Apply a patch to multiple transactions with audit trail.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ transaction_ids_json: stringProp('JSON array of transaction IDs'), patch_json: stringProp('JSON object patch'), edit_reason: stringProp('Reason for audit log') }, ['transaction_ids_json', 'patch_json', 'edit_reason']) },
  { name: 'bulk_reclassify_by_rule', description: 'Classify known merchants by matching counterparty or description.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ match_json: stringProp('JSON object matching rule'), patch_json: stringProp('JSON object classification patch'), edit_reason: stringProp('Reason for audit log'), dry_run: booleanProp('Optional dry run flag; defaults true') }, ['match_json', 'patch_json', 'edit_reason']) },
  { name: 'create_account', description: 'Create a new account/pocket.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ account_id: stringProp('Account id'), name: stringProp('Account name'), account_type: stringProp('Optional account type'), spendable: booleanProp('Optional spendable flag'), owner: stringProp('Optional owner'), notes: stringProp('Optional notes'), status: stringProp('Optional status; defaults active') }, ['account_id', 'name']) },
  { name: 'update_account', description: 'Update an account/pocket with audit trail.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ account_id: stringProp('Account id'), patch_json: stringProp('JSON object patch'), edit_reason: stringProp('Reason for audit log') }, ['account_id', 'patch_json', 'edit_reason']) },
  { name: 'archive_account', description: 'Archive an account instead of deleting it.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ account_id: stringProp('Account id'), archive_reason: stringProp('Archive reason') }, ['account_id', 'archive_reason']) },
  { name: 'get_cashflow', description: 'Get cashflow rows and totals for the current tracked period.', method: 'GET', path: '/api/ledger/cashflow', inputSchema: emptySchema() },
  { name: 'get_spending_by_category', description: 'Summarize spending by category with percentages and warnings.', method: 'GET', path: '/mcp', inputSchema: objectSchema({ since_date: stringProp('Optional YYYY-MM-DD lower bound'), until_date: stringProp('Optional YYYY-MM-DD upper bound'), business_id: stringProp('Optional business id'), account_id: stringProp('Optional account id') }, []) },
  { name: 'get_recurring_expenses', description: 'Detect possible recurring expenses or subscriptions.', method: 'GET', path: '/mcp', inputSchema: objectSchema({ lookback_days: numberProp('Optional lookback days; defaults 90'), min_occurrences: numberProp('Optional minimum occurrences; defaults 2') }, []) },
  { name: 'get_asset_table', description: 'Get the asset table showing spendable cash and restricted/business assets.', method: 'GET', path: '/api/ledger/assets', inputSchema: emptySchema() },
  { name: 'list_categories', description: 'List ledger categories and tax relevance.', method: 'GET', path: '/api/ledger/categories', inputSchema: emptySchema() },
  { name: 'create_category', description: 'Create a ledger category.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ category_id: stringProp('Category id'), name: stringProp('Category name'), tax_relevant: booleanProp('Optional tax relevant flag'), status: stringProp('Optional status; defaults active'), notes: stringProp('Optional notes') }, ['category_id', 'name']) },
  { name: 'update_category', description: 'Update a ledger category with audit trail.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ category_id: stringProp('Category id'), patch_json: stringProp('JSON object patch'), edit_reason: stringProp('Reason for audit log') }, ['category_id', 'patch_json', 'edit_reason']) },
  { name: 'merge_categories', description: 'Move transactions from one category to another and archive the old category.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ from_category_id: stringProp('Source category id'), to_category_id: stringProp('Destination category id'), merge_reason: stringProp('Merge reason') }, ['from_category_id', 'to_category_id', 'merge_reason']) },
  { name: 'list_businesses', description: 'List business entities and ownership.', method: 'GET', path: '/api/businesses', inputSchema: emptySchema() },
  { name: 'create_business', description: 'Create a business entity.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ business_id: stringProp('Business id'), name: stringProp('Business name'), status: stringProp('Optional status'), ownership_json: stringProp('Optional JSON object ownership map'), notes: stringProp('Optional notes') }, ['business_id', 'name']) },
  { name: 'update_business', description: 'Update a business entity with audit trail.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ business_id: stringProp('Business id'), patch_json: stringProp('JSON object patch'), edit_reason: stringProp('Reason for audit log') }, ['business_id', 'patch_json', 'edit_reason']) },
  { name: 'get_business_accounting', description: 'Get simplified business accounting rows: revenue, expenses, investment/assets, net cash, ownership, and notes.', method: 'GET', path: '/api/businesses', inputSchema: emptySchema() },
  { name: 'get_tax_summary', description: 'Get a simplified tax/SPT preparation summary from tax-relevant ledger rows.', method: 'GET', path: '/api/reports/tax-summary', inputSchema: emptySchema() },
  { name: 'export_ledger', description: 'Export ledger rows as json, csv, or markdown.', method: 'GET', path: '/mcp', inputSchema: objectSchema({ format: enumProp(['json','csv','markdown'], 'Export format'), since_date: stringProp('Optional YYYY-MM-DD lower bound'), until_date: stringProp('Optional YYYY-MM-DD upper bound'), include_voided: booleanProp('Optional include voided rows; defaults false'), include_deleted: booleanProp('Optional include deleted rows; defaults false') }, ['format']) },
  { name: 'import_transactions', description: 'Import manual JSON transaction rows with dedupe support through external_ref.', method: 'POST', path: '/mcp', inputSchema: objectSchema({ transactions_json: stringProp('JSON array of transaction rows'), dedupe_by_external_ref: booleanProp('Optional dedupe flag; defaults true'), dry_run: booleanProp('Optional dry run flag; defaults true') }, ['transactions_json']) },
  { name: 'pull_daily_brief', description: 'Pull the daily Sativa OS brief with money warnings and next action.', method: 'GET', path: '/api/daily-brief', inputSchema: emptySchema() },
  { name: 'get_director_summary', description: 'Get director-level summary: money, vision goals, OKRs, weekly reviews, businesses, and BMC blocks.', method: 'GET', path: '/api/director/summary', inputSchema: emptySchema() },
  { name: 'get_weekly_review', description: 'Get weekly review records.', method: 'GET', path: '/api/weekly-review', inputSchema: emptySchema() },
  { name: 'get_okrs', description: 'Get current OKRs tied to businesses.', method: 'GET', path: '/api/okrs', inputSchema: emptySchema() },
  { name: 'get_sativa_300t_alignment', description: 'Get Sativa 300T and cash-first vision alignment goals.', method: 'GET', path: '/api/vision', inputSchema: emptySchema() },
  { name: 'get_business_model_canvas', description: 'Get structured Business Model Canvas blocks for all businesses.', method: 'GET', path: '/api/business-model', inputSchema: emptySchema() },
  { name: 'update_business_model_canvas', description: 'Update one structured Business Model Canvas block for a business.', method: 'POST', path: '/api/business-model', inputSchema: objectSchema({ business_id: stringProp('Business id, for example appworkz or waras'), block_key: stringProp('BMC block key: partners, activities, resources, value, relationships, channels, segments, costs, revenue'), elements_json: stringProp('JSON string array of block elements'), status: stringProp('Optional status, usually active'), control_question: stringProp('Optional internal control question') }, ['business_id', 'block_key', 'elements_json']) },
];

function mcpManifest(origin: string) {
  return {
    name: 'sativa-os-ledger',
    description: 'Minimal Sativa OS ledger tools for cash, accounts, businesses, WARAS asset, tax prep, and cash reflection.',
    auth: 'disabled-for-test',
    transport: 'streamable-http-json-rpc',
    serverUrl: `${origin}/mcp`,
    tools: MCP_TOOL_DEFINITIONS.map((tool) => ({ name: tool.name, description: tool.description, method: tool.method, url: `${origin}${tool.path}` })),
  };
}

async function handleMcpRequest(request: Request, env: Env) {
  const payload = await readJson<McpJsonRpcRequest | McpJsonRpcRequest[]>(request);
  if (Array.isArray(payload)) return Promise.all(payload.map((item) => handleMcpMessage(item, env)));
  return handleMcpMessage(payload, env);
}

async function handleMcpMessage(message: McpJsonRpcRequest, env: Env) {
  const id = message.id ?? null;
  const method = String(message.method ?? '');
  if (!id && method.startsWith('notifications/')) return null;

  try {
    if (method === 'initialize') {
      return mcpResult(id, {
        protocolVersion: '2025-03-26',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'sativa-os-ledger', version: '0.1.0' },
        instructions: 'Use Sativa OS as Adit private control plane for money flow, ledger, director review, OKRs, projects, and business model canvas. Auth is disabled for this test slice; do not store secrets in tool arguments.',
      });
    }
    if (method === 'tools/list') {
      return mcpResult(id, { tools: MCP_TOOL_DEFINITIONS.map((tool) => ({ name: tool.name, description: tool.description, inputSchema: tool.inputSchema })) });
    }
    if (method === 'tools/call') {
      const params = message.params ?? {};
      const name = requireText(params.name, 'Missing tool name');
      const args = typeof params.arguments === 'object' && params.arguments !== null ? params.arguments as Record<string, unknown> : {};
      const result = await callMcpTool(name, args, env);
      return mcpResult(id, { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }], structuredContent: result });
    }
    if (method === 'ping') return mcpResult(id, {});
    return mcpError(id, -32601, `Unsupported MCP method: ${method}`);
  } catch (error) {
    return mcpError(id, -32000, error instanceof Error ? error.message : 'Unknown MCP server error');
  }
}

async function callMcpTool(name: string, args: Record<string, unknown>, env: Env) {
  switch (name) {
    case 'get_money_situation': return ledgerSummary(env);
    case 'list_accounts': return { accounts: await accountsWithBalances(env) };
    case 'list_transactions': return listTransactionsReport(env, args);
    case 'add_transaction': await ensureSeededOnce(env); { const transaction = await createTransaction(env, args as NewTransaction); return { transaction, moneySituation: await ledgerSummary(env) }; }
    case 'edit_transaction':
    case 'update_transaction': return updateTransaction(env, args as PatchPayload);
    case 'reclassify_transaction': return reclassifyTransaction(env, args as PatchPayload);
    case 'void_transaction': return voidTransaction(env, args as PatchPayload);
    case 'soft_delete_transaction':
    case 'delete_transaction': return deleteTransaction(env, args as PatchPayload);
    case 'create_transfer':
    case 'record_transfer': return recordTransfer(env, args);
    case 'create_split':
    case 'split_transaction': return splitTransaction(env, args);
    case 'add_transaction_note': return addTransactionNote(env, args);
    case 'attach_receipt': return attachReceipt(env, args);
    case 'get_transaction': return getTransactionFull(env, requireText(args.transaction_id, 'Missing transaction_id'));
    case 'reconcile_account': return reconcileAccount(env, args);
    case 'get_cashflow': return args && Object.keys(args).length ? listTransactionsReport(env, args) : cashflowReport(env);
    case 'get_spending_by_category': return spendingByCategory(env, args);
    case 'get_recurring_expenses': return recurringExpenses(env);
    case 'get_asset_table': return assetTable(env);
    case 'list_categories': return { categories: await listCategories(env) };
    case 'create_account': return createAccount(env, args);
    case 'update_account': return updateAccount(env, args as PatchPayload);
    case 'archive_account': return archiveAccount(env, args as PatchPayload);
    case 'create_category': return createCategory(env, args);
    case 'update_category': return updateCategory(env, args as PatchPayload);
    case 'merge_categories': return mergeCategories(env, args);
    case 'list_businesses': return { businesses: await businessesWithReports(env) };
    case 'create_business': return createBusiness(env, args);
    case 'update_business': return updateBusiness(env, args as PatchPayload);
    case 'get_business_accounting': return { businesses: await businessesWithReports(env) };
    case 'get_tax_summary': return taxSummary(env);
    case 'export_ledger': return exportLedger(env, args);
    case 'import_transactions': return importTransactions(env, args);
    case 'bulk_update_transactions': return bulkUpdateTransactions(env, args);
    case 'bulk_reclassify_by_rule': return bulkReclassifyByRule(env, args);
    case 'read_audit_log':
    case 'get_audit_log': return getAuditLog(env, args);
    case 'pull_daily_brief': return dailyBrief(env);
    case 'get_director_summary': return directorSummary(env);
    case 'get_weekly_review': return { weeklyReviews: await listWeeklyReviews(env) };
    case 'get_okrs': return { okrs: await okrsWithBusiness(env) };
    case 'get_sativa_300t_alignment': return { visionGoals: await listVisionGoals(env) };
    case 'get_business_model_canvas': return { blocks: await businessModelWithBusiness(env) };
    case 'update_business_model_canvas': await ensureSeededOnce(env); return { block: await upsertBusinessModelBlock(env, args as NewBusinessModelBlock) };
    default: throw new Error(`Unknown MCP tool: ${name}`);
  }
}

function mcpResponse(payload: unknown) {
  if (payload === null) return new Response(null, { status: 202, headers: jsonHeaders });
  return jsonResponse(payload);
}

function mcpResult(id: string | number | null, result: unknown) {
  return { jsonrpc: '2.0', id, result };
}

function mcpError(id: string | number | null, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function emptySchema() {
  return objectSchema({}, []);
}

function objectSchema(properties: Record<string, unknown>, required: string[]) {
  return { type: 'object', properties, required, additionalProperties: false };
}

function stringProp(description: string) {
  return { type: 'string', description };
}

function numberProp(description: string) {
  return { type: 'number', description };
}

function booleanProp(description: string) {
  return { type: 'boolean', description };
}

function enumProp(values: string[], description: string) {
  return { type: 'string', enum: values, description };
}


function formatIDR(value: unknown) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
}

function pageShell(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fff; color: #000; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 14px; line-height: 1.45; }
    main { max-width: 1180px; margin: 0 auto; padding: 24px 14px 60px; }
    header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; gap: 16px; align-items: end; }
    nav { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
    a { color: #000; text-decoration: underline; }
    h1, h2, h3, p { margin: 0; }
    h1 { font-size: 28px; letter-spacing: -1px; }
    h2 { font-size: 18px; margin-bottom: 8px; }
    h3 { font-size: 14px; margin-bottom: 6px; }
    section { border: 1px solid #000; padding: 12px; margin-bottom: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .thirds { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .metric { border: 1px solid #000; padding: 10px; min-height: 82px; }
    .metric strong { display: block; font-size: 20px; margin-top: 8px; }
    .critical { background: #000; color: #fff; padding: 2px 5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #000; padding: 7px; text-align: left; vertical-align: top; }
    th { background: #eee; }
    input, select, textarea, button { width: 100%; border: 1px solid #000; background: #fff; color: #000; padding: 7px; font: inherit; border-radius: 0; }
    button, .button { cursor: pointer; background: #000; color: #fff; display: inline-block; padding: 7px; text-decoration: none; border: 1px solid #000; }
    textarea { min-height: 78px; }
    .form { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .full { grid-column: 1 / -1; }
    .small { font-size: 12px; }
    .right { text-align: right; }
    .status { border: 1px solid #000; padding: 7px; margin-bottom: 12px; background: #f7f7f7; }
    .empty { color: #444; font-style: italic; }
    .skeleton { min-height: 90px; padding: 10px; border: 1px dashed #000; }
    .toolbar { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
    .toolbar label { display: flex; gap: 8px; align-items: center; }
    .bmc-layout { display: grid; grid-template-columns: repeat(5, minmax(150px, 1fr)); grid-template-rows: 1fr 1fr 0.82fr; min-height: 720px; padding: 0; }
    .bmc-cell { border: 1px solid #000; padding: 12px; display: flex; flex-direction: column; gap: 8px; min-height: 210px; }
    .bmc-cell h2 { display: flex; justify-content: space-between; gap: 8px; font-size: 17px; }
    .bmc-cell ul { padding-left: 18px; margin: 0; }
    .bmc-cell li { margin-bottom: 7px; }
    .bmc-actions { display: flex; gap: 6px; margin-top: auto; }
    .bmc-actions button { width: auto; padding: 4px 7px; }
    .bmc-cell textarea { min-height: 130px; }
    .partners { grid-column: 1; grid-row: 1 / 3; }
    .activities { grid-column: 2; grid-row: 1; }
    .resources { grid-column: 2; grid-row: 2; }
    .value { grid-column: 3; grid-row: 1 / 3; }
    .relationships { grid-column: 4; grid-row: 1; }
    .channels { grid-column: 4; grid-row: 2; }
    .segments { grid-column: 5; grid-row: 1 / 3; }
    .costs { grid-column: 1 / 3; grid-row: 3; }
    .revenue { grid-column: 3 / 6; grid-row: 3; }
    pre { white-space: pre-wrap; border: 1px solid #000; padding: 8px; margin: 8px 0 0; }
    @media (max-width: 820px) { header, .grid, .metrics, .thirds, .form, .bmc-layout { grid-template-columns: 1fr; display: grid; } .bmc-cell, .partners, .activities, .resources, .value, .relationships, .channels, .segments, .costs, .revenue { grid-column: auto; grid-row: auto; } }
  </style>
</head>
<body><main>${body}</main></body></html>`;
}

function renderMissionControlShell() {
  const body = `
    <header><div><h1>SATIVA OS MISSION CONTROL</h1><p>Primary interface: ChatGPT/MCP. This page paints instantly, uses browser cache first, then refreshes from D1 in the background.</p><nav><a href="/">Mission Control</a><a href="/director">Director</a><a href="/business-model">Business Model Canvas</a><a href="/add-transaction">Add Transaction</a><a href="/mcp">MCP Manifest</a></nav></div><div class="small">Instant shell<br>Lazy D1 refresh</div></header>
    <div class="status" id="loadStatus">Status: app shell rendered instantly. Loading cached data...</div>
    <section id="money-flow"><h2>1. Money Flow</h2><div id="moneyContent" class="skeleton">Loading money flow from browser cache, then Cloudflare D1...</div></section>
    <section id="horizon"><h2>2. Horizon of Controls</h2><div id="horizonContent" class="skeleton">Loading director/MCP controls...</div></section>
    <section id="details"><h2>3. All Detailed Data</h2><div id="detailsContent" class="skeleton">Loading detailed tables lazily...</div></section>
    <script>${clientRuntimeScript('mission')}</script>`;
  return pageShell('Sativa OS Mission Control', body);
}

function renderDirectorShell() {
  const body = `
    <header><div><h1>DIRECTOR CONTROL</h1><p>Weekly review, OKRs, businesses, and Sativa 300T alignment. Fast shell first, D1 data after.</p><nav><a href="/">Mission Control</a><a href="/director">Director</a><a href="/business-model">Business Model Canvas</a><a href="/add-transaction">Add Transaction</a></nav></div><div class="small">Browser cache + D1 refresh</div></header>
    <div class="status" id="loadStatus">Status: director shell rendered instantly. Loading cached director controls...</div>
    <section><h2>Sativa 300T Vision Alignment</h2><div id="vision" class="skeleton"></div></section>
    <section><h2>Weekly Review / Management Cadence</h2><div id="weekly" class="skeleton"></div></section>
    <section><h2>Business OKRs</h2><div id="okrs" class="skeleton"></div></section>
    <section><h2>Businesses Under Control</h2><div id="businesses" class="skeleton"></div></section>
    <section><h2>ChatGPT Director Tools</h2><pre id="mcpTools">Loading tools...</pre></section>
    <script>${clientRuntimeScript('director')}</script>`;
  return pageShell('Director Control', body);
}

function renderProjectsShell() {
  const body = `
    <header><div><h1>PROJECTS HORIZON</h1><p>Projects grouped by business with local play/pause/stop logging.</p><nav><a href="/">Mission Control</a><a href="/director">Director</a><a href="/projects">Projects</a><a href="/business-model">Business Model Canvas</a><a href="/add-transaction">Add Transaction</a></nav></div><div class="small">Instant shell<br>Lazy D1 refresh</div></header>
    <div class="status" id="loadStatus">Status: projects shell rendered instantly. Loading cached projects...</div>
    <section id="projects"><h2>Projects Horizon</h2><div class="skeleton">Loading projects from browser cache...</div></section>
    <script>${clientRuntimeScript('mission')}</script>`;
  return pageShell('Projects Horizon', body);
}

function renderBusinessModelShell() {
  const body = `
    <header><div><h1>BUSINESS MODEL CANVAS</h1><p>Locked by default. Press edit inside a block to add, edit, or delete elements. No separate form.</p><nav><a href="/">Mission Control</a><a href="/director">Director</a><a href="/business-model">Business Model Canvas</a><a href="/add-transaction">Add Transaction</a></nav></div><div class="small">Instant BMC shell<br>Inline editor</div></header>
    <div class="status" id="loadStatus">Status: BMC shell rendered instantly. Loading cached canvas...</div>
    <section class="toolbar"><label>Business <select id="businessSelect"></select></label><span id="lockState">Locked</span></section>
    <section id="bmcCanvas" class="bmc-layout skeleton">Loading business model canvas from browser cache...</section>
    <script>${clientRuntimeScript('bmc')}</script>`;
  return pageShell('Business Model Canvas', body);
}

function renderAddTransactionShell() {
  const body = `
    <header><div><h1>ADD TRANSACTION</h1><p>Simple page for manual cash in / cash out. The main interaction remains ChatGPT/MCP.</p><nav><a href="/">Mission Control</a><a href="/director">Director</a><a href="/business-model">Business Model Canvas</a><a href="/add-transaction">Add Transaction</a><a href="/mcp">MCP Manifest</a></nav></div><div class="small">Fast shell + lazy options</div></header>
    <div class="status" id="status">Status: form shell rendered instantly. Loading account/business/category options from cache...</div>
    <section><form class="form" id="transactionForm"><input name="transaction_date" type="date" required><select name="account_id" id="accountSelect"><option>Loading accounts...</option></select><select name="business_id" id="businessSelect"><option>Loading businesses...</option></select><select name="category_id" id="categorySelect"><option>Loading categories...</option></select><select name="transaction_type"><option value="income">income</option><option value="expense">expense</option><option value="investment">investment</option><option value="asset">asset</option><option value="transfer">transfer</option><option value="opening_balance">opening_balance</option></select><input name="counterparty" placeholder="counterparty"><input name="cash_in" type="number" min="0" step="1" placeholder="cash in"><input name="cash_out" type="number" min="0" step="1" placeholder="cash out"><input name="tax_tag" placeholder="tax tag"><textarea name="description" class="full" placeholder="description" required></textarea><textarea name="reflection" class="full" placeholder="reflection / retrospective"></textarea><button class="full">Save transaction</button></form></section>
    <script>${clientRuntimeScript('transaction')}</script>`;
  return pageShell('Add Transaction', body);
}

function clientRuntimeScript(mode: 'mission' | 'director' | 'bmc' | 'transaction') {
  return `
    const mode = ${JSON.stringify(mode)};
    const cacheKey = 'sativa:' + mode + ':v2';
    const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
    const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const setStatus = (text) => { const node = document.querySelector('#loadStatus') || document.querySelector('#status'); if (node) node.textContent = text; };
    const table = (headers, rows) => '<table><thead><tr>' + headers.map((h) => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' + rows.map((row) => '<tr>' + row.map((cell) => '<td>' + cell + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
    const useCache = (renderer) => { try { const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); if (cached) { renderer(cached, true); setStatus('Status: showing browser cache instantly. Refreshing changed data from Cloudflare D1...'); } } catch (_) {} };
    const saveCache = (data) => { localStorage.setItem(cacheKey, JSON.stringify(data)); };
    async function loadJson(url, renderer) { useCache(renderer); const started = performance.now(); const response = await fetch(url, { cache: 'no-store' }); const data = await response.json(); saveCache(data); renderer(data, false); setStatus('Status: loaded from ' + (data.source || 'Cloudflare D1') + ' in ' + Math.round(performance.now() - started) + 'ms at ' + (data.loadedAt || new Date().toISOString()) + '. Cached in this browser.'); return data; }
    function renderMission(data) {
      const s = data.summary || {};
      const metric = (label, value) => '<div class="metric"><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong></div>';
      document.querySelector('#moneyContent').className = '';
      document.querySelector('#moneyContent').innerHTML = '<p><span class="critical">' + esc(String(s.status || '').toUpperCase()) + '</span> ' + esc(s.note) + '</p><div class="metrics" style="margin-top:8px">' + metric('Free cash', rupiah(s.freeCash)) + metric('WARAS / restricted assets', rupiah(s.restrictedAssets)) + metric('Savings', rupiah(s.savings)) + metric('Total tracked assets', rupiah(s.totalTrackedAssets)) + '</div><p class="small" style="margin-top:8px">WARAS ownership: Adit ' + esc(s.warasOwnership?.Adit) + '%, Sonny ' + esc(s.warasOwnership?.Sonny) + '%.</p><p style="margin-top:8px"><a class="button" href="/add-transaction">Track cash in/out</a></p>';
      document.querySelector('#horizonContent').className = '';
      document.querySelector('#horizonContent').innerHTML = '<div class="thirds"><div><h3>Critical Control</h3><p>Free cash is ' + rupiah(s.freeCash) + '. Keep WARAS separate from spendable cash.</p></div><div><h3>Next Cash Action</h3><p>Create, collect, sell, deliver, or recover cash. Log every movement.</p></div><div><h3>ChatGPT/MCP Use</h3><p>Ask ChatGPT to call ledger tools to summarize, add, categorize, and review money.</p></div></div><h3 style="margin-top:12px">MCP tools</h3><pre>' + esc((data.mcp || []).join('\\n')) + '</pre>';
      const accounts = table(['Account','Type','Spendable','Balance','Notes'], (data.accounts || []).map((a) => [esc(a.name), esc(a.account_type), a.is_spendable ? 'yes' : 'no', rupiah(a.balance), esc(a.notes)]));
      const tx = table(['Date','Account','Business','Type','Category','In','Out','Balance','Notes'], ((data.cashflow && data.cashflow.rows) || []).map((r) => [esc(r.transaction_date), esc(r.account_name), esc(r.business_name), esc(r.transaction_type), esc(r.category_name), rupiah(r.cash_in), rupiah(r.cash_out), rupiah(r.running_balance), esc(r.description)]));
      const assets = table(['Asset','Owner','Liquidity','Value','Notes'], (data.assets || []).map((a) => [esc(a.name), esc(a.owner), esc(a.liquidity), rupiah(a.value), esc(a.notes)]));
      const biz = table(['Business','Ownership','Revenue','Expenses','Investment / Assets','Net Cash','Notes'], (data.businesses || []).map((b) => [esc(b.name), esc(JSON.stringify(b.ownership || {})), rupiah(b.revenue), rupiah(b.expenses), rupiah(b.investment), rupiah(b.netCash), esc(b.notes)]));
      const tax = data.tax || {};
      document.querySelector('#detailsContent').className = '';
      document.querySelector('#detailsContent').innerHTML = '<h3>Accounts / Pockets</h3>' + accounts + '<h3 style="margin-top:14px">Cashflow Ledger</h3>' + tx + '<h3 style="margin-top:14px">Asset Table</h3>' + assets + '<h3 style="margin-top:14px">Business Accounting</h3>' + biz + '<h3 style="margin-top:14px">Tax / SPT Prep</h3>' + table(['Income','Tracked Outflows','Note'], [[rupiah(tax.income), rupiah(tax.deductionsOrTrackedOutflows), esc(tax.note)]]);
    }
    function renderDirector(data) {
      document.querySelector('#vision').className = ''; document.querySelector('#weekly').className = ''; document.querySelector('#okrs').className = ''; document.querySelector('#businesses').className = '';
      document.querySelector('#vision').innerHTML = table(['Goal','Horizon','Target','Status','Alignment'], (data.visionGoals || []).map((g) => [esc(g.name), esc(g.horizon), esc(g.target_value), esc(g.status), esc(g.alignment_note)]));
      document.querySelector('#weekly').innerHTML = table(['Week','Cash','Delivery','Business','Decisions','Next Actions'], (data.weeklyReviews || []).map((r) => [esc(r.week_start), esc(r.cash_review), esc(r.delivery_review), esc(r.business_review), esc(r.decisions_needed), esc(r.next_actions)]));
      document.querySelector('#okrs').innerHTML = table(['Business','Objective','Key Results','Period','Status','Confidence'], (data.okrs || []).map((o) => [esc(o.business_name || 'Sativa'), esc(o.objective), esc((o.keyResults || []).join('; ')), esc(o.period), esc(o.status), esc(o.confidence) + '%']));
      document.querySelector('#businesses').innerHTML = table(['Business','Ownership','Revenue','Expenses','Investment / Assets','Net Cash','Notes'], (data.businesses || []).map((b) => [esc(b.name), esc(JSON.stringify(b.ownership || {})), rupiah(b.revenue), rupiah(b.expenses), rupiah(b.investment), rupiah(b.netCash), esc(b.notes)]));
      document.querySelector('#mcpTools').textContent = (data.mcp || []).join('\\n');
    }
    function blockName(key) { return ({ partners: 'Key Partnerships', activities: 'Key Activities', resources: 'Key Resources', value: 'Value Propositions', relationships: 'Customer Relationships', channels: 'Channels', segments: 'Customer Segments', costs: 'Cost Structure', revenue: 'Revenue Streams' })[key] || key; }
    const blockOrder = ['partners','activities','resources','value','relationships','channels','segments','costs','revenue'];
    let bmcData = null; let selectedBusiness = '';
    function renderBmc(data) {
      bmcData = data;
      const select = document.querySelector('#businessSelect');
      if (!select.dataset.ready) { select.innerHTML = (data.businesses || []).map((b) => '<option value="' + esc(b.id) + '">' + esc(b.name) + '</option>').join(''); select.dataset.ready = '1'; select.addEventListener('change', () => { selectedBusiness = select.value; renderBmc(bmcData); }); }
      selectedBusiness = selectedBusiness || select.value || (data.businesses?.[0]?.id || '');
      select.value = selectedBusiness;
      const canvas = document.querySelector('#bmcCanvas'); canvas.className = 'bmc-layout';
      canvas.innerHTML = blockOrder.map((key) => {
        const block = (data.blocks || []).find((b) => b.business_id === selectedBusiness && b.block_key === key) || { business_id: selectedBusiness, block_key: key, elements: [], control_question: '' };
        const elements = block.elements || [];
        return '<div class="bmc-cell ' + key + '" data-key="' + key + '"><h2><span>' + blockName(key) + '</span><button type="button" data-edit="' + key + '">edit</button></h2><ul>' + (elements.length ? elements.map((el, index) => '<li><span data-text="' + index + '">' + esc(el) + '</span> <button type="button" hidden data-delete="' + index + '">delete</button></li>').join('') : '<li class="empty">empty</li>') + '</ul><p class="small">' + esc(block.control_question || '') + '</p><div class="bmc-actions" hidden><input data-new="' + key + '" placeholder="add element"><button type="button" data-add="' + key + '">add</button><button type="button" data-save="' + key + '">save</button><button type="button" data-lock="' + key + '">lock</button></div></div>';
      }).join('');
      document.querySelector('#lockState').textContent = 'Locked';
    }
    async function saveBmcBlock(key, elements) {
      const block = (bmcData.blocks || []).find((b) => b.business_id === selectedBusiness && b.block_key === key) || {};
      setStatus('Status: saving only ' + blockName(key) + ' to Cloudflare D1...');
      const response = await fetch('/api/business-model', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ business_id: selectedBusiness, block_key: key, status: block.status || 'active', elements_json: JSON.stringify(elements), control_question: block.control_question || '' }) });
      if (!response.ok) { setStatus('Status: save failed.'); return; }
      const fresh = await fetch('/api/business-model-data', { cache: 'no-store' }).then((r) => r.json()); saveCache(fresh); renderBmc(fresh); setStatus('Status: saved ' + blockName(key) + '. Browser cache refreshed for this block.');
    }
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!target || mode !== 'bmc') return;
      const key = target.dataset.edit || target.dataset.add || target.dataset.save || target.dataset.lock;
      if (!key) return;
      const cell = target.closest('.bmc-cell'); const actions = cell.querySelector('.bmc-actions');
      if (target.dataset.edit) { cell.querySelectorAll('[data-delete]').forEach((button) => button.hidden = false); actions.hidden = false; document.querySelector('#lockState').textContent = 'Editing ' + blockName(key); }
      if (target.dataset.lock) { cell.querySelectorAll('[data-delete]').forEach((button) => button.hidden = true); actions.hidden = true; document.querySelector('#lockState').textContent = 'Locked'; }
      if (target.dataset.delete) { target.closest('li').remove(); }
      if (target.dataset.add) { const input = cell.querySelector('[data-new]'); if (input.value.trim()) { cell.querySelector('ul').insertAdjacentHTML('beforeend', '<li><span>' + esc(input.value.trim()) + '</span> <button type="button" data-delete="new">delete</button></li>'); input.value = ''; } }
      if (target.dataset.save) { const elements = Array.from(cell.querySelectorAll('li span')).map((node) => node.textContent.trim()).filter(Boolean); saveBmcBlock(key, elements); }
    });
    async function initTransaction() {
      document.querySelector('[name="transaction_date"]').value = new Date().toISOString().slice(0, 10);
      const data = await loadJson('/api/mission-control-data', () => {});
      const options = (rows) => rows.map((row) => '<option value="' + esc(row.id) + '">' + esc(row.name) + '</option>').join('');
      document.querySelector('#accountSelect').innerHTML = options(data.accounts || []);
      document.querySelector('#businessSelect').innerHTML = options(data.businesses || []);
      const categories = await fetch('/api/ledger/categories', { cache: 'force-cache' }).then((r) => r.json());
      document.querySelector('#categorySelect').innerHTML = options(categories.categories || []);
      document.querySelector('#transactionForm').addEventListener('submit', async (event) => { event.preventDefault(); setStatus('Status: saving transaction to Cloudflare D1...'); const payload = Object.fromEntries(new FormData(event.currentTarget)); const response = await fetch('/api/ledger/transactions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }); const result = await response.json(); if (!response.ok) { setStatus('Status: save failed - ' + (result.error || 'unknown error')); return; } localStorage.removeItem('sativa:mission:v2'); setStatus('Status: saved transaction ' + result.transaction.id + '. Mission Control cache invalidated.'); event.currentTarget.reset(); document.querySelector('[name="transaction_date"]').value = new Date().toISOString().slice(0, 10); });
    }
    if (mode === 'mission') loadJson('/api/mission-control-data', renderMission);
    if (mode === 'director') loadJson('/api/director-data', renderDirector);
    if (mode === 'bmc') loadJson('/api/business-model-data', renderBmc);
    if (mode === 'transaction') initTransaction();
  `;
}

function visionTable(goals: VisionGoal[]) {
  if (!goals.length) return '<p class="empty">No vision goals loaded.</p>';
  return `<table><thead><tr><th>Goal</th><th>Horizon</th><th>Target</th><th>Status</th><th>Alignment</th></tr></thead><tbody>${goals.map((goal) => `<tr><td>${escapeHtml(goal.name)}</td><td>${escapeHtml(goal.horizon)}</td><td>${escapeHtml(goal.target_value)}</td><td>${escapeHtml(goal.status)}</td><td>${escapeHtml(goal.alignment_note)}</td></tr>`).join('')}</tbody></table>`;
}

function weeklyReviewTable(reviews: WeeklyReview[]) {
  if (!reviews.length) return '<p class="empty">No weekly reviews loaded.</p>';
  return `<table><thead><tr><th>Week</th><th>Cash</th><th>Delivery</th><th>Business</th><th>Decisions</th><th>Next Actions</th></tr></thead><tbody>${reviews.map((review) => `<tr><td>${escapeHtml(review.week_start)}</td><td>${escapeHtml(review.cash_review)}</td><td>${escapeHtml(review.delivery_review)}</td><td>${escapeHtml(review.business_review)}</td><td>${escapeHtml(review.decisions_needed)}</td><td>${escapeHtml(review.next_actions)}</td></tr>`).join('')}</tbody></table>`;
}

function okrTable(okrs: Array<Okr & Record<string, unknown>>) {
  if (!okrs.length) return '<p class="empty">No OKRs loaded.</p>';
  return `<table><thead><tr><th>Business</th><th>Objective</th><th>Key Results</th><th>Period</th><th>Status</th><th>Confidence</th></tr></thead><tbody>${okrs.map((okr) => `<tr><td>${escapeHtml(okr['business_name'] || 'Sativa')}</td><td>${escapeHtml(okr.objective)}</td><td>${escapeHtml((okr['keyResults'] as string[]).join('; '))}</td><td>${escapeHtml(okr.period)}</td><td>${escapeHtml(okr.status)}</td><td>${escapeHtml(okr.confidence)}%</td></tr>`).join('')}</tbody></table>`;
}

function businessCanvasTable(blocks: Array<BusinessModelBlock & Record<string, unknown>>) {
  const byKey = new Map(blocks.map((block) => [block.block_key, block]));
  return `<table><thead><tr>${BMC_BLOCKS.map(([, name]) => `<th>${escapeHtml(name)}</th>`).join('')}</tr></thead><tbody><tr>${BMC_BLOCKS.map(([key]) => { const block = byKey.get(key); const elements = block ? (block['elements'] as string[]) : []; return `<td>${elements.length ? `<ul>${elements.map((element) => `<li>${escapeHtml(element)}</li>`).join('')}</ul>` : '<span class="empty">empty</span>'}<p class="small">${escapeHtml(block?.control_question ?? '')}</p></td>`; }).join('')}</tr></tbody></table>`;
}

function accountsTable(accounts: Array<Account & { balance: number }>) {
  if (!accounts.length) return '<p class="empty">No accounts loaded.</p>';
  return `<table><thead><tr><th>Account</th><th>Type</th><th>Spendable</th><th class="right">Balance</th><th>Notes</th></tr></thead><tbody>${accounts.map((account) => `<tr><td>${escapeHtml(account.name)}</td><td>${escapeHtml(account.account_type)}</td><td>${account.is_spendable ? 'yes' : 'no'}</td><td class="right">${formatIDR(account.balance)}</td><td>${escapeHtml(account.notes)}</td></tr>`).join('')}</tbody></table>`;
}

function transactionsTable(rows: Array<Transaction & Record<string, unknown> & { running_balance: number }>) {
  if (!rows.length) return '<p class="empty">No transactions loaded.</p>';
  return `<table><thead><tr><th>Date</th><th>Account</th><th>Business</th><th>Type</th><th>Category</th><th class="right">In</th><th class="right">Out</th><th class="right">Balance</th><th>Notes</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.transaction_date)}</td><td>${escapeHtml(row['account_name'])}</td><td>${escapeHtml(row['business_name'])}</td><td>${escapeHtml(row.transaction_type)}</td><td>${escapeHtml(row['category_name'])}</td><td class="right">${formatIDR(row.cash_in)}</td><td class="right">${formatIDR(row.cash_out)}</td><td class="right">${formatIDR(row.running_balance)}</td><td>${escapeHtml(row.description)}<br><span class="small">${escapeHtml(row.reflection)}</span></td></tr>`).join('')}</tbody></table>`;
}

function assetsTable(assets: Array<Record<string, unknown>>) {
  if (!assets.length) return '<p class="empty">No assets loaded.</p>';
  return `<table><thead><tr><th>Asset</th><th>Owner</th><th>Liquidity</th><th class="right">Value</th><th>Notes</th></tr></thead><tbody>${assets.map((asset) => `<tr><td>${escapeHtml(asset.name)}</td><td>${escapeHtml(asset.owner)}</td><td>${escapeHtml(asset.liquidity)}</td><td class="right">${formatIDR(asset.value)}</td><td>${escapeHtml(asset.notes)}</td></tr>`).join('')}</tbody></table>`;
}

function businessesTable(businesses: Array<Business & Record<string, unknown>>) {
  if (!businesses.length) return '<p class="empty">No businesses loaded.</p>';
  return `<table><thead><tr><th>Business</th><th>Ownership</th><th class="right">Revenue</th><th class="right">Expenses</th><th class="right">Investment / Assets</th><th class="right">Net Cash</th><th>Notes</th></tr></thead><tbody>${businesses.map((business) => `<tr><td>${escapeHtml(business.name)}</td><td>${escapeHtml(JSON.stringify(business['ownership']))}</td><td class="right">${formatIDR(business['revenue'])}</td><td class="right">${formatIDR(business['expenses'])}</td><td class="right">${formatIDR(business['investment'])}</td><td class="right">${formatIDR(business['netCash'])}</td><td>${escapeHtml(business.notes)}</td></tr>`).join('')}</tbody></table>`;
}

function taxTable(tax: Record<string, unknown>) {
  return `<table><thead><tr><th>Income</th><th>Tracked Outflows</th><th>Note</th></tr></thead><tbody><tr><td>${formatIDR(tax.income)}</td><td>${formatIDR(tax.deductionsOrTrackedOutflows)}</td><td>${escapeHtml(tax.note)}</td></tr></tbody></table>`;
}
