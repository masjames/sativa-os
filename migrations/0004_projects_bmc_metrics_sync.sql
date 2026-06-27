CREATE TABLE IF NOT EXISTS business_metrics (
  business_id TEXT PRIMARY KEY,
  shareholding_json TEXT NOT NULL DEFAULT '{}',
  energy_hours_per_week INTEGER NOT NULL DEFAULT 0,
  sustainability_score INTEGER NOT NULL DEFAULT 50,
  vision_alignment_score INTEGER NOT NULL DEFAULT 50,
  score_note TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  horizon TEXT NOT NULL DEFAULT 'now',
  priority INTEGER NOT NULL DEFAULT 3,
  outcome TEXT NOT NULL DEFAULT '',
  next_action TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'mission-control',
  buubo_container_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS business_canvases (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL UNIQUE,
  canvas_type TEXT NOT NULL DEFAULT 'bmc_tldraw',
  snapshot_json TEXT NOT NULL DEFAULT '{}',
  schema_version TEXT NOT NULL DEFAULT 'tldraw-snapshot',
  updated_by TEXT NOT NULL DEFAULT 'sativa-os',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS buubo_sync_links (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  buubo_container_id TEXT,
  buubo_tag_id TEXT,
  sync_direction TEXT NOT NULL DEFAULT 'two_way',
  last_synced_at TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE IF NOT EXISTS project_time_rollups (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  minutes_tracked INTEGER NOT NULL DEFAULT 0,
  completed_task_count INTEGER NOT NULL DEFAULT 0,
  open_task_count INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'buubo',
  raw_payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE INDEX IF NOT EXISTS idx_projects_business ON projects(business_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_buubo_sync_links_project ON buubo_sync_links(project_id);
CREATE INDEX IF NOT EXISTS idx_project_time_rollups_project ON project_time_rollups(project_id);
