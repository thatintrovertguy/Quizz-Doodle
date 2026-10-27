import React, { useState, useRef } from 'react';
import { BookOpen, FileText, AlertCircle, Sparkles } from 'lucide-react';
import type { QuizRequest, SourceType, Difficulty, QuestionType, QuestionCount } from '../types/quiz';

interface QuizFormProps {
  onSubmit: (request: QuizRequest) => void;
  isGenerating: boolean;
  error: string | null;
}

const QUESTION_COUNTS: QuestionCount[] = [5, 10, 15];
const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '😊 Easy' },
  { value: 'medium', label: '🤔 Medium' },
  { value: 'hard', label: '🔥 Hard' },
];
const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'mixed', label: 'Mixed' },
];

const MAX_CONTENT = 8000;

export default function QuizForm({ onSubmit, isGenerating, error }: QuizFormProps) {
  const [sourceType, setSourceType] = useState<SourceType>('topic');
  const [content, setContent] = useState('');
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice');
  const [validationError, setValidationError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CONTENT;

  function validate(): boolean {
    if (!content.trim()) {
      setValidationError(
        sourceType === 'topic'
          ? 'Please enter a topic to generate questions about.'
          : 'Please paste your notes before generating a quiz.'
      );
      return false;
    }
    if (isOverLimit) {
      setValidationError(`Your ${sourceType === 'notes' ? 'notes are' : 'topic is'} too long. Please shorten it to under ${MAX_CONTENT.toLocaleString()} characters.`);
      return false;
    }
    setValidationError(null);
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ sourceType, content: content.trim(), questionCount, difficulty, questionType });
  }

  // Scroll form into view when "Make me a quiz" is clicked from Hero
  // (the ref is exposed for the parent to call)
  return (
    <section className="quiz-form-section" id="quiz-form" aria-labelledby="form-title" ref={formRef}>
      <div className="quiz-form-paper">
        <div className="form-header">
          <h2 className="form-header-title" id="form-title">Build your quiz</h2>
          <p className="form-header-sub">✦ fill in the details below and hit generate</p>
        </div>

        <form className="form-body" onSubmit={handleSubmit} noValidate>
          {/* ── Source type ── */}
          <div className="form-group">
            <label className="form-label">
              <BookOpen size={16} className="form-label-icon" aria-hidden="true" />
              What are we quizzing on?
            </label>
            <div className="source-type-toggle" role="group" aria-label="Source type">
              <button
                type="button"
                id="source-type-topic"
                className={`source-type-btn ${sourceType === 'topic' ? 'active' : ''}`}
                onClick={() => { setSourceType('topic'); setContent(''); setValidationError(null); }}
                aria-pressed={sourceType === 'topic'}
              >
                <BookOpen size={15} aria-hidden="true" />
                Topic
              </button>
              <button
                type="button"
                id="source-type-notes"
                className={`source-type-btn ${sourceType === 'notes' ? 'active' : ''}`}
                onClick={() => { setSourceType('notes'); setContent(''); setValidationError(null); }}
                aria-pressed={sourceType === 'notes'}
              >
                <FileText size={15} aria-hidden="true" />
                Paste Notes
              </button>
            </div>
          </div>

          {/* ── Content input ── */}
          <div className="form-group">
            <label className="form-label" htmlFor="quiz-content">
              {sourceType === 'topic' ? (
                <>
                  <BookOpen size={16} className="form-label-icon" aria-hidden="true" />
                  Topic name
                </>
              ) : (
                <>
                  <FileText size={16} className="form-label-icon" aria-hidden="true" />
                  Your notes
                </>
              )}
            </label>

            {sourceType === 'topic' ? (
              <input
                id="quiz-content"
                type="text"
                className="form-input"
                placeholder='e.g. "Object-Oriented Programming in Java"'
                value={content}
                onChange={(e) => { setContent(e.target.value); setValidationError(null); }}
                disabled={isGenerating}
                maxLength={500}
                aria-describedby={validationError ? 'form-validation-error' : undefined}
                aria-invalid={!!validationError}
              />
            ) : (
              <>
                <textarea
                  id="quiz-content"
                  className="form-textarea"
                  placeholder="Paste your study notes, lecture notes, or any text you want to be quizzed on…"
                  value={content}
                  onChange={(e) => { setContent(e.target.value); setValidationError(null); }}
                  disabled={isGenerating}
                  aria-describedby={validationError ? 'form-validation-error' : undefined}
                  aria-invalid={!!validationError}
                  rows={7}
                />
                <p className={`char-count ${isOverLimit ? 'warning' : ''}`} aria-live="polite">
                  {charCount.toLocaleString()} / {MAX_CONTENT.toLocaleString()} characters
                </p>
              </>
            )}
          </div>

          {/* ── Options row ── */}
          <div className="form-options-row">
            {/* Question count */}
            <div className="form-group">
              <p className="form-label" id="question-count-label">
                Number of questions
              </p>
              <div className="option-chips" role="group" aria-labelledby="question-count-label">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    id={`question-count-${count}`}
                    className={`option-chip ${questionCount === count ? 'active' : ''}`}
                    onClick={() => setQuestionCount(count)}
                    aria-pressed={questionCount === count}
                    disabled={isGenerating}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="form-group">
              <p className="form-label" id="difficulty-label">
                Difficulty
              </p>
              <div className="option-chips" role="group" aria-labelledby="difficulty-label">
                {DIFFICULTIES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    id={`difficulty-${value}`}
                    className={`option-chip ${difficulty === value ? 'active' : ''}`}
                    onClick={() => setDifficulty(value)}
                    aria-pressed={difficulty === value}
                    disabled={isGenerating}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question type */}
            <div className="form-group">
              <p className="form-label" id="question-type-label">
                Question type
              </p>
              <div className="option-chips" role="group" aria-labelledby="question-type-label">
                {QUESTION_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    id={`question-type-${value}`}
                    className={`option-chip ${questionType === value ? 'active' : ''}`}
                    onClick={() => setQuestionType(value)}
                    aria-pressed={questionType === value}
                    disabled={isGenerating}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Validation / Server error ── */}
          {(validationError || error) && (
            <div className="form-error" role="alert" id="form-validation-error">
              <AlertCircle size={18} className="form-error-icon" aria-hidden="true" />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* ── Submit ── */}
          <div className="form-submit-row">
            <p className="form-submit-hint">
              ✦ Gemini will generate {questionCount} {difficulty} questions
            </p>
            <button
              id="generate-quiz-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isGenerating || isOverLimit}
              aria-busy={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span
                    style={{
                      width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      display: 'inline-block', animation: 'spin 0.7s linear infinite'
                    }}
                    aria-hidden="true"
                  />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={17} aria-hidden="true" />
                  Generate my quiz ✦
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Inline spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
