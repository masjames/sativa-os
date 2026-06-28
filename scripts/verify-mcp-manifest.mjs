#!/usr/bin/env node
const url = process.argv[2] || 'https://sativa-os.praditya-bagus.workers.dev/mcp';
export const expectedTools = [
  'add_transaction','list_transactions','list_accounts','list_categories','get_asset_table','get_business_accounting','get_business_model_canvas','get_cashflow','get_director_summary','get_money_situation','get_okrs','get_sativa_300t_alignment','get_tax_summary','get_weekly_review','pull_daily_brief','update_business_model_canvas',
  'get_transaction','edit_transaction','update_transaction','reclassify_transaction','void_transaction','soft_delete_transaction','delete_transaction','create_transfer','record_transfer','create_split','split_transaction','add_transaction_note','attach_receipt','reconcile_account','read_audit_log','get_audit_log','bulk_update_transactions','bulk_reclassify_by_rule',
  'create_account','update_account','archive_account','create_category','update_category','merge_categories','list_businesses','create_business','update_business','export_ledger','import_transactions','get_spending_by_category','get_recurring_expenses'
];
export const preferredNames = ['edit_transaction','soft_delete_transaction','create_transfer','create_split','read_audit_log'];
export const aliases = ['update_transaction','delete_transaction','record_transfer','split_transaction','get_audit_log'];
export const requiredSchemaFields = {
  edit_transaction: ['transaction_id','patch_json','edit_reason'], update_transaction: ['transaction_id','patch_json','edit_reason'],
  reclassify_transaction: ['transaction_id','edit_reason'], void_transaction: ['transaction_id','void_reason'],
  soft_delete_transaction: ['transaction_id','delete_reason'], delete_transaction: ['transaction_id','delete_reason'],
  create_transfer: ['from_account_id','to_account_id','amount','description'], record_transfer: ['from_account_id','to_account_id','amount','description'],
  create_split: ['parent_transaction_id','splits_json','split_reason'], split_transaction: ['parent_transaction_id','splits_json','split_reason'],
  add_transaction_note: ['transaction_id','note_type','note'], attach_receipt: ['transaction_id','receipt_ref'], reconcile_account: ['account_id','actual_balance','reason'],
  read_audit_log: [], get_audit_log: [], get_transaction: ['transaction_id'], bulk_update_transactions: ['transaction_ids_json','patch_json','edit_reason'],
  bulk_reclassify_by_rule: ['match_json','patch_json','edit_reason'], create_account: ['account_id','name'], update_account: ['account_id','patch_json','edit_reason'],
  archive_account: ['account_id','archive_reason'], create_category: ['category_id','name'], update_category: ['category_id','patch_json','edit_reason'],
  merge_categories: ['from_category_id','to_category_id','merge_reason'], create_business: ['business_id','name'], update_business: ['business_id','patch_json','edit_reason'],
  export_ledger: ['format'], import_transactions: ['transactions_json']
};
export async function fetchTools(endpoint) {
  const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });
  let json;
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body });
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${endpoint}`);
    json = await response.json();
  } catch (error) {
    if (!endpoint.startsWith('http://127.0.0.1') && !endpoint.startsWith('http://localhost')) {
      const { execFileSync } = await import('node:child_process');
      const stdout = execFileSync('curl', ['-sS', endpoint, '-X', 'POST', '-H', 'content-type: application/json', '--data', body], { encoding: 'utf8' });
      json = JSON.parse(stdout);
    } else {
      throw error;
    }
  }
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result?.tools || [];
}
export function verifyTools(tools) {
  const names = tools.map((tool) => tool.name);
  const byName = new Map(tools.map((tool) => [tool.name, tool]));
  const missingExpected = expectedTools.filter((name) => !byName.has(name));
  const missingEmptySchemas = tools.filter((tool) => {
    const required = requiredSchemaFields[tool.name];
    if (required === undefined || required.length === 0) return false;
    return !tool.inputSchema || tool.inputSchema.type !== 'object' || !tool.inputSchema.properties || Object.keys(tool.inputSchema.properties).length === 0;
  }).map((tool) => tool.name);
  const schemaFieldFailures = Object.entries(requiredSchemaFields).flatMap(([name, required]) => {
    const schemaRequired = byName.get(name)?.inputSchema?.required || [];
    return required.filter((field) => !schemaRequired.includes(field)).map((field) => `${name}.${field}`);
  });
  return { names, total: tools.length, missingExpected, missingEmptySchemas, schemaFieldFailures, preferred: preferredNames.filter((name) => byName.has(name)), aliases: aliases.filter((name) => byName.has(name)), pass: missingExpected.length === 0 && missingEmptySchemas.length === 0 && schemaFieldFailures.length === 0 };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const tools = await fetchTools(url);
  const result = verifyTools(tools);
  console.log(`Endpoint: ${url}`);
  console.log(`Total tool count: ${result.total}`);
  console.log(`Missing expected tools: ${result.missingExpected.length ? result.missingExpected.join(', ') : 'none'}`);
  console.log(`Tools with missing/empty schemas: ${result.missingEmptySchemas.length ? result.missingEmptySchemas.join(', ') : 'none'}`);
  console.log(`Schema required-field failures: ${result.schemaFieldFailures.length ? result.schemaFieldFailures.join(', ') : 'none'}`);
  console.log(`Preferred names confirmed: ${result.preferred.join(', ')}`);
  console.log(`Compatibility aliases confirmed: ${result.aliases.join(', ')}`);
  console.log(result.pass ? 'PASS' : 'FAIL');
  process.exit(result.pass ? 0 : 1);
}
