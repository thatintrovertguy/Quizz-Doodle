import React, { useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuizForm from './components/QuizForm';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import { NotebookDoodle } from './components/DoodleIllustrations';
import { generateQuiz } from './services/quizApi';
import type {
  QuizView as QuizViewState,
  QuizRequest,
  QuizQuestion,
  QuizResultSummary,
} from './types/quiz';


export default function App() {
  // ── UI state ──────────────────────────────────────────────
  const [view, setView] = useState<QuizViewState>('landing');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // ── Quiz state ────────────────────────────────────────────
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizConfig, setQuizConfig] = useState<QuizRequest | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<QuizResultSummary | null>(null);

  // Guard against double-submit
  const submitting = useRef(false);

  // ── Refs ──────────────────────────────────────────────────


  // ── Handlers ──────────────────────────────────────────────

  /** Scroll the quiz form into view when the hero CTA is clicked */
  function handleHeroGetStarted() {
    const el = document.getElementById('quiz-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** Submit the form and call the serverless function */
  const handleFormSubmit = useCallback(async (request: QuizRequest) => {
    if (submitting.current) return;
    submitting.current = true;

    setApiError(null);
    setIsGenerating(true);
    setView('generating');

    try {
      const generatedQuestions = await generateQuiz(request);
      setQuestions(generatedQuestions);
      setQuizConfig(request);
      setSelectedAnswers({});
      setCurrentIndex(0);
      setResult(null);
      setView('quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setApiError(msg);
      setView('landing');
    } finally {
      setIsGenerating(false);
      submitting.current = false;
    }
  }, []);

  /** Record the user's answer for a question */
  const handleSelectAnswer = useCallback((questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  /** Navigate between questions */
  const handleNavigate = useCallback((index: number) => {
    setCurrentIndex(index);
    // Scroll question card into view on mobile
    const el = document.getElementById('quiz-view');
    if (el && window.innerWidth < 768) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  /** Score the quiz and show results */
  const handleFinish = useCallback(() => {
    const questionResults = questions.map((q) => {
      const selected = selectedAnswers[q.id] ?? null;
      return {
        question: q,
        selectedAnswer: selected,
        isCorrect: selected === q.correctAnswer,
      };
    });

    const correct = questionResults.filter((r) => r.isCorrect).length;
    const unanswered = questionResults.filter((r) => r.selectedAnswer === null).length;
    const incorrect = questionResults.length - correct - unanswered;
    const percentage = Math.round((correct / questionResults.length) * 100);

    setResult({
      correct,
      incorrect,
      unanswered,
      total: questionResults.length,
      percentage,
      questionResults,
    });
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questions, selectedAnswers]);

  /** Retry the same quiz (reset answers) */
  const handleRetry = useCallback(() => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Go back to the landing page for a new quiz */
  const handleNewQuiz = useCallback(() => {
    setView('landing');
    setQuestions([]);
    setQuizConfig(null);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Render ────────────────────────────────────────────────

  return (
    <>
      <Navbar onLogoClick={handleNewQuiz} />

      {/* ── Landing page ── */}
      {(view === 'landing' || view === 'generating') && (
        <>
          <Hero onGetStarted={handleHeroGetStarted} />
          <main>
            <QuizForm
              onSubmit={handleFormSubmit}
              isGenerating={isGenerating}
              error={apiError}
            />
          </main>
        </>
      )}

      {/* ── Generating overlay ── */}
      {view === 'generating' && (
        <div
          className="generating-view"
          role="status"
          aria-live="polite"
          aria-label="Generating your quiz, please wait"
        >
          <div className="generating-illustration">
            <NotebookDoodle />
          </div>

          <div className="pencil-loader" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>

          <h2 className="generating-title">Brewing your questions…</h2>
          <p className="generating-subtitle">
            Gemini is thinking up {quizConfig?.questionCount ?? ''} great questions just for you.
          </p>
        </div>
      )}

      {/* ── Quiz view ── */}
      {view === 'quiz' && quizConfig && (
        <QuizView
          questions={questions}
          quizConfig={quizConfig}
          selectedAnswers={selectedAnswers}
          currentIndex={currentIndex}
          onSelectAnswer={handleSelectAnswer}
          onNavigate={handleNavigate}
          onFinish={handleFinish}
        />
      )}

      {/* ── Results view ── */}
      {view === 'results' && result && quizConfig && (
        <ResultsView
          result={result}
          quizConfig={quizConfig}
          onRetry={handleRetry}
          onNewQuiz={handleNewQuiz}
        />
      )}
    </>
  );
}
