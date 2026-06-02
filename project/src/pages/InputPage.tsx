import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Briefcase, Repeat, Target, Sparkles,
  ChevronRight, Home, Brain, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { UserInput } from '../lib/types';

// --- Required question steps ---
const requiredSteps = [
  { key: 'name', label: 'What is your name?', placeholder: 'Enter your name...', icon: User, type: 'text' },
  { key: 'age', label: 'How old are you?', placeholder: 'Enter your age...', icon: User, type: 'number' },
  { key: 'dreamCareer', label: 'What is your biggest dream?', placeholder: 'e.g., Build a tech startup, become a surgeon...', icon: Briefcase, type: 'text' },
  { key: 'biggestGoal', label: 'What is your future goal?', placeholder: 'e.g., Financial freedom, impact millions...', icon: Target, type: 'text' },
  { key: 'lifestyle', label: 'Dream lifestyle?', placeholder: 'e.g., Beachside calm, urban creative, mountain retreat...', icon: Home, type: 'text' },
  { key: 'dailyHabits', label: 'Current daily habits?', placeholder: 'e.g., Read 30min, exercise, code daily...', icon: Repeat, type: 'text' },
] as const;

type RequiredKey = (typeof requiredSteps)[number]['key'];

// --- Optional question steps with interactive choice cards ---
interface ChoiceOption {
  label: string;
  emoji: string;
  value: string;
}

const optionalSteps: { key: keyof UserInput; label: string; options: ChoiceOption[] }[] = [
  {
    key: 'personalityType',
    label: 'Introvert or Extrovert?',
    options: [
      { label: 'Introvert', emoji: '\u{1F4DA}', value: 'introvert' },
      { label: 'Ambivert', emoji: '\u{2696}\u{FE0F}', value: 'ambivert' },
      { label: 'Extrovert', emoji: '\u{1F389}', value: 'extrovert' },
    ],
  },
  {
    key: 'dreamLocation',
    label: 'Dream city or country?',
    options: [
      { label: 'Tokyo', emoji: '\u{1F5FC}', value: 'Tokyo' },
      { label: 'New York', emoji: '\u{1F5FD}', value: 'New York' },
      { label: 'Bali', emoji: '\u{1F3DD}\u{FE0F}', value: 'Bali' },
      { label: 'London', emoji: '\u{1F4CD}', value: 'London' },
      { label: 'Dubai', emoji: '\u{1F3D7}\u{FE0F}', value: 'Dubai' },
      { label: 'Other', emoji: '\u{1F30D}', value: 'other' },
    ],
  },
  {
    key: 'energyTime',
    label: 'Morning or Night person?',
    options: [
      { label: 'Early Bird', emoji: '\u{2600}\u{FE0F}', value: 'morning' },
      { label: 'Night Owl', emoji: '\u{1F319}', value: 'night' },
      { label: 'Both', emoji: '\u{1F310}', value: 'both' },
    ],
  },
  {
    key: 'careerType',
    label: 'Dream career type?',
    options: [
      { label: 'Creator', emoji: '\u{1F3A8}', value: 'creator' },
      { label: 'Leader', emoji: '\u{1F451}', value: 'leader' },
      { label: 'Builder', emoji: '\u{1F527}', value: 'builder' },
      { label: 'Healer', emoji: '\u{1F48A}', value: 'healer' },
      { label: 'Explorer', emoji: '\u{1F9ED}', value: 'explorer' },
      { label: 'Teacher', emoji: '\u{1F4AF}', value: 'teacher' },
    ],
  },
  {
    key: 'favoriteHobby',
    label: 'Favorite hobby?',
    options: [
      { label: 'Reading', emoji: '\u{1F4DA}', value: 'reading' },
      { label: 'Gaming', emoji: '\u{1F3AE}', value: 'gaming' },
      { label: 'Cooking', emoji: '\u{1F373}', value: 'cooking' },
      { label: 'Music', emoji: '\u{1F3B5}', value: 'music' },
      { label: 'Fitness', emoji: '\u{1F3CB}', value: 'fitness' },
      { label: 'Travel', emoji: '\u{2708}\u{FE0F}', value: 'travel' },
    ],
  },
  {
    key: 'motivation',
    label: 'What motivates you most?',
    options: [
      { label: 'Freedom', emoji: '\u{1F513}', value: 'freedom' },
      { label: 'Impact', emoji: '\u{1F30D}', value: 'impact' },
      { label: 'Wealth', emoji: '\u{1F4B0}', value: 'wealth' },
      { label: 'Knowledge', emoji: '\u{1F9E0}', value: 'knowledge' },
      { label: 'Love', emoji: '\u{2764}\u{FE0F}', value: 'love' },
      { label: 'Challenge', emoji: '\u{1F525}', value: 'challenge' },
    ],
  },
  {
    key: 'whatMatters',
    label: 'What matters most to you?',
    options: [
      { label: 'Family', emoji: '\u{1F46A}', value: 'family' },
      { label: 'Friends', emoji: '\u{1F917}', value: 'friends' },
      { label: 'Success', emoji: '\u{1F3C6}', value: 'success' },
      { label: 'Freedom', emoji: '\u{1F513}', value: 'freedom' },
      { label: 'Creativity', emoji: '\u{1F3A8}', value: 'creativity' },
      { label: 'Learning', emoji: '\u{1F4DA}', value: 'learning' },
      { label: 'Adventure', emoji: '\u{1F9D8}', value: 'adventure' },
      { label: 'Helping Others', emoji: '\u{1F92F}', value: 'helping' },
    ],
  },
];

