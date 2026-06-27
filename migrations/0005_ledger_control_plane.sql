ALTER TABLE ledger_transactions ADD COLUMN metadata_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE ledger_transactions ADD COLUMN external_ref TEXT;
ALTER TABLE ledger_transactions ADD COLUMN transfer_group_id TEXT;
ALTER TABLE ledger_transactions ADD COLUMN split_parent_id TEXT;
ALTER TABLE ledger_transactions ADD COLUMN receipt_ref TEXT;
ALTER TABLE ledger_transactions ADD COLUMN is_void INTEGER NOT NULL DEFAULT 0;
ALTER TABLE ledger_transactions ADD COLUMN void_reason TEXT;
ALTER TABLE ledger_transactions ADD COLUMN deleted_at TEXT;

ALTER TABLE accounts ADD COLUMN is_restricted INTEGER NOT NULL DEFAULT 0;
ALTER TABLE accounts ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

ALTER TABLE ledger_categories ADD COLUMN parent_category_id TEXT;
ALTER TABLE ledger_categories ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

CREATE UNIQUE INDEX IF NOT EXISTS idx_ledger_transactions_external_ref ON ledger_transactions(external_ref) WHERE external_ref IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ledger_transactions_transfer_group ON ledger_transactions(transfer_group_id);
CREATE INDEX IF NOT EXISTS idx_ledger_transactions_split_parent ON ledger_transactions(split_parent_id);
CREATE INDEX IF NOT EXISTS idx_ledger_transactions_deleted_void ON ledger_transactions(deleted_at, is_void);

CREATE TABLE IF NOT EXISTS ledger_audit_log (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  old_value_json TEXT NOT NULL DEFAULT '{}',
  new_value_json TEXT NOT NULL DEFAULT '{}',
  reason TEXT NOT NULL DEFAULT '',
  actor TEXT NOT NULL DEFAULT 'sativa-mcp',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ledger_audit_log_entity ON ledger_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ledger_audit_log_created ON ledger_audit_log(created_at);

CREATE TABLE IF NOT EXISTS transaction_notes (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  note TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'note',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES ledger_transactions(id)
);

CREATE INDEX IF NOT EXISTS idx_transaction_notes_transaction ON transaction_notes(transaction_id);

CREATE TABLE IF NOT EXISTS transfer_groups (
  id TEXT PRIMARY KEY,
  transaction_date TEXT NOT NULL,
  description TEXT NOT NULL,
  from_account_id TEXT NOT NULL,
  to_account_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  fee_amount INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id),
  FOREIGN KEY (to_account_id) REFERENCES accounts(id)
);
