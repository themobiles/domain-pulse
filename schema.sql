CREATE TABLE IF NOT EXISTS access_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    country TEXT DEFAULT 'Unknown',
    edge_location TEXT DEFAULT 'Unknown',
    isp TEXT DEFAULT 'Unknown',
    protocol TEXT DEFAULT 'Unknown',
    rtt INTEGER DEFAULT 0,
    browser TEXT DEFAULT 'Unknown',
    referer TEXT DEFAULT 'なし'
);
CREATE INDEX IF NOT EXISTS idx_stats_created ON access_stats(created_at);
