// Optional SQL Schema for Supabase Cloud Database integration
// If the client wants to sync events to Supabase, they can run this in Supabase SQL Editor.

export const SUPABASE_SQL_SCHEMA = `-- 1. Create table for anonymous analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  event_type TEXT NOT NULL,
  page TEXT,
  details JSONB,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous insert (anyone can log events)
CREATE POLICY "Allow anonymous event insert" 
ON analytics_events FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. Allow reading events with anon key (or restrict to authenticated admin)
CREATE POLICY "Allow reading events" 
ON analytics_events FOR SELECT 
TO anon 
USING (true);

-- 5. Create helpful index for fast querying
CREATE INDEX IF NOT EXISTS idx_events_visitor ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at DESC);
`;
