// ============================================================
//  Quizzy Doodle — Vercel Serverless Function
//  POST /api/generate-quiz
//
//  Calls the Gemini API server-side. The API key is NEVER
//  exposed to the browser.
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// ── Constants ──────────────────────────────────────────────

const SUPPORTED_QUESTION_COUNTS = [5, 10, 15] as const;
const SUPPORTED_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
const SUPPORTED_QUESTION_TYPES = ['multiple_choice', 'true_false', 'mixed'] as const;
const MAX_CONTENT_LENGTH = 8000;

type SupportedDifficulty = (typeof SUPPORTED_DIFFICULTIES)[number];
type SupportedQuestionType = (typeof SUPPORTED_QUESTION_TYPES)[number];

// ── Internal types ─────────────────────────────────────────

interface QuizRequestBody {
  sourceType: unknown;
  content: unknown;
  questionCount: unknown;
  difficulty: unknown;
  questionType: unknown;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// ── Prompt builder ─────────────────────────────────────────

function buildPrompt(
  sourceType: string,
  content: string,
  questionCount: number,
  difficulty: SupportedDifficulty,
  questionType: SupportedQuestionType
): string {
  const sourceDescription =
    sourceType === 'topic'
      ? `the topic: "${content}"`
      : `the following study notes:\n\n---\n${content}\n---`;

  const typeInstruction =
    questionType === 'multiple_choice'
      ? 'ALL questions must be multiple-choice with EXACTLY 4 answer options.'
      : questionType === 'true_false'
      ? 'ALL questions must be true/false questions with options ["True", "False"].'
      : `Mix multiple-choice and true/false questions, roughly half of each. Multiple-choice questions must have EXACTLY 4 options; true/false questions must have options ["True", "False"].`;

  const difficultyGuidance: Record<SupportedDifficulty, string> = {
    easy: 'Use straightforward factual questions suitable for beginners. Vocabulary should be simple.',
    medium:
      'Use moderately challenging questions that require understanding, not just memorisation.',
    hard: 'Use challenging questions requiring deep understanding, analysis, critical thinking, or application of concepts.',
  };

  return `You are an expert quiz generator. Generate EXACTLY ${questionCount} quiz questions based on ${sourceDescription}.

Difficulty: ${difficulty.toUpperCase()} — ${difficultyGuidance[difficulty]}
Question format: ${typeInstruction}

Rules you MUST follow:
1. Generate EXACTLY ${questionCount} questions — no more, no fewer.
2. Do NOT duplicate questions or very similar questions.
3. For multiple-choice: provide EXACTLY 4 distinct answer options. Exactly one must be correct. Generate plausible, educational distractors.
4. For true/false: options MUST be exactly ["True", "False"] (capitalised exactly like this).
5. The "correctAnswer" field MUST exactly match one of the strings in "options".
6. Each explanation must be 1–3 concise sentences that explain why the correct answer is right.
7. Base all questions ONLY on the provided ${sourceType === 'topic' ? 'topic' : 'notes'}. Do not invent unsupported facts.
8. Question IDs must be sequential strings: "1", "2", "3", etc.

Return ONLY a valid JSON object. No markdown fences, no preamble, no trailing text. Use this exact schema:

{
  "questions": [
    {
      "id": "1",
      "question": "Question text?",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Explanation of why Option A is correct."
    },
    {
      "id": "2",
      "question": "True or False: Statement.",
      "type": "true_false",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "explanation": "Explanation of why this is true."
    }
  ]
}`;
}

// ── Server-side question validator ─────────────────────────

function isValidQuestion(q: unknown): q is QuizQuestion {
  if (!q || typeof q !== 'object') return false;
  const question = q as Record<string, unknown>;

  if (typeof question.id !== 'string' || question.id.trim() === '') return false;
  if (typeof question.question !== 'string' || question.question.trim() === '') return false;
  if (question.type !== 'multiple_choice' && question.type !== 'true_false') return false;
  if (!Array.isArray(question.options)) return false;
  if (typeof question.correctAnswer !== 'string') return false;
  if (typeof question.explanation !== 'string') return false;

  // Validate options length
  if (question.type === 'multiple_choice' && question.options.length !== 4) return false;
  if (question.type === 'true_false' && question.options.length !== 2) return false;

  // Validate correctAnswer is in options
  const opts = question.options as unknown[];
  if (!opts.every((o) => typeof o === 'string')) return false;
  if (!(question.options as string[]).includes(question.correctAnswer)) return false;

  return true;
}

// ── Handler ────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS / method gate ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // ── Environment check ──
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[generate-quiz] GEMINI_API_KEY is not set.');
    return res.status(500).json({
      error: 'Server configuration error: the API key is missing. Contact the site owner.',
    });
  }

  // ── Parse & validate body ──
  const body = req.body as QuizRequestBody;

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  const { sourceType, content, questionCount, difficulty, questionType } = body;

  if (sourceType !== 'topic' && sourceType !== 'notes') {
    return res.status(400).json({ error: 'Invalid sourceType. Must be "topic" or "notes".' });
  }

  if (typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required and cannot be empty.' });
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return res.status(400).json({
      error: `Content is too long. Maximum ${MAX_CONTENT_LENGTH.toLocaleString()} characters allowed.`,
    });
  }

  if (!SUPPORTED_QUESTION_COUNTS.includes(questionCount as (typeof SUPPORTED_QUESTION_COUNTS)[number])) {
    return res.status(400).json({ error: 'Invalid questionCount. Must be 5, 10, or 15.' });
  }

  if (!SUPPORTED_DIFFICULTIES.includes(difficulty as SupportedDifficulty)) {
    return res.status(400).json({
      error: 'Invalid difficulty. Must be "easy", "medium", or "hard".',
    });
  }

  if (!SUPPORTED_QUESTION_TYPES.includes(questionType as SupportedQuestionType)) {
    return res.status(400).json({
      error: 'Invalid questionType. Must be "multiple_choice", "true_false", or "mixed".',
    });
  }

  // ── Call Gemini ──
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = buildPrompt(
      sourceType as string,
      (content as string).trim(),
      questionCount as number,
      difficulty as SupportedDifficulty,
      questionType as SupportedQuestionType
    );

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    const rawText = response.text;

    if (!rawText || rawText.trim().length === 0) {
      console.error('[generate-quiz] Gemini returned empty response.');
      return res.status(500).json({
        error: 'The AI model returned an empty response. Please try again.',
      });
    }

    // Strip markdown code fences if the model wrapped the JSON
    let jsonText = rawText.trim();
    const fenceMatch = jsonText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
    if (fenceMatch) {
      jsonText = fenceMatch[1];
    }

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      console.error('[generate-quiz] Failed to parse Gemini output as JSON:', rawText.slice(0, 500));
      return res.status(500).json({
        error: 'The AI model returned an unexpected format. Please try again.',
      });
    }

    // Validate structure
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray((parsed as { questions?: unknown }).questions)
    ) {
      console.error('[generate-quiz] Missing "questions" array in parsed output.');
      return res.status(500).json({
        error: 'Invalid quiz structure returned by the AI. Please try again.',
      });
    }

    const rawQuestions = (parsed as { questions: unknown[] }).questions;
    const validatedQuestions = rawQuestions.filter(isValidQuestion);

    if (validatedQuestions.length === 0) {
      console.error('[generate-quiz] Zero valid questions after validation.');
      return res.status(500).json({
        error: 'No valid questions were generated. Please try a different topic or try again.',
      });
    }

    return res.status(200).json({ questions: validatedQuestions });
  } catch (err: unknown) {
    // Do NOT include the API key or internal details in the response
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[generate-quiz] Gemini API error:', message);
    return res.status(500).json({
      error: `Failed to generate quiz. ${message.length < 200 ? message : 'Please try again.'}`,
    });
  }
}
