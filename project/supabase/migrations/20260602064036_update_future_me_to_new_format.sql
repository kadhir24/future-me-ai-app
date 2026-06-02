/*
  # Update Future Me schema to new story format

  1. Modified Tables
    - `future_profiles`
      - Remove old story fields: future_story, future_title, future_income, future_routine, future_advice, achievements, personality_evolution, workspace_vibe, success_meter, hidden_talent, ai_score, glow_up, future_quote
      - Remove old optional fields: lifestyle_aesthetic, workspace_style
      - Add new story fields:
        - `future_you` (text, who they become)
        - `turning_point` (text, biggest turning point)
        - `next_year` (text, next year events)
        - `three_years` (text, 3 years later events)
        - `five_years` (text, 5 years later events)
        - `ten_years` (text, 10 years later events)
        - `day_in_life` (text, realistic day 10 years from now)
        - `one_lesson` (text, one key lesson)
        - `message_from_future` (text, message from future self)
      - Add new optional field:
        - `what_matters` (text, what matters most)
  2. Security
    - RLS already enabled
    - Policies already exist
*/

DO $$
BEGIN
  -- Drop old story columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'future_story') THEN
    ALTER TABLE future_profiles DROP COLUMN future_story;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'future_title') THEN
    ALTER TABLE future_profiles DROP COLUMN future_title;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'future_income') THEN
    ALTER TABLE future_profiles DROP COLUMN future_income;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'future_routine') THEN
    ALTER TABLE future_profiles DROP COLUMN future_routine;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'future_advice') THEN
    ALTER TABLE future_profiles DROP COLUMN future_advice;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'achievements') THEN
    ALTER TABLE future_profiles DROP COLUMN achievements;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'personality_evolution') THEN
    ALTER TABLE future_profiles DROP COLUMN personality_evolution;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'workspace_vibe') THEN
    ALTER TABLE future_profiles DROP COLUMN workspace_vibe;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'success_meter') THEN
    ALTER TABLE future_profiles DROP COLUMN success_meter;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'hidden_talent') THEN
    ALTER TABLE future_profiles DROP COLUMN hidden_talent;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'ai_score') THEN
    ALTER TABLE future_profiles DROP COLUMN ai_score;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'glow_up') THEN
    ALTER TABLE future_profiles DROP COLUMN glow_up;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'future_quote') THEN
    ALTER TABLE future_profiles DROP COLUMN future_quote;
  END IF;

  -- Drop old optional question fields
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'lifestyle_aesthetic') THEN
    ALTER TABLE future_profiles DROP COLUMN lifestyle_aesthetic;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'workspace_style') THEN
    ALTER TABLE future_profiles DROP COLUMN workspace_style;
  END IF;

  -- Add new story columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'future_you') THEN
    ALTER TABLE future_profiles ADD COLUMN future_you text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'turning_point') THEN
    ALTER TABLE future_profiles ADD COLUMN turning_point text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'next_year') THEN
    ALTER TABLE future_profiles ADD COLUMN next_year text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'three_years') THEN
    ALTER TABLE future_profiles ADD COLUMN three_years text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'five_years') THEN
    ALTER TABLE future_profiles ADD COLUMN five_years text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'ten_years') THEN
    ALTER TABLE future_profiles ADD COLUMN ten_years text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'day_in_life') THEN
    ALTER TABLE future_profiles ADD COLUMN day_in_life text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'one_lesson') THEN
    ALTER TABLE future_profiles ADD COLUMN one_lesson text DEFAULT '';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'message_from_future') THEN
    ALTER TABLE future_profiles ADD COLUMN message_from_future text DEFAULT '';
  END IF;

  -- Add new optional question field
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'future_profiles' AND column_name = 'what_matters') THEN
    ALTER TABLE future_profiles ADD COLUMN what_matters text DEFAULT '';
  END IF;
END $$;