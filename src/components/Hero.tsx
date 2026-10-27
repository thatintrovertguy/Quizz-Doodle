import React from 'react';
import { HeroIllustration, StarDoodle } from './DoodleIllustrations';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* ── Left: Content ── */}
      <div className="hero-content">
        <p className="hero-eyebrow">AI-powered quiz generator</p>

        <h1 className="hero-heading" id="hero-heading">
          Your notes.
          <br />
          Your{' '}
          <span className="highlight-word">quiz.</span>
          <br />
          Your rules.
        </h1>

        <p className="hero-subtitle">
          Turn what you&rsquo;re learning into a quick little challenge. Paste your notes, pick
          your difficulty, and let the questions begin.
        </p>

        <div className="hero-cta-row">
          <button
            id="hero-cta-btn"
            className="btn btn-primary"
            onClick={onGetStarted}
            aria-label="Scroll down to create a quiz"
          >
            Make me a quiz
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className="hero-note" aria-hidden="true">
            <StarDoodle size={12} color="#F4D66D" /> No login needed
          </span>
        </div>
      </div>

      {/* ── Right: Illustration ── */}
      <div className="hero-art" aria-hidden="true">
        <HeroIllustration />
      </div>
    </section>
  );
}
