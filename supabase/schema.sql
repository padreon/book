-- ============================================
-- Banua Publisher — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (auth roles) ──
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('master_admin', 'admin')),
  totp_secret TEXT, -- for 2FA
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by authenticated users" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Profiles updatable by own user" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ── Books ──
CREATE TABLE books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  editor TEXT,
  synopsis TEXT NOT NULL,
  cover_url TEXT,
  images TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Books are publicly readable" ON books
  FOR SELECT USING (true);
CREATE POLICY "Books manageable by authenticated" ON books
  FOR ALL USING (auth.role() = 'authenticated');

-- ── Pages ──
CREATE TABLE pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published pages are publicly readable" ON pages
  FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Pages manageable by authenticated" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

-- ── Contact Messages ──
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages insertable by anyone" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Messages readable by authenticated" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Messages updatable by authenticated" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ── Site Settings ──
CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT DEFAULT ''
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are publicly readable" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Settings manageable by authenticated" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ── Seed Default Settings ──
INSERT INTO site_settings (key, value) VALUES
  ('publisher_name', 'Banua Publisher'),
  ('tagline', 'Menerbitkan karya-karya berkualitas untuk pembaca nusantara'),
  ('address', 'Kalimantan Selatan, Indonesia'),
  ('email', 'info@banuapublisher.com'),
  ('phone', ''),
  ('logo_url', ''),
  ('favicon_url', ''),
  ('instagram_url', ''),
  ('twitter_url', ''),
  ('facebook_url', ''),
  ('youtube_url', ''),
  ('tiktok_url', ''),
  ('whatsapp_number', ''),
  ('google_analytics_id', ''),
  ('footer_text', '© Banua Publisher. Hak cipta dilindungi.'),
  ('meta_description', 'Penerbit buku Indonesia — menerbitkan karya-karya berkualitas untuk pembaca nusantara.')
ON CONFLICT (key) DO NOTHING;

-- ── Storage Bucket ──
-- Run separately in Supabase Dashboard > Storage:
-- Create a public bucket called "media"

-- ── Function: auto-update updated_at ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
