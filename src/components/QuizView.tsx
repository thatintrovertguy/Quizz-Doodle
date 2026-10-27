import React from 'react';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import type { QuizQuestion, QuizRequest } from '../types/quiz';
import QuestionCard from './QuestionCard';

interface QuizViewProps {
  questions: QuizQuestion[];
  quizConfig: QuizRequest;
  selectedAnswers: Record<string, string>;
  currentIndex: number;
  onSelectAnswer: (questionId: string, answer: string) => void;
  onNavigate: (index: number) => void;
  onFinish: () => void;
}

export default function QuizView({
  questions,
  quizConfig,
  selectedAnswers,
  currentIndex,
  onSelectAnswer,
  onNavigate,
  onFinish,
}: QuizViewProps) {
  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const difficultyBadgeClass: Record<string, string> = {
    easy: 'quiz-badge-easy',
    medium: 'quiz-badge-medium',
    hard: 'quiz-badge-hard',
  };

  const topicDisplay =
    quizConfig.sourceType === 'topic'
      ? quizConfig.content.length > 40
        ? quizConfig.content.slice(0, 40) + '…'
        : quizConfig.content
      : 'Your Notes';

  return (
    <main className="quiz-view" id="quiz-view">
      <div className="quiz-container">
        {/* ── Header ── */}
        <header className="quiz-header">
          <div className="quiz-meta">
            <span className="quiz-topic">{topicDisplay}</span>
            <span
              className={`quiz-badge ${difficultyBadgeClass[quizConfig.difficulty] ?? ''}`}
              aria-label={`Difficulty: ${quizConfig.difficulty}`}
            >
              {quizConfig.difficulty}
            </span>
          </div>
          <div className="quiz-counter" aria-live="polite" aria-atomic="true">
            <strong>{currentIndex + 1}</strong> / {total}
            <br />
            <small style={{ fontSize: '0.78rem' }}>{answeredCount} answered</small>
          </div>
        </header>

        {/* ── Progress bar ── */}
        <div
          className="progress-bar-wrap"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Quiz progress: question ${currentIndex + 1} of ${total}`}
        >
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* ── Question card ── */}
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={total}
          selectedAnswer={selectedAnswers[currentQuestion.id] ?? null}
          onSelectAnswer={(answer) => onSelectAnswer(currentQuestion.id, answer)}
        />

        {/* ── Navigation ── */}
        <nav className="quiz-nav" aria-label="Question navigation">
          <button
            id="quiz-prev-btn"
            className="btn btn-secondary"
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Previous question"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Previous
          </button>

          {/* Dot navigation */}
          <div className="quiz-nav-dots" role="list" aria-label="Jump to question">
            {questions.map((q, i) => (
              <button
                key={q.id}
                role="listitem"
                id={`quiz-dot-${i + 1}`}
                className={`quiz-dot ${selectedAnswers[q.id] ? 'answered' : ''} ${i === currentIndex ? 'current' : ''}`}
                onClick={() => onNavigate(i)}
                aria-label={`Question ${i + 1}${selectedAnswers[q.id] ? ' (answered)' : ''}${i === currentIndex ? ' (current)' : ''}`}
                aria-current={i === currentIndex ? 'step' : undefined}
              />
            ))}
          </div>

          {currentIndex < total - 1 ? (
            <button
              id="quiz-next-btn"
              className="btn btn-secondary"
              onClick={() => onNavigate(currentIndex + 1)}
              aria-label="Next question"
            >
              Next
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          ) : (
            <button
              id="quiz-finish-btn"
              className="btn btn-primary"
              onClick={onFinish}
              aria-label="Finish quiz and see results"
            >
              <Flag size={17} aria-hidden="true" />
              Finish quiz
            </button>
          )}
        </nav>

        {/* ── Finish shortcut (always visible if not on last question) ── */}
        {currentIndex < total - 1 && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              id="quiz-finish-early-btn"
              className="btn btn-ghost btn-sm"
              onClick={onFinish}
              style={{ fontFamily: 'var(--font-hand)' }}
            >
              <Flag size={14} aria-hidden="true" />
              Submit quiz ({answeredCount}/{total} answered)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
