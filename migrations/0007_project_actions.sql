CREATE TABLE IF NOT EXISTS project_action_events (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  business_id TEXT NOT NULL,
  action TEXT NOT NULL,
  happened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE INDEX IF NOT EXISTS idx_project_action_events_project ON project_action_events(project_id);
CREATE INDEX IF NOT EXISTS idx_project_action_events_business ON project_action_events(business_id);
