CREATE TABLE funnel_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  occurred_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  event_name TEXT NOT NULL,
  language TEXT NOT NULL,
  path TEXT NOT NULL,
  placement TEXT NOT NULL DEFAULT '',
  form_type TEXT NOT NULL DEFAULT '',
  outcome TEXT NOT NULL DEFAULT '',
  operating_system TEXT NOT NULL DEFAULT ''
);

CREATE INDEX funnel_events_occurred_at_idx ON funnel_events (occurred_at);
CREATE INDEX funnel_events_name_time_idx ON funnel_events (event_name, occurred_at);
