import React from 'react';
import { CheckCircle2, XCircle, MinusCircle, RotateCcw, PlusCircle, BookOpen } from 'lucide-react';
import type { QuizResultSummary, QuizRequest } from '../types/quiz';
import { StarDoodle } from './DoodleIllustrations';

interface ResultsViewProps {
  result: QuizResultSummary;
  quizConfig: QuizRequest;
  onRetry: () => void;
  onNewQuiz: () => void;
}

function getEncouragingMessage(percentage: number): string {
  if (percentage === 100) return "Perfect score! You absolutely nailed it. 🎉";
  if (percentage >= 90) return "Outstanding! You really know your stuff. ⭐";
  if (percentage >= 75) return "Great work! A solid performance — keep it up! 📚";
  if (percentage >= 60) return "Good effort! A bit more revision and you'll ace it. 💪";
  if (percentage >= 40) return "Nice try! Review the explanations and go again. 🔄";
  return "Every expert was once a beginner. Keep studying! 🌱";
}

function getScoreColor(percentage: number): string {
  if (percentage >= 75) return 'var(--color-green)';
  if (percentage >= 50) return '#9A6B00';
  return '#c06040';
}

export default function ResultsView({ result, quizConfig, onRetry, onNewQuiz }: ResultsViewProps) {
  const { correct, incorrect, unanswered, total, percentage, questionResults } = result;
  const message = getEncouragingMessage(percentage);
  const scoreColor = getScoreColor(percentage);

  const topicDisplay =
    quizConfig.sourceType === 'topic' ? quizConfig.content : 'Your Notes';

  return (
    <main className="results-view" id="results-view" aria-labelledby="results-heading">
      <div className="results-container">

        {/* ── Score sheet ── */}
        <section className="results-score-sheet" aria-label="Quiz score summary">
          <p className="results-label">
            <StarDoodle size={12} color="#F4D66D" /> {topicDisplay} — {quizConfig.difficulty} quiz
          </p>

          <p
            className="results-score-big"
            style={{ color: scoreColor }}
            aria-label={`Score: ${percentage} percent`}
          >
            {percentage}%
          </p>

          <p className="results-fraction" aria-hidden="true">
            {correct} out of {total} correct
          </p>

          <h1 className="results-message" id="results-heading">{message}</h1>

          <div className="results-stats" role="list">
            <div className="stat-pill stat-pill-correct" role="listitem">
              <CheckCircle2 size={14} aria-hidden="true" />
              {correct} correct
            </div>
            <div className="stat-pill stat-pill-incorrect" role="listitem">
              <XCircle size={14} aria-hidden="true" />
              {incorrect} incorrect
            </div>
            {unanswered > 0 && (
              <div className="stat-pill stat-pill-unanswered" role="listitem">
                <MinusCircle size={14} aria-hidden="true" />
                {unanswered} skipped
              </div>
            )}
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="results-actions">
          <button id="retry-quiz-btn" className="btn btn-primary" onClick={onRetry}>
            <RotateCcw size={16} aria-hidden="true" />
            Try this quiz again
          </button>
          <button id="new-quiz-btn" className="btn btn-secondary" onClick={onNewQuiz}>
            <PlusCircle size={16} aria-hidden="true" />
            Make another quiz
          </button>
        </div>

        {/* ── Detailed review ── */}
        <section aria-label="Detailed question review">
          <h2 className="results-review-title">
            <BookOpen size={18} aria-hidden="true" />
            Answer review
          </h2>

          {questionResults.map((qr, idx) => {
            const statusClass = qr.isCorrect
              ? 'result-status-correct'
              : qr.selectedAnswer === null
              ? 'result-status-unanswered'
              : 'result-status-incorrect';

            return (
              <article
                key={qr.question.id}
                className="result-card"
                aria-label={`Question ${idx + 1}: ${qr.isCorrect ? 'correct' : qr.selectedAnswer === null ? 'unanswered' : 'incorrect'}`}
              >
                {/* Card header: status + question */}
                <div className="result-card-header">
                  <div className={`result-status-icon ${statusClass}`} aria-hidden="true">
                    {qr.isCorrect ? (
                      <CheckCircle2 size={15} />
                    ) : qr.selectedAnswer === null ? (
                      <MinusCircle size={15} />
                    ) : (
                      <XCircle size={15} />
                    )}
                  </div>
                  <div>
                    <p className="result-question-num">Question {idx + 1}</p>
                    <p className="result-question-text">{qr.question.question}</p>
                  </div>
                </div>

                {/* Card body: answers + explanation */}
                <div className="result-card-body">
                  {/* Your answer */}
                  <div className="result-answer-row">
                    <span className="result-answer-label">Your answer:</span>
                    {qr.selectedAnswer !== null ? (
                      <span className={`result-answer-value ${qr.isCorrect ? 'correct' : 'incorrect'}`}>
                        {qr.selectedAnswer}
                      </span>
                    ) : (
                      <span className="result-answer-value" style={{ color: 'var(--color-ink-muted)' }}>
                        — not answered
                      </span>
                    )}
                  </div>

                  {/* Correct answer (show always) */}
                  {!qr.isCorrect && (
                    <div className="result-answer-row">
                      <span className="result-answer-label">Correct answer:</span>
                      <span className="result-answer-value correct">{qr.question.correctAnswer}</span>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="result-explanation">
                    <p className="result-explanation-label">Explanation</p>
                    {qr.question.explanation}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* ── Bottom actions repeat ── */}
        <div className="results-actions" style={{ marginTop: '2rem', marginBottom: 0 }}>
          <button className="btn btn-primary" onClick={onRetry}>
            <RotateCcw size={16} aria-hidden="true" />
            Try this quiz again
          </button>
          <button className="btn btn-secondary" onClick={onNewQuiz}>
            <PlusCircle size={16} aria-hidden="true" />
            Make another quiz
          </button>
        </div>
      </div>
    </main>
  );
}
