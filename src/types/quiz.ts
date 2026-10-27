// ============================================================
//  Quizzy Doodle — Shared TypeScript Types
// ============================================================

export type SourceType = 'topic' | 'notes';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple_choice' | 'true_false' | 'mixed';
export type QuestionCount = 5 | 10 | 15;
export type QuizView = 'landing' | 'generating' | 'quiz' | 'results';

// ── Request sent from the frontend to /api/generate-quiz ──

export interface QuizRequest {
  sourceType: SourceType;
  content: string;
  questionCount: QuestionCount;
  difficulty: Difficulty;
  questionType: QuestionType;
}

// ── A single quiz question returned by the API ──

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// ── Per-question result after the quiz is submitted ──

export interface QuizQuestionResult {
  question: QuizQuestion;
  selectedAnswer: string | null;
  isCorrect: boolean;
}

// ── Top-level quiz result summary ──

export interface QuizResultSummary {
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  percentage: number;
  questionResults: QuizQuestionResult[];
}
