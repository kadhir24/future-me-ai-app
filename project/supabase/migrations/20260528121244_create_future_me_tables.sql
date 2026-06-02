/*
  # Create Future Me AI tables

  1. New Tables
    - `future_profiles`
      - `id` (uuid, primary key)
      - `name` (text, user's name)
      - `age` (integer, user's current age)
      - `dream_career` (text, dream career)
      - `daily_habits` (text, daily habits)
      - `biggest_goal` (text, biggest goal)
      - `skills_to_learn` (text, skills they want to learn)
      - `lifestyle` (text, desired lifestyle)
      - `future_story` (text, AI-generated future story)
      - `future_title` (text, futuristic title/name)
      - `future_income` (text, income & success prediction)
      - `future_routine` (text, daily routine of future self)
      - `future_advice` (text, motivational advice from future self)
      - `achievements` (jsonb, timeline of achievements)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `future_profiles` table
    - Add policy for anyone to insert (no auth required for MVP)
    - Add policy for anyone to read (no auth required for MVP)
*/

CREATE TABLE IF NOT EXISTS future_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  age integer NOT NULL DEFAULT 0,
  dream_career text NOT NULL DEFAULT '',
  daily_habits text NOT NULL DEFAULT '',
  biggest_goal text NOT NULL DEFAULT '',
  skills_to_learn text NOT NULL DEFAULT '',
  lifestyle text NOT NULL DEFAULT '',
  future_story text DEFAULT '',
  future_title text DEFAULT '',
  future_income text DEFAULT '',
  future_routine text DEFAULT '',
  future_advice text DEFAULT '',
  achievements jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE future_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert profiles"
  ON future_profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read profiles"
  ON future_profiles FOR SELECT
  TO anon, authenticated
  USING (true);
