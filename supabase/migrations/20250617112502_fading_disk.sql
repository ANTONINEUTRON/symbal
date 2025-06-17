/*
  # Initial Schema for Symbal Story App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `xp` (integer, default 0)
      - `level` (integer, default 1)
      - `current_story_index` (integer, default 0)
      - `current_thought` (text, default 'adventure begins now')
      - `completed_games` (text array, default empty)
      - `achievements` (text array, default empty)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `custom_experiences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `difficulty` (text, enum: Easy/Medium/Hard)
      - `estimated_time` (text)
      - `is_public` (boolean, default false)
      - `plays` (integer, default 0)
      - `rating` (numeric, default 0)
      - `content` (jsonb for storing experience data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public access to public experiences
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  current_story_index integer DEFAULT 0,
  current_thought text DEFAULT 'adventure begins now',
  completed_games text[] DEFAULT '{}',
  achievements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create custom_experiences table
CREATE TABLE IF NOT EXISTS custom_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  estimated_time text DEFAULT '10-15 min',
  is_public boolean DEFAULT false,
  plays integer DEFAULT 0,
  rating numeric DEFAULT 0,
  content jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_experiences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- User progress policies
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Custom experiences policies
CREATE POLICY "Users can read own experiences"
  ON custom_experiences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read public experiences"
  ON custom_experiences
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can insert own experiences"
  ON custom_experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences"
  ON custom_experiences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiences"
  ON custom_experiences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_experiences_user_id ON custom_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_experiences_public ON custom_experiences(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_custom_experiences_created_at ON custom_experiences(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_experiences_updated_at
  BEFORE UPDATE ON custom_experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();