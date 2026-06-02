export interface UserInput {
  name: string;
  age: number;
  dreamCareer: string;
  dailyHabits: string;
  biggestGoal: string;
  lifestyle: string;
  // Optional
  personalityType: string;
  dreamLocation: string;
  energyTime: string;
  careerType: string;
  favoriteHobby: string;
  motivation: string;
  whatMatters: string;
  optionalCompleted: boolean;
}

export interface FutureProfile {
  id: string;
  name: string;
  age: number;
  dream_career: string;
  daily_habits: string;
  biggest_goal: string;
  lifestyle: string;
  personality_type: string;
  dream_location: string;
  energy_time: string;
  career_type: string;
  favorite_hobby: string;
  motivation: string;
  what_matters: string;
  future_you: string;
  turning_point: string;
  next_year: string;
  three_years: string;
  five_years: string;
  ten_years: string;
  day_in_life: string;
  one_lesson: string;
  message_from_future: string;
  optional_completed: boolean;
  created_at: string;
}

export interface GenerationResult {
  futureYou: string;
  turningPoint: string;
  nextYear: string;
  threeYears: string;
  fiveYears: string;
  tenYears: string;
  dayInLife: string;
  oneLesson: string;
  messageFromFuture: string;
}
