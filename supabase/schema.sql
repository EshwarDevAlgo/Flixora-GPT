-- FlixoraGPT Supabase Schema
-- Run this SQL in your Supabase SQL editor (https://supabase.com/dashboard -> SQL Editor)

-- Watchlist Table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  tmdb_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  media_type TEXT DEFAULT 'movie',
  vote_average NUMERIC(3,1),
  overview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);

-- Unique constraint: one entry per user+movie
CREATE UNIQUE INDEX idx_watchlist_user_tmdb ON watchlist(user_id, tmdb_id);

-- Enable Row Level Security
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own watchlist
CREATE POLICY "Users can view own watchlist"
  ON watchlist FOR SELECT
  USING (true);

-- Policy: users can insert to their own watchlist
CREATE POLICY "Users can insert own watchlist"
  ON watchlist FOR INSERT
  WITH CHECK (true);

-- Policy: users can delete from their own watchlist
CREATE POLICY "Users can delete own watchlist"
  ON watchlist FOR DELETE
  USING (true);

-- ─────────────────────────────────────────────────────────────────────
-- Reviews Table
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT DEFAULT 'movie',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_user_tmdb ON reviews(user_id, tmdb_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tmdb_id ON reviews(tmdb_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (true);

-- ─────────────────────────────────────────────────────────────────────
-- Watch History Table
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  tmdb_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  media_type TEXT DEFAULT 'movie',
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_history_user_tmdb ON watch_history(user_id, tmdb_id);
CREATE INDEX IF NOT EXISTS idx_history_user_id ON watch_history(user_id);

ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own history" ON watch_history FOR SELECT USING (true);
CREATE POLICY "Users can insert history" ON watch_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update history" ON watch_history FOR UPDATE USING (true);
CREATE POLICY "Users can delete own history" ON watch_history FOR DELETE USING (true);

