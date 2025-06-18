/*
  # Add reward system to custom experiences

  1. New Types
    - `reward_type` enum for different reward types

  2. Changes to custom_experiences table
    - Add `reward_type` column
    - Add `reward_count` column  
    - Add `reward_instructions` column
    - Remove `difficulty` and `estimated_time` columns (moving to content)

  3. Security
    - Update existing RLS policies to handle new columns
*/

-- Create reward_type enum
CREATE TYPE reward_type AS ENUM ('none', 'regular', 'text_input', 'image_upload');

-- Add new columns to custom_experiences table
DO $$
BEGIN
  -- Add reward_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_experiences' AND column_name = 'reward_type'
  ) THEN
    ALTER TABLE custom_experiences ADD COLUMN reward_type reward_type DEFAULT 'none';
  END IF;

  -- Add reward_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_experiences' AND column_name = 'reward_count'
  ) THEN
    ALTER TABLE custom_experiences ADD COLUMN reward_count integer DEFAULT 0;
  END IF;

  -- Add reward_instructions column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_experiences' AND column_name = 'reward_instructions'
  ) THEN
    ALTER TABLE custom_experiences ADD COLUMN reward_instructions text;
  END IF;
END $$;

-- Remove old columns if they exist
DO $$
BEGIN
  -- Remove difficulty column (moved to content)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_experiences' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE custom_experiences DROP COLUMN difficulty;
  END IF;

  -- Remove estimated_time column (moved to content)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_experiences' AND column_name = 'estimated_time'
  ) THEN
    ALTER TABLE custom_experiences DROP COLUMN estimated_time;
  END IF;
END $$;