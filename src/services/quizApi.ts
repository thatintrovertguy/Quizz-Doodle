// ============================================================
//  Quizzy Doodle — Frontend API Client
//  Calls the Vercel Serverless Function at /api/generate-quiz
// ============================================================

import type { QuizRequest, QuizQuestion } from '../types/quiz';

interface ApiErrorResponse {
  error: string;
}

interface ApiSuccessResponse {
  questions: QuizQuestion[];
}

/**
 * Sends a quiz generation request to the serverless function.
 * Throws a user-friendly Error on any failure.
 */
export async function generateQuiz(request: QuizRequest): Promise<QuizQuestion[]> {
  let response: Response;

  try {
    response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error(
      'Could not reach the server. Check your internet connection and try again.'
    );
  }

  // Try to parse JSON regardless of status code
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned an unreadable response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    throw new Error(
      errorData?.error ||
        `Request failed with status ${response.status}. Please try again.`
    );
  }

  const successData = data as ApiSuccessResponse;

  if (!successData?.questions || !Array.isArray(successData.questions)) {
    throw new Error('The server returned an unexpected response format.');
  }

  if (successData.questions.length === 0) {
    throw new Error('No questions were returned. Please try again.');
  }

  return successData.questions;
}