type Phase = 'required' | 'prompt' | 'optional' | 'generating';

function InputPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('required');
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    age: 0,
    dreamCareer: '',
    dailyHabits: '',
    biggestGoal: '',
    lifestyle: '',
    personalityType: '',
    dreamLocation: '',
    energyTime: '',
    careerType: '',
    favoriteHobby: '',
    motivation: '',
    whatMatters: '',
    optionalCompleted: false,
  });

  // Required step helpers
  const requiredStep = requiredSteps[currentStep];
  const requiredProgress = ((currentStep + 1) / requiredSteps.length) * 100;

  const updateRequiredField = (key: RequiredKey, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === 'age' ? (parseInt(val) || 0) : val,
    }));
  };

  const canProceedRequired = () => {
    const v = formData[requiredStep.key as RequiredKey];
    if (requiredStep.key === 'age') return Number(v) > 0 && Number(v) < 150;
    return String(v).trim().length > 0;
  };

  const handleRequiredNext = () => {
    if (currentStep < requiredSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setPhase('prompt');
    }
  };

  const handleRequiredBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleRequiredKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceedRequired()) handleRequiredNext();
  };

  // Optional step helpers
  const [optionalStep, setOptionalStep] = useState(0);

  const selectOption = (key: keyof UserInput, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (optionalStep < optionalSteps.length - 1) {
      setTimeout(() => setOptionalStep((prev) => prev + 1), 300);
    } else {
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, optionalCompleted: true }));
        handleSubmit();
      }, 300);
    }
  };

  const skipOptional = () => {
    setFormData((prev) => ({ ...prev, optionalCompleted: false }));
    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setPhase('generating');
    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Generation failed');
      const result = await res.json();

      const { data, error } = await supabase
        .from('future_profiles')
        .insert({
          name: formData.name,
          age: formData.age,
          dream_career: formData.dreamCareer,
          daily_habits: formData.dailyHabits,
          biggest_goal: formData.biggestGoal,
          lifestyle: formData.lifestyle,
          personality_type: formData.personalityType,
          dream_location: formData.dreamLocation,
          energy_time: formData.energyTime,
          career_type: formData.careerType,
          favorite_hobby: formData.favoriteHobby,
          motivation: formData.motivation,
          what_matters: formData.whatMatters,
          future_you: result.futureYou,
          turning_point: result.turningPoint,
          next_year: result.nextYear,
          three_years: result.threeYears,
          five_years: result.fiveYears,
          ten_years: result.tenYears,
          day_in_life: result.dayInLife,
          one_lesson: result.oneLesson,
          message_from_future: result.messageFromFuture,
          optional_completed: formData.optionalCompleted,
        })
        .select('id')
        .maybeSingle();

      if (error) throw error;
      if (data) navigate(`/result/${data.id}`);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  // --- GENERATING PHASE ---
  if (phase === 'generating' || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 grid-bg"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-neon-blue/15 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-neon-cyan/15 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full border-2 border-neon-blue/30 border-t-neon-blue" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-neon-cyan" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 font-orbitron text-neon-blue text-lg tracking-widest"
        >
          GENERATING YOUR FUTURE...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-3 text-gray-500 text-sm"
        >
          The AI is analyzing your choices and building your future timeline
        </motion.p>
      </motion.div>
    );
  }

  // --- PROMPT PHASE: "Want more accurate prediction?" ---
  if (phase === 'prompt') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 grid-bg relative"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-neon-blue/10 rounded-full blur-[80px]" />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10 text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-neon-cyan" />
          </div>

          <h2 className="font-orbitron text-2xl sm:text-3xl text-white font-bold mb-4">
            Want a more accurate future prediction?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-10 leading-relaxed">
            Answer a few fun questions and we'll generate a deeply personal future — your personality evolution, hidden talents, workspace vibe, and more.
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setOptionalStep(0);
                setPhase('optional');
              }}
              className="btn-futuristic flex items-center justify-center gap-2 font-orbitron text-sm tracking-wider"
            >
              <Zap className="w-4 h-4" />
              Yes, Let's Go Deeper
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={skipOptional}
              className="glass-card px-6 py-3 text-gray-400 hover:text-gray-200 transition-colors font-orbitron text-xs tracking-wider"
            >
              Skip & Generate Now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // --- OPTIONAL PHASE ---
  if (phase === 'optional') {
    const step = optionalSteps[optionalStep];
    const optionalProgress = ((optionalStep + 1) / optionalSteps.length) * 100;
    const selected = formData[step.key] as string;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col px-6 py-8 grid-bg relative"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-neon-cyan/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-neon-blue/8 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto w-full flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={skipOptional}
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              Skip all
            </button>
            <span className="font-orbitron text-xs text-gray-500 tracking-wider">
              {optionalStep + 1} / {optionalSteps.length}
            </span>
          </div>

          <div className="progress-track mb-10">
            <motion.div
              className="progress-fill"
              animate={{ width: `${optionalProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <div className="flex-1 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={optionalStep}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <h2 className="font-orbitron text-xl sm:text-2xl text-white font-bold text-center mb-8">
                  {step.label}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {step.options.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => selectOption(step.key, opt.value)}
                      className={`glass-card p-4 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer
                        ${selected === opt.value ? 'neon-border-cyan bg-neon-cyan/10' : 'hover:neon-border'}`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className={`text-sm font-medium ${selected === opt.value ? 'text-neon-cyan' : 'text-gray-300'}`}>
                        {opt.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- REQUIRED PHASE (default) ---
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col px-6 py-8 grid-bg relative"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-neon-blue/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-neon-cyan/8 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleRequiredBack}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-gray-400 hover:text-neon-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="text-sm">Back</span>
          </button>
          <span className="font-orbitron text-xs text-gray-500 tracking-wider">
            {currentStep + 1} / {requiredSteps.length}
          </span>
        </div>

        <div className="progress-track mb-10">
          <motion.div
            className="progress-fill"
            animate={{ width: `${requiredProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="glass-card-strong p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                    <requiredStep.icon className="w-5 h-5 text-neon-blue" />
                  </div>
                  <h2 className="font-orbitron text-lg md:text-xl text-white font-semibold">
                    {requiredStep.label}
                  </h2>
                </div>

                <input
                  type={requiredStep.type}
                  placeholder={requiredStep.placeholder}
                  value={requiredStep.key === 'age' ? (formData.age || '') : formData[requiredStep.key as RequiredKey]}
                  onChange={(e) => updateRequiredField(requiredStep.key as RequiredKey, e.target.value)}
                  onKeyDown={handleRequiredKeyDown}
                  className="input-futuristic text-lg"
                  autoFocus
                  min={requiredStep.key === 'age' ? 1 : undefined}
                  max={requiredStep.key === 'age' ? 149 : undefined}
                />

                <motion.button
                  onClick={handleRequiredNext}
                  disabled={!canProceedRequired()}
                  whileHover={canProceedRequired() ? { scale: 1.02 } : {}}
                  whileTap={canProceedRequired() ? { scale: 0.98 } : {}}
                  className={`mt-8 w-full btn-futuristic flex items-center justify-center gap-2 font-orbitron text-sm tracking-wider
                    ${!canProceedRequired() ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {currentStep === requiredSteps.length - 1 ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Continue
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default InputPage;
