/*
  # Update User Progress for Creative Tasks

  1. Schema Changes
    - Rename `current_thought` to `mood` in user_progress table
    - Add `last_task_types` array to track recent task types
    - Update default values and constraints

  2. Data Migration
    - Migrate existing `current_thought` data to `mood` column
    - Initialize `last_task_types` as empty array

  3. Security
    - Update RLS policies to reflect new column names
    - Maintain existing security constraints
*/

-- Add new columns to user_progress table
DO $$
BEGIN
  -- Add mood column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_progress' AND column_name = 'mood'
  ) THEN
    ALTER TABLE user_progress ADD COLUMN mood text DEFAULT 'adventure begins now';
  END IF;

  -- Add last_task_types column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_progress' AND column_name = 'last_task_types'
  ) THEN
    ALTER TABLE user_progress ADD COLUMN last_task_types text[] DEFAULT '{}';
  END IF;
END $$;

-- Migrate data from current_thought to mood if current_thought exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_progress' AND column_name = 'current_thought'
  ) THEN
    UPDATE user_progress SET mood = current_thought WHERE mood IS NULL OR mood = 'adventure begins now';
    ALTER TABLE user_progress DROP COLUMN current_thought;
  END IF;
END $$;

-- Update reward_type enum to include new creative task types
DO $$
BEGIN
  -- Check if the enum values need to be added
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'drawing' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'reward_type')
  ) THEN
    ALTER TYPE reward_type ADD VALUE 'drawing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'writing' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'reward_type')
  ) THEN
    ALTER TYPE reward_type ADD VALUE 'writing';
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_mood ON user_progress(mood);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_task_types ON user_progress USING GIN(last_task_types);