CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  owner TEXT NOT NULL DEFAULT 'Adit',
  currency TEXT NOT NULL DEFAULT 'IDR',
  is_spendable INTEGER NOT NULL DEFAULT 1,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  ownership_json TEXT NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ledger_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL,
  tax_relevant INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS ledger_transactions (
  id TEXT PRIMARY KEY,
  transaction_date TEXT NOT NULL,
  account_id TEXT NOT NULL,
  business_id TEXT,
  category_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT NOT NULL,
  cash_in INTEGER NOT NULL DEFAULT 0,
  cash_out INTEGER NOT NULL DEFAULT 0,
  counterparty TEXT,
  tax_tag TEXT,
  reflection TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  FOREIGN KEY (category_id) REFERENCES ledger_categories(id)
);

CREATE INDEX IF NOT EXISTS idx_ledger_transactions_date ON ledger_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_ledger_transactions_account ON ledger_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_ledger_transactions_business ON ledger_transactions(business_id);
CREATE INDEX IF NOT EXISTS idx_ledger_transactions_category ON ledger_transactions(category_id);

CREATE TABLE IF NOT EXISTS business_reports (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  report_type TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  raw_report_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS reflection_notes (
  id TEXT PRIMARY KEY,
  period_start TEXT,
  period_end TEXT,
  topic TEXT NOT NULL,
  body TEXT NOT NULL,
  linked_transaction_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (linked_transaction_id) REFERENCES ledger_transactions(id)
);
