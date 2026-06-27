CREATE TABLE IF NOT EXISTS vision_goals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  horizon TEXT NOT NULL,
  target_value TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  alignment_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS okrs (
  id TEXT PRIMARY KEY,
  business_id TEXT,
  objective TEXT NOT NULL,
  key_results_json TEXT NOT NULL DEFAULT '[]',
  period TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  confidence INTEGER NOT NULL DEFAULT 50,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS weekly_reviews (
  id TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,
  cash_review TEXT NOT NULL DEFAULT '',
  delivery_review TEXT NOT NULL DEFAULT '',
  business_review TEXT NOT NULL DEFAULT '',
  decisions_needed TEXT NOT NULL DEFAULT '',
  next_actions TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_model_blocks (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  block_key TEXT NOT NULL,
  block_name TEXT NOT NULL,
  elements_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  control_question TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE INDEX IF NOT EXISTS idx_business_model_blocks_business ON business_model_blocks(business_id);
CREATE INDEX IF NOT EXISTS idx_okrs_business ON okrs(business_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_week ON weekly_reviews(week_start);
