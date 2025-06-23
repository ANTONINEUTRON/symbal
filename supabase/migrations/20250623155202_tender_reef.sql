/*
  # Create app settings table

  1. New Tables
    - `app_settings`
      - `key` (text, primary key) - Setting name
      - `value` (jsonb) - Setting value (flexible data type)
      - `description` (text) - Optional description of the setting
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `app_settings` table
    - Add policy for public read access to settings
    - Only authenticated users can read settings

  3. Initial Data
    - Insert premium XP threshold setting
*/

CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read app settings
CREATE POLICY "Authenticated users can read app settings"
  ON app_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial premium XP threshold
INSERT INTO app_settings (key, value, description) VALUES 
  ('premium_xp_threshold', '75000', 'XP threshold required for premium features'),
  ('max_xp_per_game', '10', 'Maximum XP that can be earned per game'),
  ('sym_to_usd_200k', '5.00', 'Price for 200,000 SYM package'),
  ('sym_to_usd_3m', '50.00', 'Price for 3,000,000 SYM package')
ON CONFLICT (key) DO NOTHING;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_app_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_app_settings_updated_at();