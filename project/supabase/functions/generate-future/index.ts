import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UserInput {
  name: string;
  age: number;
  dreamCareer: string;
  dailyHabits: string;
  biggestGoal: string;
  lifestyle: string;
  personalityType: string;
  dreamLocation: string;
  energyTime: string;
  lifestyleAesthetic: string;
  careerType: string;
  favoriteHobby: string;
  motivation: string;
  workspaceStyle: string;
  optionalCompleted: boolean;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted(options: { value: string; weight: number }[]): string {
  const total = options.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) {
    r -= o.weight;
    if (r <= 0) return o.value;
  }
  return options[0].value;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function analyzeHabits(habits: string) {
  const h = habits.toLowerCase();
  const discipline = (h.match(/read|study|code|practice|exercise|workout|gym|medit|journal|writ|learn/g) || []).length;
  const wellness = (h.match(/medit|yoga|exercise|walk|run|sleep|eat|health|gym|workout/g) || []).length;
  const creativity = (h.match(/draw|paint|writ|design|music|creat|cook|photograph|film/g) || []).length;
  const social = (h.match(/social|friend|family|meet|talk|volunteer|network|chat/g) || []).length;
  return {
    discipline: Math.min(discipline, 5),
    wellness: Math.min(wellness, 5),
    creativity: Math.min(creativity, 5),
    social: Math.min(social, 5),
  };
}

function inferCareerTier(career: string): { tier: string; field: string } {
  const c = career.toLowerCase();
  if (c.match(/ceo|founder|entrepreneur|startup|business/i)) return { tier: "entrepreneur", field: "business" };
  if (c.match(/doctor|surgeon|nurse|medical|physician/i)) return { tier: "medical", field: "healthcare" };
  if (c.match(/engineer|developer|programmer|software|tech|ai|data|machine/i)) return { tier: "tech", field: "technology" };
  if (c.match(/artist|musician|writer|author|actor|film|design|creative/i)) return { tier: "creative", field: "creative arts" };
  if (c.match(/teacher|professor|educator|research|scientist/i)) return { tier: "academic", field: "education" };
  if (c.match(/lawyer|judge|attorney|legal/i)) return { tier: "legal", field: "law" };
  if (c.match(/pilot|astronaut|space|astro/i)) return { tier: "aerospace", field: "aerospace" };
  if (c.match(/chef|cook|baker|restaur/i)) return { tier: "culinary", field: "culinary arts" };
  if (c.match(/athlete|sport|player|coach/i)) return { tier: "sports", field: "sports" };
  if (c.match(/architect|urban|city|plann/i)) return { tier: "design", field: "architecture" };
  return { tier: "professional", field: "industry" };
}

function getTrajectory(habits: ReturnType<typeof analyzeHabits>) {
  const totalDrive = habits.discipline + habits.wellness + habits.creativity + habits.social;
  if (totalDrive >= 6 && habits.discipline >= 2) {
    return pickWeighted([{ value: "breakthrough", weight: 50 }, { value: "steady", weight: 30 }, { value: "pivot", weight: 20 }]);
  } else if (totalDrive >= 3) {
    return pickWeighted([{ value: "steady", weight: 40 }, { value: "pivot", weight: 35 }, { value: "grind", weight: 25 }]);
  }
  return pickWeighted([{ value: "grind", weight: 40 }, { value: "pivot", weight: 35 }, { value: "steady", weight: 25 }]);
}

// --- PERSONALITY EVOLUTION ---
function generatePersonalityEvolution(input: UserInput, trajectory: string): string {
  const { name, age, personalityType, motivation, energyTime } = input;
  const personality = personalityType || "ambivert";

  const evolutions: Record<string, Record<string, string[]>> = {
    introvert: {
      breakthrough: [
        `${name} started as a quiet observer at ${age}, processing the world internally before speaking. Over fifteen years, that quiet became a weapon — the ability to listen when others couldn't, to see patterns others missed. ${name} didn't become loud; they became undeniable. The introversion evolved into strategic silence — choosing words that land like hammers rather than filling air with noise. In meetings, when ${name} finally speaks, everyone listens.`,
        `The introvert at ${age} who preferred books to parties grew into someone who can command a room without raising their voice. ${name}'s ${motivation || 'inner drive'}-fueled focus created depth that small talk never could. The transformation wasn't becoming an extrovert — it was becoming an introvert with intent. The ${energyTime === 'night' ? 'late-night' : energyTime === 'morning' ? 'early-morning' : ''} thinking sessions became legendary strategy sessions.`,
      ],
      steady: [
        `${name}'s introversion didn't change — it matured. At ${age}, it felt like a limitation. By ${age + 15}, it's a superpower. The ability to go deep, to sustain focus for hours, to recharge through solitude rather than noise — that's what built the career. Social situations still drain energy, but ${name} now chooses them deliberately rather than avoiding them entirely.`,
        `Quiet consistency defined the evolution. ${name} stayed true to the introverted core but expanded the comfort zone strategically. The ${motivation || 'purpose'}-driven life meant social energy was spent on relationships that matter, not ones that drain. The result: a small but extraordinary circle of people who truly know ${name}.`,
      ],
      pivot: [
        `${name} was the introvert who surprised everyone — including themselves. The pivot required stepping into discomfort, and the introversion evolved into what psychologists call "situational extroversion": fully capable of turning it on when the moment demands it, then retreating to recharge. It's not faking — it's choosing. The ${energyTime === 'night' ? 'midnight' : energyTime === 'morning' ? 'dawn' : ''} reflections became the fuel for bold daytime decisions.`,
      ],
      grind: [
        `The introverted path was harder — fewer networking shortcuts, less visibility in a loud world. But ${name} turned that constraint into depth. While others were performing, ${name} was building. The personality evolved from shy to selectively social — not everyone gets access, and that's the point. The inner world grew richer with every ${motivation || 'challenge'} faced alone.`,
      ],
    },
    extrovert: {
      breakthrough: [
        `${name}'s extroversion at ${age} was raw energy — social, magnetic, sometimes scattered. Over fifteen years, it became directed force. The parties narrowed to curated gatherings. The many friendships deepened to meaningful alliances. ${name} learned that connection isn't about quantity — it's about showing up when it matters. The ${motivation || 'ambition'} channeled the social battery into influence.`,
        `The loud, charismatic ${age}-year-old evolved into someone who still lights up rooms — but now does it with purpose. ${name}'s ${energyTime === 'morning' ? 'morning energy' : energyTime === 'night' ? 'evening charisma' : 'natural magnetism'} became a leadership tool, not just a personality trait. The transformation: from being heard to being followed.`,
      ],
      steady: [
        `${name}'s social nature remained the core, but it found its right size. The endless socializing of the ${age}s gave way to intentional connection — fewer events, deeper conversations. The extroversion evolved from breadth to depth. The ${motivation || 'drive'} to connect shifted from "everyone" to "the right ones."`,
      ],
      pivot: {
        _unused: true,
      },
      grind: [
        `Being extroverted didn't make the grind easier — it made it lonelier. ${name} was surrounded by people but struggling to connect the social energy to real progress. Over time, the extroversion sharpened into networking with intent rather than socializing for comfort. The ${motivation || 'fire'} inside learned to burn selectively.`,
      ],
    } as any,
    ambivert: {
      breakthrough: [
        `${name} always had the best of both worlds — social when needed, solitary when necessary. At ${age}, that flexibility felt like indecision. By ${age + 15}, it looks like adaptability. ${name} reads rooms, shifts energy, and chooses the right mode for the moment. The ${motivation || 'vision'} gave the ambiversion a direction it was missing.`,
        `The ambivert's journey was about finding the dial, not choosing a side. ${name} learned when to step forward and when to observe. The ${energyTime === 'morning' ? 'morning discipline' : energyTime === 'night' ? 'night creativity' : 'rhythmic balance'} became the signature — equally comfortable leading a meeting or disappearing into deep work.`,
      ],
      steady: [
        `Ambiversion served ${name} well — not flashy in either direction, but adaptable in all of them. The ${age}-year-old who wasn't sure which team they belonged to became the person who bridges both worlds naturally. The evolution was subtle: from "I can do both" to "I know when each is right."`,
      ],
      pivot: [
        `The ambivert's flexibility made the pivot possible. ${name} could read the signs earlier than pure introverts or extroverts — feeling the misalignment before it became a crisis. The personality evolved from flexible to fluid, adapting to new environments with a social intelligence that pure types can't match.`,
      ],
      grind: [
        `${name}'s ambiversion meant understanding both sides of the struggle — the lonely nights and the performative days. The ${motivation || 'determination'} grew from knowing when to seek help and when to handle it alone. The personality evolved into resilient adaptability: the world changes, ${name} adjusts, and progress continues.`,
      ],
    },
  };

  const personalityEvolutions = evolutions[personality] || evolutions.ambivert;
  const trajectoryEvolutions = personalityEvolutions[trajectory] || personalityEvolutions.steady || personalityEvolutions.breakthrough;
  return pick(Array.isArray(trajectoryEvolutions) ? trajectoryEvolutions : [trajectoryEvolutions]);
}

// --- WORKSPACE VIBE ---
function generateWorkspaceVibe(input: UserInput): string {
  const { workspaceStyle, lifestyleAesthetic, dreamLocation, energyTime } = input;
  const ws = workspaceStyle || 'home_office';
  const aesthetic = lifestyleAesthetic || 'minimal';
  const location = dreamLocation || '';
  const energy = energyTime || 'both';

  const workspaceMap: Record<string, string> = {
    home_office: `${energy === 'morning' ? 'Sunlight streams through east-facing windows' : energy === 'night' ? 'Soft warm lighting glows against dark walls' : 'Adaptive lighting shifts with the day'} in a thoughtfully designed home office. Every surface is intentional — no clutter, just tools and artifacts of ${aesthetic === 'minimal' ? 'radical simplicity' : aesthetic === 'cozy' ? 'warm productivity' : aesthetic === 'futuristic' ? 'streamlined efficiency' : aesthetic === 'nature' ? 'organic creativity' : aesthetic === 'luxury' ? 'curated excellence' : 'personal expression'}. ${location ? `The view of ${location}'s skyline reminds you why you started.` : 'The quiet hum of purpose fills every corner.'}`,
    coffee_shop: `A reserved corner table at a ${aesthetic === 'cozy' ? 'warm, book-filled cafe with exposed brick' : aesthetic === 'minimal' ? 'sleek third-wave coffee bar with clean lines' : aesthetic === 'futuristic' ? 'tech-forward co-working cafe with ambient screens' : aesthetic === 'nature' ? 'garden-side cafe with climbing plants and natural light' : 'carefully chosen neighborhood spot'}. The ambient noise is the perfect backdrop — ${energy === 'morning' ? 'the morning espresso rush' : energy === 'night' ? 'the evening wind-down crowd' : 'the rhythm of the day shifting around you'} creates a sense of moving with the world, not against it.`,
    open_studio: `An open creative studio with ${aesthetic === 'futuristic' ? 'floating shelves, matte surfaces, and hidden LED accents' : aesthetic === 'minimal' ? 'vast white walls, a single desk, and silence' : aesthetic === 'nature' ? 'raw wood, living walls, and natural stone' : aesthetic === 'luxury' ? 'polished concrete, designer furniture, and curated art' : aesthetic === 'cozy' ? 'warm wood tones, soft textures, and personal artifacts' : 'walls covered in ideas, sketches, and inspiration'}. ${energy === 'night' ? 'The space transforms at night — warm pools of light create focus zones.' : energy === 'morning' ? 'Morning light floods through industrial windows, shifting throughout the day.' : 'The space breathes with the day — bright for creation, dimmed for reflection.'}`,
    high_rise: `A corner office high above the city${location ? ` — specifically in ${location}` : ''}, where ${aesthetic === 'luxury' ? 'floor-to-ceiling glass frames the skyline like a living painting' : aesthetic === 'minimal' ? 'clean lines and panoramic views create clarity of thought' : aesthetic === 'futuristic' ? 'smart glass tints on command and ambient displays stream real-time data' : 'the elevation matches the ambition'}. ${energy === 'morning' ? 'The sunrise arrives before anyone else — prime thinking hours above the clouds.' : 'The city lights become a second screen — a constellation of possibility.'}`,
    nature_desk: `An outdoor-adjacent workspace where ${aesthetic === 'nature' ? 'the boundary between indoors and nature barely exists — sliding walls open to a garden, birds provide the soundtrack' : aesthetic === 'cozy' ? 'a sheltered wooden deck with blankets, warm drinks, and the sound of rain on leaves' : aesthetic === 'minimal' ? 'a single desk under a tree, nothing between you and the sky' : 'nature is always within arm\'s reach'}. ${energy === 'morning' ? 'Dawn chorus marks the start of deep work.' : energy === 'night' ? 'Stargazing between focus blocks keeps perspective sharp.' : 'The rhythm of daylight and weather structures the day naturally.'}`,
    lab: `A lab-bench style workspace — ${aesthetic === 'futuristic' ? 'monitors everywhere, hardware prototypes on every surface, the hum of machines thinking alongside you' : aesthetic === 'minimal' ? 'organized with surgical precision, every tool in its place, every variable controlled' : aesthetic === 'luxury' ? 'a beautifully appointed research space where function meets design' : 'organized chaos where every surface holds a different experiment'}. ${energy === 'night' ? 'Late nights feel natural here — the quiet amplifies concentration.' : energy === 'morning' ? 'The ritual of setup is itself a meditation — calibrating, testing, beginning.' : 'The space runs 24/7, and so does the thinking.'}`,
  };

  return workspaceMap[ws] || workspaceMap.home_office;
}

// --- SUCCESS METER ---
function generateSuccessMeter(trajectory: string, optionalCompleted: boolean): number {
  const base: Record<string, number> = {
    breakthrough: 82,
    steady: 70,
    pivot: 68,
    grind: 58,
  };
  const score = base[trajectory] || 70;
  const bonus = optionalCompleted ? 8 : 0;
  const variance = Math.floor(Math.random() * 10) - 5;
  return Math.max(40, Math.min(98, score + bonus + variance));
}

// --- AI SCORE ---
function generateAiScore(trajectory: string, optionalCompleted: boolean, habits: ReturnType<typeof analyzeHabits>): number {
  const base: Record<string, number> = {
    breakthrough: 88,
    steady: 76,
    pivot: 73,
    grind: 62,
  };
  const score = base[trajectory] || 76;
  const habitBonus = (habits.discipline + habits.wellness) * 2;
  const optionalBonus = optionalCompleted ? 6 : 0;
  const variance = Math.floor(Math.random() * 8) - 4;
  return Math.max(45, Math.min(97, score + habitBonus + optionalBonus + variance));
}

// --- HIDDEN TALENT ---
function generateHiddenTalent(input: UserInput, trajectory: string): string {
  const { personalityType, favoriteHobby, motivation, lifestyleAesthetic, careerType } = input;
  const personality = personalityType || "ambivert";
  const hobby = favoriteHobby || "reading";
  const motiv = motivation || "freedom";
  const aesthetic = lifestyleAesthetic || "minimal";
  const cType = careerType || "builder";

  const talents: Record<string, string[]> = {
    introvert: [
      `Strategic pattern recognition — ${name_ref()} sees the move three steps ahead that others miss. This talent surfaces in negotiations, planning, and any situation where silence is information.`,
      `Deep analytical synthesis — ${name_ref()} can absorb massive amounts of information and distill it into a single actionable insight. It looks like instinct, but it's actually compressed thinking.`,
      `Emotional precision — ${name_ref()} reads people with startling accuracy, not from observation alone but from understanding what isn't said. This makes ${name_ref()} devastating in one-on-one situations.`,
    ],
    extrovert: [
      `Charismatic persuasion — ${name_ref()} can shift a room's energy in minutes. This isn't just social skill; it's the ability to make others see possibilities they couldn't see alone.`,
      `Rapid trust-building — ${name_ref()} creates genuine connection faster than almost anyone. In a world of superficial networking, this talent opens doors that credentials can't.`,
      `Improvisational leadership — ${name_ref()} thrives in chaos. When plans fail, ${name_ref()} doesn't freeze — ${name_ref()} adapts visibly, and that composure inspires everyone around them.`,
    ],
    ambivert: [
      `Situational fluency — ${name_ref()} reads the energy of a room and becomes exactly what the moment needs. This chameleon-like adaptability is rare and powerful.`,
      `Bridge-building — ${name_ref()} connects people who would never find each other. This talent creates networks that are more than the sum of their parts.`,
      `Dual-mode creativity — ${name_ref()} can brainstorm with a group, then refine alone. Most people are strong in one mode; ${name_ref()} is dangerous in both.`,
    ],
  };

  function name_ref(): string {
    return "They";
  }

  const personalityTalents = talents[personality] || talents.ambivert;
  return pick(personalityTalents);
}

// --- GLOW-UP EVOLUTION ---
function generateGlowUp(input: UserInput, trajectory: string): string {
  const { name, age, lifestyleAesthetic, motivation, lifestyle } = input;
  const aesthetic = lifestyleAesthetic || 'minimal';

  const glowUps: Record<string, string[]> = {
    breakthrough: [
      `Age ${age}: Raw potential, unkempt focus, all energy no direction. Age ${age + 5}: Found the style — confidence arrived before the success did. Age ${age + 10}: The ${aesthetic} aesthetic became signature, not costume. Age ${age + 15}: The glow-up isn't about appearance anymore — it's presence. When ${name} enters a room, the energy shifts. That's the real transformation.`,
      `${name}'s glow-up happened in chapters. The ${age}s were experiments — trying on identities, learning what fits. By ${age + 7}, the look matched the ambition: ${aesthetic} but sharp. By ${age + 15}, style and substance merged. The ${lifestyle || 'curated'} lifestyle isn't aspirational anymore — it's just Tuesday.`,
    ],
    steady: [
      `The glow-up was gradual and genuine. At ${age}, ${name} looked like someone trying to figure things out. By ${age + 8}, they looked like someone who had. The ${aesthetic} style emerged naturally — not a statement, just a reflection of clarity. At ${age + 15}, the most striking thing about ${name}'s appearance is comfort. They look like they belong in their own skin.`,
    ],
    pivot: [
      `The biggest visual shift came with the pivot. At ${age}, ${name} dressed for the career they thought they wanted. By ${age + 5}, the wardrobe changed to match the new direction — more authentic, less performative. The ${aesthetic} aesthetic became armor for the reinvention. At ${age + 15}, ${name} looks like someone who chose themselves — and it shows.`,
    ],
    grind: [
      `The glow-up was earned late but worn well. At ${age}, survival didn't leave room for style. By ${age + 8}, stability created space for self-expression. The ${aesthetic} look emerged carefully — ${name} wasn't about to waste hard-earned resources on anything inauthentic. At ${age + 15}, the transformation is real: ${name} carries themselves like someone who knows exactly what they're worth.`,
    ],
  };

  return pick(glowUps[trajectory] || glowUps.steady);
}

// --- FUTURE QUOTE ---
function generateFutureQuote(input: UserInput, trajectory: string): string {
  const { name, motivation } = input;
  const motiv = motivation || 'freedom';

  const quotes: Record<string, string[]> = {
    breakthrough: [
      `"The world doesn't reward potential. It rewards proof. So I stopped promising and started proving." — ${name}, ${new Date().getFullYear() + 12}`,
      `"Everyone wants the result. Very few want the process. I learned to love the process, and the result stopped being a question." — ${name}`,
    ],
    steady: [
      `"I never had a dramatic moment. Just a thousand small decisions that pointed the same direction. Turns out, that's enough." — ${name}`,
      `"Consistency is the most boring superpower. It's also the most reliable one." — ${name}`,
    ],
    pivot: [
      `"The original plan wasn't wrong. It just wasn't mine. The day I admitted that was the day everything started working." — ${name}`,
      `"I didn't fail at Plan A. I discovered Plan B was who I was all along." — ${name}`,
    ],
    grind: [
      `"I'm not self-made. I'm self-tested. Every setback was a question, and I kept answering with effort." — ${name}`,
      `"The gap between where I was and where I wanted to be? I filled it with stubbornness and ${motiv}." — ${name}`,
    ],
  };

  return pick(quotes[trajectory] || quotes.steady);
}

// --- MAIN STORY (from previous generation, enhanced) ---
function generateFutureStory(input: UserInput, trajectory: string): string {
  const { name, age, dreamCareer, dailyHabits, biggestGoal, skillsToLearn, lifestyle } = input;
  const careerInfo = inferCareerTier(dreamCareer);
  const futureAge = age + 15;
  const habitsLower = dailyHabits.toLowerCase();
  const goalLower = biggestGoal.toLowerCase();
  const skillsLower = skillsToLearn || 'specialized';
  const lifestyleLower = lifestyle.toLowerCase();
  const careerLower = dreamCareer.toLowerCase();

  const storyIntros: Record<string, string[]> = {
    breakthrough: [
      `${name} didn't just enter the ${careerInfo.field} world — they reshaped it. By ${futureAge}, the path that started with quiet ${habitsLower} each morning had become something the whole industry noticed.`,
      `Nobody predicted the impact ${name} would have. Not even ${name} themselves. But looking back, those early years of relentless ${habitsLower} were the detonator for everything that followed.`,
    ],
    steady: [
      `${name} built something rare: a career that moves forward without burning out. By ${futureAge}, those daily habits of ${habitsLower} had compounded into quiet excellence — the kind that doesn't make headlines but changes lives.`,
      `Consistency is the most underrated superpower, and ${name} proved it. The ${careerInfo.field} world recognized what ${name} had quietly built through years of ${habitsLower}.`,
    ],
    pivot: [
      `${name} started toward ${dreamCareer}, but life had other plans. By ${futureAge}, a pivotal moment redirected everything — and that detour became the real destination.`,
      `The original plan was to become a ${dreamCareer}. Then reality intervened — and ${name} discovered that the best careers aren't planned, they're adapted.`,
    ],
    grind: [
      `${name} earned every inch. Nothing was handed over, and the road was paved with setbacks, doubt, and more early mornings than anyone should count. But ${name} kept going.`,
      `The path was never easy for ${name}. There were years where progress felt invisible. But those ${habitsLower} sessions when nobody was watching? They were laying bricks for a future no one else could see yet.`,
    ],
  };

  const storyMiddles: Record<string, string[]> = {
    breakthrough: [
      `The breakthrough came in year five. ${capitalize(goalLower)} wasn't just achieved — it became the launchpad. ${capitalize(skillsLower)} expertise was leveraged in ways nobody anticipated, turning what could have been a modest career into something transformative. There were moments of doubt — a project that failed spectacularly in year seven, a partnership that collapsed — but each one taught something that success never could.`,
      `What set ${name} apart wasn't talent alone — it was timing and tenacity. While others waited for permission, ${name} started building. The ${skillsLower} expertise became the differentiator, and by year eight, ${name} wasn't just in the room — they were defining the agenda.`,
    ],
    steady: [
      `Year by year, ${name} got better. Not dramatically — just consistently. The ${skillsLower} skills deepened. The reputation grew through word of mouth rather than self-promotion. ${capitalize(goalLower)} happened quietly around year six, and it felt less like a summit and more like a natural destination.`,
      `There were hard seasons — a period where imposter syndrome nearly derailed everything. But ${name}'s ${habitsLower} routine was the anchor. When the world got chaotic, the daily structure held.`,
    ],
    pivot: [
      `The pivot happened around year three. ${name} realized the ${dreamCareer} path wasn't broken — it was just the wrong shape for who they were becoming. ${capitalize(skillsLower)} opened an unexpected door, and ${name} walked through it with nothing but conviction. By year seven, the new direction had eclipsed every projection the old one ever had.`,
      `Sometimes the goal evolves. ${capitalize(goalLower)} shifted from a destination into a compass — it pointed the way, but the actual path wound through territories ${name} never expected.`,
    ],
    grind: [
      `Years three through six were brutal. ${name} almost quit twice. The ${skillsLower} skills were developing, but opportunities weren't matching the effort. Then a small win in year seven — barely noticeable to outsiders — shifted everything.`,
      `The ${lifestyleLower} lifestyle wasn't a given — it was earned through years of choices that most people wouldn't make. ${name} invested in ${skillsLower} when it felt pointless, and slowly, methodically, carved out a space in ${careerInfo.field} that no one could take away.`,
    ],
  };

  const storyEndings: Record<string, string[]> = {
    breakthrough: [
      `Now at ${futureAge}, ${name} leads with a rare combination of authority and empathy. The ${lifestyleLower} lifestyle is real — not a flex, but a reflection of values. The thing ${name} is most proud of? Not the title. It's that the person they've become is someone their younger self would actually trust.`,
    ],
    steady: [
      `At ${futureAge}, ${name} has what most people chase but rarely catch: a career with purpose and a life with balance. The ${lifestyleLower} lifestyle fits like it was always meant to.`,
    ],
    pivot: [
      `${name} at ${futureAge} lives the ${lifestyleLower} life — but not through the door they originally planned. The pivot taught something invaluable: plans are maps, not destinations.`,
    ],
    grind: [
      `${name} at ${futureAge} carries the quiet confidence of someone who earned every step. The ${lifestyleLower} lifestyle exists now — modest, real, and deeply appreciated because ${name} knows exactly what it cost.`,
    ],
  };

  return `${pick(storyIntros[trajectory])}\n\n${pick(storyMiddles[trajectory])}\n\n${pick(storyEndings[trajectory])}`;
}

// --- TITLE ---
function generateTitle(input: UserInput, trajectory: string): string {
  const careerInfo = inferCareerTier(input.dreamCareer);
  const titleMap: Record<string, string[]> = {
    entrepreneur: [`Founder & CEO`, `Co-Founder`, `Managing Partner`],
    tech: [`Lead Engineer`, `Principal Architect`, `Staff Engineer`, `VP of Engineering`],
    medical: [`Head of Department`, `Senior Consultant`],
    creative: [`Creative Director`, `Head of Studio`],
    academic: [`Distinguished Professor`, `Lead Researcher`],
    legal: [`Senior Partner`, `Lead Counsel`],
    aerospace: [`Mission Commander`, `Senior Flight Director`],
    culinary: [`Head Chef & Owner`, `Executive Chef`],
    sports: [`Head Coach`, `Director of Performance`],
    design: [`Principal Architect`, `Design Director`],
    professional: [`Senior Director`, `VP of Operations`, `Chief Strategist`],
  };
  const titles = titleMap[careerInfo.tier] || titleMap.professional;
  return pick(titles);
}

// --- INCOME ---
function generateIncome(trajectory: string, dreamCareer: string): string {
  const incomeMap: Record<string, { range: string; description: string }[]> = {
    breakthrough: [
      { range: "$180K–$320K", description: "Top percentile for the field. Income reflects unique expertise, not just time served." },
      { range: "$220K–$450K", description: "Well above industry average. Multiple income streams from ventures and advisory roles." },
    ],
    steady: [
      { range: "$95K–$140K", description: "Solidly above median. Consistent growth year over year." },
      { range: "$110K–$175K", description: "Upper quartile in the field. Income reflects deep expertise and reliable reputation." },
    ],
    pivot: [
      { range: "$105K–$190K", description: "Income rebounded after pivot. The new direction pays better than the original plan." },
      { range: "$85K–$150K", description: "Still building in the new field. Income reflects a mid-career restart." },
    ],
    grind: [
      { range: "$65K–$95K", description: "Hard-earned and steadily growing. Every dollar reflects effort, not leverage." },
      { range: "$78K–$120K", description: "Finally gaining momentum. The compound effect of persistence is starting to show." },
    ],
  };
  const option = pick(incomeMap[trajectory] || incomeMap.steady);
  return `Annual Range: ${option.range}\nStatus: ${trajectory === "breakthrough" ? "Industry Leader" : trajectory === "steady" ? "Senior Professional" : trajectory === "pivot" ? "Established in New Path" : "Rising Professional"}\nGrowth Trend: ${trajectory === "breakthrough" ? "Accelerating" : trajectory === "steady" ? "Consistent upward" : trajectory === "pivot" ? "Steep post-pivot climb" : "Gradual but real"}\nNote: ${option.description}`;
}

// --- DAILY ROUTINE ---
function generateRoutine(input: UserInput, trajectory: string): string {
  const { name, age, dreamCareer, dailyHabits, skillsToLearn, lifestyle, energyTime } = input;
  const skillsLower = skillsToLearn || 'specialized skills';
  const lifestyleLower = lifestyle.toLowerCase();
  const isMorning = energyTime === 'morning';
  const isNight = energyTime === 'night';

  const startHour = isMorning ? '5:30' : isNight ? '7:30' : '6:30';
  const startDesc = isMorning
    ? `Wake before the world. The silence is the strategy — ${name}'s best thinking happens before anyone else is awake`
    : isNight
    ? `Wake naturally, no alarm. The night-before preparation means the morning starts with clarity, not scrambling`
    : `Wake to a deliberate routine. The habits from age ${age} have become automatic — no willpower needed`;

  const routineMiddles: Record<string, string> = {
    breakthrough: `8:00 AM — Lead strategic sessions: ${name} guides the vision now, not just contributes to it\n10:00 AM — Deep work block: the ${skillsLower.split(',')[0]?.trim() || 'specialized'} work that only ${name} can do\n12:30 PM — Mentoring the next generation: investing in others is non-negotiable\n2:00 PM — Creative exploration and ${skillsLower.split(',')[1]?.trim() || 'new skill development'}`,
    steady: `8:00 AM — Focused project work: ${skillsLower.split(',')[0]?.trim() || 'core expertise'} with the depth only consistency produces\n10:00 AM — Team collaboration: ${name} leads by example, not by decree\n12:30 PM — Lunch and a walk — the ${lifestyleLower} life needs oxygen\n2:00 PM — Deep craft work: the skills that built the reputation`,
    pivot: `8:00 AM — Learning block: still absorbing the new field's nuances with beginner's mind\n10:00 AM — Apply old expertise in new context: ${skillsLower} translates in unexpected ways\n12:30 PM — Connect with the new network: relationships are the accelerator\n2:00 PM — Build and experiment: the pivot means permission to try things`,
    grind: `8:00 AM — Core work: the ${skillsLower.split(',')[0]?.trim() || 'foundational'} skills that pay the bills and build the future\n10:00 AM — Push forward on the main project: slow progress is still progress\n12:30 PM — Quick refuel and reset\n2:00 PM — Skill development: every hour invested in ${skillsLower} is a deposit on tomorrow`,
  };

  const endHour = isNight ? '10:00' : '6:30';
  const endDesc = isNight
    ? `Night deep work: ${name}'s most productive hours begin when others shut down. The ${lifestyleLower} life means working with natural energy, not against it`
    : `Wind down: exercise or ${lifestyleLower} activity. The ${lifestyleLower} life requires boundaries, and ${name} keeps them`;

  return `${startHour} AM — ${startDesc}\n${routineMiddles[trajectory]}\n${endHour} PM — ${endDesc}`;
}

// --- ADVICE ---
function generateAdvice(input: UserInput, trajectory: string): string {
  const { name, age, dreamCareer, dailyHabits, biggestGoal, skillsToLearn, lifestyle, motivation } = input;
  const habitsLower = dailyHabits.toLowerCase();
  const goalLower = biggestGoal.toLowerCase();
  const careerLower = dreamCareer.toLowerCase();
  const skillsLower = skillsToLearn || 'key skills';
  const lifestyleLower = lifestyle.toLowerCase();
  const motiv = motivation || 'purpose';

  const adviceMap: Record<string, { opening: string; core: string; closing: string }[]> = {
    breakthrough: [
      {
        opening: `Dear ${name}, I remember exactly where you're sitting right now. Age ${age}, full of ambition but not sure if it's enough.`,
        core: `Those ${habitsLower} sessions aren't just habits — they're identity construction. Every time you choose discipline over comfort, you're voting for the person I've become. Your dream of ${careerLower}? It's going to happen, but not the way you think. The path bends. Let it.\n\nThe biggest lie people tell you is that success looks like a straight shot up. It doesn't. Year five almost broke me. Year seven made me question everything. But year nine? That's when it all made sense. The ${skillsLower} skills will matter more than you can imagine — but not for the reasons you think.`,
        closing: `Don't wait for permission. The ${lifestyleLower} life you want is built in the decisions you make today. I'm proof. — Future ${name}`,
      },
    ],
    steady: [
      {
        opening: `Dear ${name}, I know you sometimes wonder if you're doing enough. At ${age}, it feels like everyone else is moving faster.`,
        core: `They're not. They're just louder. Your ${habitsLower} routine? That's the real thing. Most people can't sustain what you do daily. The ${careerLower} career will come together through patience, not shortcuts.\n\n${capitalize(goalLower)} happened, and it didn't feel dramatic. It felt inevitable. The ${skillsLower} expertise you're building is your moat — protect it, deepen it, trust it. The ${lifestyleLower} life isn't boring. It's peaceful. And peace is worth more than adrenaline.`,
        closing: `You don't need to be the loudest in the room. You need to be the most consistent. — Future ${name}`,
      },
    ],
    pivot: [
      {
        opening: `Dear ${name}, I know the plan feels uncertain right now. At ${age}, you think you need to have it all figured out.`,
        core: `You don't. The plan is going to change — and that's the best thing that could happen. Your ${habitsLower} discipline won't go to waste; it'll become the foundation for something you haven't imagined yet. When the pivot comes, don't fight it. Your ${skillsLower} skills translate everywhere. Your ${motiv}-driven values will guide you.\n\nI wasted six months resisting the redirect. Don't make my mistake.`,
        closing: `The best career isn't planned — it's discovered. Stay open, stay honest, and the path will find you. — Future ${name}`,
      },
    ],
    grind: [
      {
        opening: `Dear ${name}, I know it feels like you're not moving fast enough. At ${age}, the gap between where you are and where you want to be feels massive.`,
        core: `It is massive. I won't lie about that. But here's what no one tells you: the gap closes. Slowly, then all at once. Those ${habitsLower} sessions when nobody's watching? They're building something.\n\nThe ${skillsLower} skills will click — not overnight, but over hundreds of imperfect attempts. ${capitalize(goalLower)} will happen, but it'll look different than the poster in your head. More real. More yours.`,
        closing: `You're closer than you think. The only way to fail is to stop. And we both know you're not going to stop. — Future ${name}`,
      },
    ],
  };

  const option = pick(adviceMap[trajectory] || adviceMap.steady);
  return `${option.opening}\n\n${option.core}\n\n${option.closing}`;
}

// --- ACHIEVEMENTS ---
function generateAchievements(input: UserInput, trajectory: string): { year: number; event: string }[] {
  const { dreamCareer, dailyHabits, biggestGoal, skillsToLearn, lifestyle } = input;
  const careerInfo = inferCareerTier(dreamCareer);
  const skillsLower = skillsToLearn || 'key skills';
  const goalLower = biggestGoal.toLowerCase();
  const habitsLower = dailyHabits.toLowerCase();
  const lifestyleLower = lifestyle.toLowerCase();
  const currentYear = new Date().getFullYear();

  const y2: Record<string, string[]> = {
    breakthrough: [`First recognition in the ${careerInfo.field} community — small, but it validated everything`, `Landed the role that changed the trajectory`],
    steady: [`Promoted based on consistent output, not office politics`, `Completed a milestone project that proved the expertise was real`],
    pivot: [`Started questioning the original plan — the discomfort was a signal`, `Began exploring ${skillsLower.split(',')[0]?.trim() || 'new directions'} seriously`],
    grind: [`Survived the hardest year yet — didn't quit, didn't break`, `Built foundational ${skillsLower.split(',')[0]?.trim() || 'core'} skills during the toughest stretch`],
  };

  const y4: Record<string, string[]> = {
    breakthrough: [`First major project with real impact — people started knowing the name`, `The ${skillsLower.split(',')[0]?.trim() || 'specialized'} expertise hit a tipping point`],
    steady: [`Quietly became the go-to person in the organization`, `Achieved financial stability — the freedom to make choices`],
    pivot: [`Made the pivot — left the original path for something that fit better`, `First win in the new direction: proof the detour was right`],
    grind: [`First real upward move — the trend line finally bent upward`, `The skill investment started showing tangible returns`],
  };

  const y6: Record<string, string[]> = {
    breakthrough: [`Achieved ${goalLower} — and realized it was the beginning, not the destination`],
    steady: [`${capitalize(goalLower)} — achieved quietly, with deep satisfaction`],
    pivot: [`The new career path eclipsed projections from the original plan`],
    grind: [`Reached a solid position — firmly off the bottom`],
  };

  const y8: Record<string, string[]> = {
    breakthrough: [`Became a recognized leader — not from a title chase, but from the work demanding it`, `A major failure that year taught more than every success combined`],
    steady: [`Became the person others come to for guidance`, `Deepened the ${lifestyleLower} lifestyle into something sustainable`],
    pivot: [`Established as a leader in the pivoted field — reinvention complete`],
    grind: [`Hit a stride — a reliable, respected position`],
  };

  const y10: Record<string, string[]> = {
    breakthrough: [`Recognized across the industry as a thought leader`, `Built something that outlasts any single role`],
    steady: [`The compound interest of showing up every day became undeniable`],
    pivot: [`The pivot is now the foundation — the old plan feels like someone else's idea`],
    grind: [`The decade of effort created something unshakable: genuine expertise and real respect`],
  };

  const y12: Record<string, string[]> = {
    breakthrough: [`Shaping the next generation of the ${careerInfo.field} industry`],
    steady: [`Reached mastery through patience, not talent`],
    pivot: [`The pivoted career is now the one others envy`],
    grind: [`The grind became a groove — effort now produces consistent results`],
  };

  const y15: Record<string, string[]> = {
    breakthrough: [`At ${input.age + 15}, leads with authority earned through proof — and still learns like a beginner`],
    steady: [`At ${input.age + 15}, has something rare: a career and a life that both feel right`],
    pivot: [`At ${input.age + 15}, proof that the best journeys aren't linear — they're honest`],
    grind: [`At ${input.age + 15}, standing on ground they built themselves — and it's solid`],
  };

  return [
    { year: currentYear + 2, event: pick(y2[trajectory]) },
    { year: currentYear + 4, event: pick(y4[trajectory]) },
    { year: currentYear + 6, event: pick(y6[trajectory]) },
    { year: currentYear + 8, event: pick(y8[trajectory]) },
    { year: currentYear + 10, event: pick(y10[trajectory]) },
    { year: currentYear + 12, event: pick(y12[trajectory]) },
    { year: currentYear + 15, event: pick(y15[trajectory]) },
  ];
}

// --- MAIN HANDLER ---
function generateFutureProfile(input: UserInput) {
  const habits = analyzeHabits(input.dailyHabits);
  const trajectory = getTrajectory(habits);

  return {
    futureTitle: generateTitle(input, trajectory),
    futureStory: generateFutureStory(input, trajectory),
    futureIncome: generateIncome(trajectory, input.dreamCareer),
    futureRoutine: generateRoutine(input, trajectory),
    futureAdvice: generateAdvice(input, trajectory),
    achievements: generateAchievements(input, trajectory),
    personalityEvolution: generatePersonalityEvolution(input, trajectory),
    workspaceVibe: generateWorkspaceVibe(input),
    successMeter: generateSuccessMeter(trajectory, input.optionalCompleted),
    hiddenTalent: generateHiddenTalent(input, trajectory),
    aiScore: generateAiScore(trajectory, input.optionalCompleted, habits),
    glowUp: generateGlowUp(input, trajectory),
    futureQuote: generateFutureQuote(input, trajectory),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const input: UserInput = await req.json();

    if (!input.name || !input.biggestGoal) {
      return new Response(
        JSON.stringify({ error: "Name and biggest goal are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = generateFutureProfile(input);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate future profile" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});