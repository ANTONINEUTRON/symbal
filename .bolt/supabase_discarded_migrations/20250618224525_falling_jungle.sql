/*
  # Update custom experiences with reward system

  1. Changes
    - Create new reward_type enum for different reward types
    - Remove difficulty and estimated_time columns from custom_experiences
    - Add reward_type, reward_count, and reward_instructions columns
    - Update existing data to use new schema

  2. New Reward Types
    - none: No rewards (default)
    - regular: Creator badge only
    - text_input: Requires text verification (userid, profile link, etc.)
    - image_upload: Requires image upload for verification

  3. Security
    - Maintain existing RLS policies
    - No changes to user permissions
*/

-- Create new enum for reward types
CREATE TYPE reward_type AS ENUM ('none', 'regular', 'text_input', 'image_upload');

-- Alter custom_experiences table
ALTER TABLE custom_experiences
DROP COLUMN IF EXISTS difficulty,
DROP COLUMN IF EXISTS estimated_time,
ADD COLUMN reward_type reward_type DEFAULT 'none',
ADD COLUMN reward_count INTEGER DEFAULT 0,
ADD COLUMN reward_instructions TEXT;

-- Insert 15 dummy experiences with different reward types
INSERT INTO custom_experiences (
  user_id,
  title,
  description,
  is_public,
  plays,
  rating,
  content,
  reward_type,
  reward_count,
  reward_instructions
) VALUES
-- Regular reward experiences
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'The Enchanted Forest Quest',
  'Navigate through a magical woodland filled with mystical creatures and hidden treasures. Solve puzzles and make choices that shape your destiny.',
  true,
  127,
  4.8,
  '{"type": "story", "chapters": 5, "choices": 12}',
  'regular',
  50,
  'Complete all 5 chapters to earn the Forest Guardian badge!'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Space Station Alpha',
  'You are the last survivor on a failing space station. Use your wits to repair critical systems and escape before it''s too late.',
  true,
  89,
  4.6,
  '{"type": "puzzle", "difficulty": "hard", "time_limit": 30}',
  'regular',
  25,
  'Successfully escape the station to earn the Space Explorer badge!'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Mystery of the Lost City',
  'Uncover ancient secrets in this archaeological adventure. Decipher hieroglyphs and solve temple puzzles.',
  true,
  156,
  4.9,
  '{"type": "adventure", "locations": 8, "artifacts": 15}',
  'regular',
  75,
  'Discover all 15 artifacts to earn the Master Archaeologist badge!'
),

-- Text input reward experiences
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Creative Writing Challenge',
  'Write an original short story based on the prompts provided. Share your creativity with the community.',
  true,
  234,
  4.7,
  '{"type": "creative", "prompts": 10, "word_limit": 500}',
  'text_input',
  100,
  'Submit your story by providing your username and a link to your published work. Stories will be reviewed within 48 hours.'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Code the Future',
  'Build a simple web application using the technologies of your choice. Show us your programming skills!',
  true,
  67,
  4.5,
  '{"type": "coding", "languages": ["JavaScript", "Python", "React"], "duration": "1 week"}',
  'text_input',
  200,
  'Share your GitHub repository link and your username. Include a brief description of your project.'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Social Media Growth Hack',
  'Learn proven strategies to grow your social media presence organically. Apply the techniques and share your results.',
  true,
  445,
  4.3,
  '{"type": "marketing", "platforms": ["Instagram", "TikTok", "Twitter"], "strategies": 12}',
  'text_input',
  50,
  'Provide your social media handle and show proof of follower growth (before/after screenshots).'
),

-- Image upload reward experiences
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Photography Masterclass',
  'Master the art of photography with hands-on challenges. Capture stunning images using professional techniques.',
  true,
  178,
  4.8,
  '{"type": "photography", "techniques": 15, "assignments": 8}',
  'image_upload',
  150,
  'Upload your best 3 photos from the assignments. Images will be judged on composition, lighting, and creativity.'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Digital Art Revolution',
  'Create amazing digital artwork using modern tools and techniques. Express your artistic vision.',
  true,
  92,
  4.9,
  '{"type": "art", "tools": ["Photoshop", "Procreate", "Blender"], "projects": 5}',
  'image_upload',
  300,
  'Submit your final artwork in high resolution. Include a brief description of your creative process.'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Fitness Transformation',
  'Complete a 30-day fitness challenge designed to improve strength, endurance, and overall health.',
  true,
  312,
  4.6,
  '{"type": "fitness", "workouts": 30, "difficulty": "progressive"}',
  'image_upload',
  100,
  'Upload before and after photos showing your transformation. Include your workout completion certificate.'
),

-- No reward experiences
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Meditation Journey',
  'Discover inner peace through guided meditation sessions. Learn mindfulness techniques for daily life.',
  true,
  267,
  4.7,
  '{"type": "wellness", "sessions": 21, "duration": "10-20 minutes"}',
  'none',
  0,
  null
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Language Learning Adventure',
  'Master a new language through interactive lessons and real-world practice scenarios.',
  true,
  189,
  4.4,
  '{"type": "education", "languages": ["Spanish", "French", "Japanese"], "levels": 10}',
  'none',
  0,
  null
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Cooking Masterclass',
  'Learn to cook delicious meals from around the world. Master knife skills, flavor combinations, and presentation.',
  true,
  156,
  4.8,
  '{"type": "cooking", "cuisines": ["Italian", "Asian", "French"], "recipes": 25}',
  'none',
  0,
  null
),

-- Mixed reward types for variety
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Entrepreneurship Bootcamp',
  'Build your startup from idea to launch. Learn business fundamentals and pitch to investors.',
  true,
  78,
  4.5,
  '{"type": "business", "modules": 12, "case_studies": 20}',
  'text_input',
  500,
  'Submit your business plan and pitch deck. Include your LinkedIn profile for verification.'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Music Production Studio',
  'Create your own music tracks using professional production techniques and software.',
  true,
  134,
  4.7,
  '{"type": "music", "genres": ["Electronic", "Hip-Hop", "Pop"], "tracks": 3}',
  'image_upload',
  250,
  'Upload a screenshot of your completed track in your DAW and provide a link to the audio file.'
),
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Sustainable Living Challenge',
  'Adopt eco-friendly practices and reduce your environmental footprint through daily actions.',
  true,
  203,
  4.6,
  '{"type": "lifestyle", "challenges": 30, "impact_tracking": true}',
  'regular',
  75,
  'Complete all 30 daily challenges to earn the Eco Warrior badge!'
);
