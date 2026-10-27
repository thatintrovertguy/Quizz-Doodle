import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import type { QuizQuestion } from '../types/quiz';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  const isTrueFalse = question.type === 'true_false';

  return (
    <article className="question-card" aria-label={`Question ${questionNumber} of ${totalQuestions}`}>
      <p className="question-number">
        Question {questionNumber} of {totalQuestions}
      </p>

      <h2 className="question-text">{question.question}</h2>

      {isTrueFalse ? (
        /* ── True / False options ── */
        <div className="tf-options" role="group" aria-label="Select True or False">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isTrue = option === 'True';
            const selectedClass = isSelected
              ? isTrue ? 'selected-true' : 'selected-false'
              : '';

            return (
              <button
                key={option}
                id={`option-${questionNumber}-${option.toLowerCase()}`}
                className={`tf-btn ${selectedClass}`}
                onClick={() => onSelectAnswer(option)}
                aria-pressed={isSelected}
              >
                {isSelected ? (
                  <CheckCircle2 size={18} aria-hidden="true" />
                ) : (
                  <Circle size={18} aria-hidden="true" />
                )}
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        /* ── Multiple choice options ── */
        <div className="options-list" role="group" aria-label="Select an answer">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const letter = OPTION_LETTERS[index] ?? String(index + 1);

            return (
              <button
                key={option}
                id={`option-${questionNumber}-${letter.toLowerCase()}`}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectAnswer(option)}
                aria-pressed={isSelected}
              >
                <span className="option-letter" aria-hidden="true">{letter}</span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </article>
  );
}
