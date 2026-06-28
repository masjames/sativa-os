import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const worker = () => readFileSync(new URL('../src/worker.ts', import.meta.url), 'utf8');
const frontend = () => readFileSync(new URL('../src/frontend/main.tsx', import.meta.url), 'utf8');

test('worker exposes Sativa OS ledger, director, project, BMC, canvas, and MCP endpoints', () => {
  const source = worker();
  for (const endpoint of ['/health', '/mcp', '/director', '/projects', '/business-model', '/api/projects', '/api/business-metrics', '/api/sync/buubo/status', '/api/mission-control-data', '/api/director-data', '/api/business-model-data', '/api/ledger/summary', '/api/ledger/transactions', '/api/director/summary', '/api/weekly-review', '/api/okrs', '/api/vision', '/api/business-model']) {
    assert.match(source, new RegExp(endpoint.replaceAll('/', '\\/')));
  }
  for (const tool of ['tools/list', 'tools/call', 'initialize', 'get_money_situation', 'add_transaction', 'get_director_summary', 'get_weekly_review', 'get_okrs', 'get_sativa_300t_alignment', 'get_business_model_canvas', 'update_business_model_canvas', 'edit_transaction', 'update_transaction', 'reclassify_transaction', 'void_transaction', 'soft_delete_transaction', 'delete_transaction', 'create_transfer', 'record_transfer', 'create_split', 'split_transaction', 'add_transaction_note', 'attach_receipt', 'get_transaction', 'reconcile_account', 'create_account', 'update_account', 'archive_account', 'create_category', 'update_category', 'merge_categories', 'list_businesses', 'create_business', 'update_business', 'get_spending_by_category', 'get_recurring_expenses', 'export_ledger', 'import_transactions', 'bulk_update_transactions', 'bulk_reclassify_by_rule', 'read_audit_log', 'get_audit_log']) {
    assert.match(source, new RegExp(tool));
  }
});

test('worker implements no-auth Streamable HTTP MCP JSON-RPC primitives', () => {
  const source = worker();
  for (const marker of ['handleMcpRequest', 'handleMcpMessage', 'MCP_TOOL_DEFINITIONS', 'inputSchema', 'structuredContent', 'protocolVersion', 'streamable-http-json-rpc']) {
    assert.match(source, new RegExp(marker));
  }
});

test('migration creates auditable ledger control-plane tables and columns', () => {
  const controlSql = readFileSync(new URL('../migrations/0005_ledger_control_plane.sql', import.meta.url), 'utf8');
  const auditMetadataSql = readFileSync(new URL('../migrations/0006_audit_metadata.sql', import.meta.url), 'utf8');
  for (const marker of ['metadata_json', 'external_ref', 'transfer_group_id', 'split_parent_id', 'receipt_ref', 'is_void', 'void_reason', 'deleted_at', 'ledger_audit_log', 'transaction_notes', 'transfer_groups']) {
    assert.match(controlSql, new RegExp(marker));
  }
  assert.match(auditMetadataSql, /metadata_json/);
});

test('migrations create ledger, director, project, metric, canvas, and sync tables', () => {
  const ledgerSql = readFileSync(new URL('../migrations/0002_ledger_accounting.sql', import.meta.url), 'utf8');
  const directorSql = readFileSync(new URL('../migrations/0003_director_controls.sql', import.meta.url), 'utf8');
  const projectSql = readFileSync(new URL('../migrations/0004_projects_bmc_metrics_sync.sql', import.meta.url), 'utf8');
  for (const table of ['accounts', 'businesses', 'ledger_categories', 'ledger_transactions', 'business_reports', 'reflection_notes']) {
    assert.match(ledgerSql, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  }
  for (const table of ['vision_goals', 'okrs', 'weekly_reviews', 'business_model_blocks']) {
    assert.match(directorSql, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  }
  for (const table of ['business_metrics', 'projects', 'business_canvases', 'buubo_sync_links', 'project_time_rollups']) {
    assert.match(projectSql, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  }
});

test('seeded cash, projects, and director strategy match current facts', () => {
  const source = worker();
  for (const term of ['Monthly salary received', '2_000_000', 'WARAS initial asset held in Sonny bank account', '1_000_000', 'Adit: 65', 'Sonny: 35', 'Sativa 300T Vision', 'Launch AppWorkZ Upwork service channel', 'Coreitera mental health onboarding', 'AppWorkZ CV preparation', 'Rileks initial MVP', 'Zippp.link deployment']) {
    assert.match(source, new RegExp(term));
  }
});

test('react frontend uses fast static BMC, simple transaction form, MCP nav, and browser cache', () => {
  const source = frontend();
  for (const marker of ['Business Model Canvas', 'business-tabs', 'bmc-layout', '✎ edit', 'save all', 'simple-form', '+transaction', 'MCP Manifest', 'localStorage']) {
    assert.ok(source.includes(marker), `missing ${marker}`);
  }
  assert.doesNotMatch(source, /tldraw|Tldraw|getSnapshot|loadSnapshot/);
});

test('minimal visual language is still black and white', () => {
  const styles = readFileSync(new URL('../src/frontend/styles.css', import.meta.url), 'utf8');
  assert.match(styles, /background: #fff; color: #000/);
  assert.doesNotMatch(styles, /gradient|box-shadow|rgba|radial-gradient|glow/i);
});
