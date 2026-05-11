# DeepVital SQL Schemas

## 1. Supabase (Cloud)
Paste these into the Supabase SQL Editor to set up authentication-linked profiles.

```sql
-- Create profiles table for user onboarding data
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  age INTEGER,
  weight NUMERIC,
  height NUMERIC,
  goal TEXT,
  lifestyle_data JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 2. SQLite (Local)
These are automatically handled by `services/database.ts`, but here is the reference:

```sql
CREATE TABLE IF NOT EXISTS user_profile (
  id INTEGER PRIMARY KEY NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_question UNIQUE (question_id)
);

CREATE TABLE IF NOT EXISTS health_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT,
  metadata TEXT,
  timestamp DATETIME NOT NULL,
  CONSTRAINT unique_log UNIQUE (type, timestamp)
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  context_data TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
```
