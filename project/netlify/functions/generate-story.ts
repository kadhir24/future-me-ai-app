import { Handler } from '@netlify/functions';

interface UserInput {
  name: string;
  age: number;
  dreamCareer: string;
  biggestGoal: string;
  lifestyle: string;
  dailyHabits: string;
  personalityType?: string;
  dreamLocation?: string;
  energyTime?: string;
  lifestyleAesthetic?: string;
  careerType?: string;
  favoriteHobby?: string;
  motivation?: string;
  workspaceStyle?: string;
}

interface GenerationResult {
  futureTitle: string;
  futureStory: string;
  futureIncome: string;
  futureRoutine: string;
  futureAdvice: string;
  achievements: { year: number; event: string }[];
  personalityEvolution: string;
  workspaceVibe: string;
  successMeter: number;
  hiddenTalent: string;
  aiScore: number;
  glowUp: string;
  futureQuote: string;
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const input: UserInput = JSON.parse(event.body || '{}');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Gemini API key not configured' }),
      };
    }

    // Build context from user inputs
    const contextParts = [];
    contextParts.push(`Name: ${input.name}`);
    contextParts.push(`Age: ${input.age}`);
    contextParts.push(`Dream Career: ${input.dreamCareer}`);
    contextParts.push(`Biggest Goal: ${input.biggestGoal}`);
    contextParts.push(`Dream Lifestyle: ${input.lifestyle}`);
    contextParts.push(`Daily Habits: ${input.dailyHabits}`);

    if (input.personalityType) contextParts.push(`Personality: ${input.personalityType}`);
    if (input.dreamLocation) contextParts.push(`Dream Location: ${input.dreamLocation}`);
    if (input.energyTime) contextParts.push(`Energy Time: ${input.energyTime}`);
    if (input.lifestyleAesthetic) contextParts.push(`Lifestyle Aesthetic: ${input.lifestyleAesthetic}`);
    if (input.careerType) contextParts.push(`Career Type: ${input.careerType}`);
    if (input.favoriteHobby) contextParts.push(`Favorite Hobby: ${input.favoriteHobby}`);
    if (input.motivation) contextParts.push(`Main Motivation: ${input.motivation}`);
    if (input.workspaceStyle) contextParts.push(`Dream Workspace: ${input.workspaceStyle}`);

    const contextStr = contextParts.join('\n');

    const systemPrompt = `You are an AI that creates inspiring, personalized future predictions. You MUST follow these STRICT rules:

CRITICAL VOCABULARY RULES - ABSOLUTELY NO BUZZWORDS:
- BAN these words completely: pivot, leverage, synergy, optimize, catalyst, disrupt, innovate, transformation, empower, scale, growth hacking, thought leader, paradigm, holistic, circle back, deep dive, stakeholder, deliverables, maximize ROI, bleeding edge, cutting-edge, next-level, best-in-class, win-win, move the needle, at the end of the day, take it offline, reach out, touch base, low-hanging fruit, drill down, take it to the next level, boil the ocean, drink the Kool-Aid
- Use SIMPLE, CONVERSATIONAL EVERYDAY ENGLISH that a teenager or grandparent would instantly understand
- Write like you're texting a friend or telling a story to someone you know
- Use casual language: "really cool", "pretty awesome", "got really into", "way better", "stuff you love"
- Be specific and vivid but always simple

CONTENT RULES:
- All text must be unique, original, and specific to the user's inputs
- Write naturally - no corporate jargon, no buzzwords, no fake corporate speak
- Make it feel real and achievable, not overdramatic
- Use contractions (I'm, you're, they're, doesn't, won't, etc.)
- Keep tone uplifting but grounded in reality
- Fix any encoding issues - no special characters like â€", just clean text

OUTPUT REQUIREMENT:
Return ONLY a valid JSON object with these exact fields:
{
  "futureTitle": "job title or role (simple, clear, no buzzwords)",
  "futureStory": "4-5 sentences describing their future life (conversational, specific)",
  "futureIncome": "1-2 sentences about likely income range (realistic, encouraging)",
  "futureRoutine": "5-7 bullet points of daily routine (specific, vivid, simple language, one per line)",
  "futureAdvice": "3-4 sentences of advice from future self to present self (warm, personal, actionable)",
  "achievements": [
    { "year": YYYY, "event": "short achievement description" },
    ... 4-5 achievements total ...
  ],
  "personalityEvolution": "2-3 sentences how their personality will grow (specific, encouraging)",
  "workspaceVibe": "2-3 sentences describing workspace (physical description, atmosphere, vibe)",
  "successMeter": number 65-95,
  "hiddenTalent": "1-2 sentences about a talent they'll discover (specific, inspiring)",
  "aiScore": number 70-95,
  "glowUp": "2-3 sentences about how they'll change physically/stylistically (specific, fun, not superficial)",
  "futureQuote": "1 powerful sentence they'd say to themselves (inspiring, personal, simple)"
}

IMPORTANT:
- All text must be in plain, simple English
- No encoding errors
- Be specific to their actual inputs
- Make it real and believable
- Celebrate their specific dream, not generic success`;

    const userPrompt = `Create a future prediction for someone with this profile:\n\n${contextStr}\n\nBuild a vivid, inspiring, realistic future 15 years ahead. Use ONLY simple, conversational everyday English. NO buzzwords. Write like you're texting a friend. Make it specific to their dreams and personality.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to generate prediction' }),
      };
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No content generated' }),
      };
    }

    // Extract JSON from response (Gemini might wrap it in markdown)
   let jsonStr = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
  jsonStr = jsonMatch[0];
}

  console.log('JSON TO PARSE:', jsonStr);
    let result: GenerationResult;

try {
  result = JSON.parse(jsonStr);
} catch (e) {
  console.error('Raw Gemini response:', content);

  return {
    statusCode: 500,
    body: JSON.stringify({
      error: 'Invalid JSON from Gemini',
      raw: content
    }),
  };
}

    // Ensure all text is clean (no encoding issues)
    const cleanText = (text: string | undefined): string => {
      if (!text) return '';
      return String(text)
        .replace(/â€œ/g, '"')
        .replace(/â€\u009d/g, '"')
        .replace(/â€"/g, '-')
        .replace(/â€™/g, "'")
        .replace(/â€˜/g, "'")
        .replace(/â€"/g, '–')
        .replace(/â€"/g, '—')
        .trim();
    };

    const cleanResult: GenerationResult = {
      futureTitle: cleanText(result.futureTitle),
      futureStory: cleanText(result.futureStory),
      futureIncome: cleanText(result.futureIncome),
      futureRoutine: cleanText(result.futureRoutine),
      futureAdvice: cleanText(result.futureAdvice),
      achievements: (result.achievements || []).map((a) => ({
        year: a.year,
        event: cleanText(a.event),
      })),
      personalityEvolution: cleanText(result.personalityEvolution),
      workspaceVibe: cleanText(result.workspaceVibe),
      successMeter: Math.min(100, Math.max(0, result.successMeter || 80)),
      hiddenTalent: cleanText(result.hiddenTalent),
      aiScore: Math.min(100, Math.max(0, result.aiScore || 85)),
      glowUp: cleanText(result.glowUp),
      futureQuote: cleanText(result.futureQuote),
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanResult),
    };
  } catch (error) {
    console.error('Error generating prediction:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate prediction',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

export { handler };
