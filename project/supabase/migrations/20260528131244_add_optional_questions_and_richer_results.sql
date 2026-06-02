/*
  # Add optional questions and richer future fields

  1. Modified Tables
    - `future_profiles`
      - Add optional question fields:
        - `personality_type` (text, introvert/extrovert)
        - `dream_location` (text, dream city/country)
        - `energy_time` (text, morning/night)
        - `lifestyle_aesthetic` (text, aesthetic preference)
        - `career_type` (text, career type preference)
        - `favorite_hobby` (text, hobby)
        - `motivation` (text, what motivates most)
        - `workspace_style` (text, dream workspace)
      - Add richer result fields:
        - `personality_evolution` (text, how personality evolved)
        - `workspace_vibe` (text, future workspace description)
        - `success_meter` (integer, 0-100 score)
        - `hidden_talent` (text, predicted hidden talent)
        - `ai_score` (integer, 0-100 AI future score)
        - `glow_up` (text, glow-up evolution description)
        - `future_quote` (text, future self quote)
        - `optional_completed` (boolean, whether optional questions were answered)
  2. Security
    - RLS already enabled
    - Policies already exist
*/

DO $$
BEGIN
  -- Optional question fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'personality_type') THEN
    ALTER TABLE future_profiles ADD COLUMN personality_type text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'dream_location') THEN
    ALTER TABLE future_profiles ADD COLUMN dream_location text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'energy_time') THEN
    ALTER TABLE future_profiles ADD COLUMN energy_time text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'lifestyle_aesthetic') THEN
    ALTER TABLE future_profiles ADD COLUMN lifestyle_aesthetic text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'career_type') THEN
    ALTER TABLE future_profiles ADD COLUMN career_type text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'favorite_hobby') THEN
    ALTER TABLE future_profiles ADD COLUMN favorite_hobby text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'motivation') THEN
    ALTER TABLE future_profiles ADD COLUMN motivation text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'workspace_style') THEN
    ALTER TABLE future_profiles ADD COLUMN workspace_style text DEFAULT '';
  END IF;

  -- Richer result fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'personality_evolution') THEN
    ALTER TABLE future_profiles ADD COLUMN personality_evolution text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'workspace_vibe') THEN
    ALTER TABLE future_profiles ADD COLUMN workspace_vibe text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'success_meter') THEN
    ALTER TABLE future_profiles ADD COLUMN success_meter integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'hidden_talent') THEN
    ALTER TABLE future_profiles ADD COLUMN hidden_talent text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'ai_score') THEN
    ALTER TABLE future_profiles ADD COLUMN ai_score integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'glow_up') THEN
    ALTER TABLE future_profiles ADD COLUMN glow_up text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'future_quote') THEN
    ALTER TABLE future_profiles ADD COLUMN future_quote text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'optional_completed') THEN
    ALTER TABLE future_profiles ADD COLUMN optional_completed boolean DEFAULT false;
  END IF;
END $$;