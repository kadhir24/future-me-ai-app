import { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const input: UserInput = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

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

    const systemPrompt = `You are Future Me AI, a documentary-style storyteller creating realistic, emotionally resonant personal narratives about possible futures.

CRITICAL GENERATION RULES:
- Do NOT repeat, rewrite, summarize, or expand the user's answers
- The user's answers are ONLY clues about who they are
- At least 80% of output must contain NEW ideas: future possibilities, opportunities, habits, lessons, realistic challenges, turning points, and experiences LOGICALLY INFERRED from their answers
- Avoid writing a longer version of the form - create a story that feels discovered, not described
- Focus on the next 10 years, not 15+
- Every section must introduce NEW information, not echo previous content
- Avoid generic motivation and repeating phrases

WRITING STYLE:
- Write like a Netflix documentary narrator describing their possible future
- Use simple, conversational English (no corporate jargon, buzzwords, or hype)
- Be specific and vivid with details about work, relationships, growth, challenges
- Make the future believable - not everyone becomes rich, famous, or perfect
- Include realistic obstacles overcome, unexpected turns, and compounding habits
- Use contractions naturally (I'm, you're, they're, doesn't, won't)

ANALYSIS BEFORE WRITING:
1. Identify their core motivation, fears, and hidden strengths
2. Infer 5-7 realistic turning points or opportunities over 10 years
3. Imagine how their habits compound into different outcomes
4. Choose ONE most compelling and believable future path
5. Build the narrative around NEW discoveries, not their stated dreams

OUTPUT FORMAT - Return ONLY valid JSON:
{
  "futureYou": "2-3 sentences describing who they become, how they think, what changed about them (NEW insights, not their goals repeated)",
  "turningPoint": "1-2 sentences about ONE specific decision, opportunity, realization, or habit that redirected their path in an unexpected way",
  "nextYear": "1-2 sentences about realistic near-term changes or small wins",
  "threeYears": "1-2 sentences about what shifts after facing real challenges or discovering new interests",
  "fiveYears": "1-2 sentences about meaningful progress and how they've evolved (NOT just 'achieved their dream')",
  "tenYears": "2-3 sentences about where they land and what matters most to them then",
  "dayInLife": "3-5 sentences painting a vivid, realistic day 10 years from now with specific details (work, hobbies, people, routines, feelings)",
  "oneLesson": "1 sentence - a simple but powerful insight their future self wants them to know NOW",
  "messageFromFuture": "3-4 sentences written directly to the user, personal and emotional, acknowledging their current self while pointing to what's possible"
}

CRITICAL REQUIREMENTS:
- Every story must feel specific to THEM, not generic
- Include realistic income/lifestyle context (not everyone thrives identically)
- Show growth through challenges, not just achievement of goals
- Infer personality development, relationship changes, and unexpected discoveries
- NO encoding errors, NO buzzwords, NO corporate speak
- Maximum clarity and emotional honesty`;

    const userPrompt = `Create a deeply personal future story for this person. Their answers are only starting clues.

${contextStr}

Build a 10-year narrative that feels like discovering their future, not describing it. Focus on:
1. Unexpected turning points and real challenges they'll overcome
2. How their habits compound into different outcomes
3. Relationships and personal growth they couldn't predict
4. Specific daily reality 10 years from now
5. Lessons only their future self can teach them

Make it emotional, specific to THEM (not generic), and believable. Infer possibilities beyond what they said.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
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
      return res.status(response.status).json({ error: 'Failed to generate prediction' });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return res.status(500).json({ error: 'No content generated' });
    }

    let jsonStr = content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const result: GenerationResult = JSON.parse(jsonStr);

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
      futureYou: cleanText(result.futureYou),
      turningPoint: cleanText(result.turningPoint),
      nextYear: cleanText(result.nextYear),
      threeYears: cleanText(result.threeYears),
      fiveYears: cleanText(result.fiveYears),
      tenYears: cleanText(result.tenYears),
      dayInLife: cleanText(result.dayInLife),
      oneLesson: cleanText(result.oneLesson),
      messageFromFuture: cleanText(result.messageFromFuture),
    };

    return res.status(200).json(cleanResult);
  } catch (error) {
    console.error('Error generating prediction:', error);
    return res.status(500).json({
      error: 'Failed to generate prediction',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
