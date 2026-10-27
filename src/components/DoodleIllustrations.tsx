// ============================================================
//  Doodle Illustrations — hand-crafted inline SVG artwork
//  Used throughout Quizzy Doodle for the sketchbook aesthetic.
// ============================================================

import React from 'react';

/** Main hero illustration: open notebook, pencil, quiz cards, stars, arrows */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', maxWidth: 440, height: 'auto' }}
    >
      {/* ── Open Notebook ─────────────────────────────────── */}
      {/* Left page */}
      <rect x="22" y="68" width="178" height="228" rx="3" fill="#FFFCF4" stroke="#252820" strokeWidth="2" />
      {/* Right page */}
      <rect x="200" y="68" width="178" height="228" rx="3" fill="#FFFCF4" stroke="#252820" strokeWidth="2" />
      {/* Spine / binding */}
      <rect x="194" y="63" width="12" height="238" fill="#D9D0BE" stroke="#252820" strokeWidth="1.5" />
      {/* Binding holes */}
      {[100, 130, 160, 190, 220, 250].map((y) => (
        <ellipse key={y} cx="200" cy={y} rx="5" ry="5" fill="#C4BAA5" stroke="#252820" strokeWidth="1.2" />
      ))}

      {/* Left page: ruled lines */}
      {[104, 120, 136, 152, 168, 184, 200, 216, 232, 248, 264].map((y) => (
        <line key={y} x1="42" y1={y} x2="185" y2={y} stroke="#D9D0BE" strokeWidth="1" />
      ))}
      {/* Left page: margin line */}
      <line x1="60" y1="78" x2="60" y2="285" stroke="#E9957B" strokeWidth="1.2" opacity="0.5" />

      {/* Left page handwritten content */}
      <text x="66" y="100" fontFamily="'Patrick Hand', cursive" fontSize="11" fill="#315C46" fontWeight="bold">Chapter 4 ✦</text>
      <text x="66" y="120" fontFamily="'Patrick Hand', cursive" fontSize="10" fill="#252820">Key concepts:</text>
      <text x="70" y="138" fontFamily="'Patrick Hand', cursive" fontSize="9.5" fill="#77766B">→ Encapsulation</text>
      <text x="70" y="154" fontFamily="'Patrick Hand', cursive" fontSize="9.5" fill="#77766B">→ Inheritance</text>
      <text x="70" y="170" fontFamily="'Patrick Hand', cursive" fontSize="9.5" fill="#77766B">→ Polymorphism</text>
      <text x="70" y="186" fontFamily="'Patrick Hand', cursive" fontSize="9.5" fill="#77766B">→ Abstraction</text>
      <text x="66" y="212" fontFamily="'Patrick Hand', cursive" fontSize="9" fill="#252820">* see pg. 42</text>

      {/* Right page: ruled lines */}
      {[104, 120, 136, 152, 168, 184, 200, 216, 232, 248, 264].map((y) => (
        <line key={y} x1="215" y1={y} x2="368" y2={y} stroke="#D9D0BE" strokeWidth="1" />
      ))}

      {/* Right page: quiz questions */}
      <text x="215" y="100" fontFamily="'Patrick Hand', cursive" fontSize="10.5" fill="#315C46" fontWeight="bold">Quiz Time! 📝</text>
      <text x="215" y="122" fontFamily="'Patrick Hand', cursive" fontSize="9.5" fill="#252820">Q1. What is OOP?</text>
      <rect x="215" y="128" width="50" height="11" rx="2" fill="#F4D66D" opacity="0.6" />
      <text x="217" y="138" fontFamily="'Patrick Hand', cursive" fontSize="8.5" fill="#252820">A) method B) paradigm</text>
      <text x="215" y="155" fontFamily="'Patrick Hand', cursive" fontSize="9.5" fill="#252820">Q2. True or False:</text>
      <text x="215" y="168" fontFamily="'Patrick Hand', cursive" fontSize="8.5" fill="#77766B">"Java is compiled"</text>
      <text x="215" y="190" fontFamily="'Patrick Hand', cursive" fontSize="9.5" fill="#252820">Q3. Which keyword...</text>
      {/* Score sticky */}
      <rect x="218" y="240" width="80" height="36" rx="3" fill="#B8D5E4" transform="rotate(-3 258 258)" />
      <text x="226" y="258" fontFamily="'Patrick Hand', cursive" fontSize="10" fill="#252820" transform="rotate(-3 258 258)">Score: 4/5</text>
      <text x="226" y="270" fontFamily="'Patrick Hand', cursive" fontSize="9" fill="#315C46" transform="rotate(-3 258 268)">✓ Great job!</text>

      {/* ── Pencil (leaning diagonally, top-right) ─────── */}
      <g transform="rotate(-30 340 60) translate(310, 20)">
        {/* Pencil body */}
        <rect x="0" y="0" width="16" height="90" rx="2" fill="#F4D66D" stroke="#252820" strokeWidth="1.5" />
        {/* Eraser */}
        <rect x="0" y="0" width="16" height="12" rx="2" fill="#E9957B" stroke="#252820" strokeWidth="1.5" />
        {/* Eraser band */}
        <rect x="0" y="11" width="16" height="5" fill="#D9D0BE" />
        {/* Tip */}
        <polygon points="0,90 16,90 8,106" fill="#F5E6B8" stroke="#252820" strokeWidth="1.5" />
        {/* Graphite tip */}
        <polygon points="5,102 11,102 8,108" fill="#555" />
        {/* Wood grain lines */}
        <line x1="5" y1="16" x2="5" y2="88" stroke="#E8C43C" strokeWidth="0.8" opacity="0.5" />
        <line x1="11" y1="16" x2="11" y2="88" stroke="#E8C43C" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* ── Floating Quiz Cards ──────────────────────────── */}
      {/* Card 1 — top left, yellow */}
      <g transform="rotate(-8 60 28) translate(12, 10)">
        <rect width="78" height="52" rx="4" fill="#F4D66D" stroke="#252820" strokeWidth="1.5" />
        <line x1="10" y1="16" x2="68" y2="16" stroke="#252820" strokeWidth="1" opacity="0.4" />
        <line x1="10" y1="26" x2="55" y2="26" stroke="#252820" strokeWidth="1" opacity="0.4" />
        <line x1="10" y1="36" x2="60" y2="36" stroke="#252820" strokeWidth="1" opacity="0.4" />
        <text x="10" y="12" fontFamily="'Patrick Hand', cursive" fontSize="8" fill="#315C46">Q1 ✓</text>
      </g>

      {/* Card 2 — bottom right, coral */}
      <g transform="rotate(6 360 315) translate(310, 295)">
        <rect width="82" height="55" rx="4" fill="#E9957B" stroke="#252820" strokeWidth="1.5" opacity="0.85" />
        <line x1="10" y1="16" x2="72" y2="16" stroke="#fff" strokeWidth="1" opacity="0.4" />
        <line x1="10" y1="26" x2="58" y2="26" stroke="#fff" strokeWidth="1" opacity="0.4" />
        <text x="10" y="12" fontFamily="'Patrick Hand', cursive" fontSize="8" fill="#fff">Q2 ?</text>
      </g>

      {/* ── Stars ──────────────────────────────────────── */}
      {/* Star 1 */}
      <g transform="translate(388, 42)">
        <path d="M8,0 L9.8,5.6 L16,5.6 L11,9 L12.8,14.6 L8,11.4 L3.2,14.6 L5,9 L0,5.6 L6.2,5.6 Z"
          fill="#F4D66D" stroke="#252820" strokeWidth="1" />
      </g>
      {/* Star 2 (small) */}
      <g transform="translate(18, 35)">
        <path d="M5,0 L6.2,3.5 L10,3.5 L7,5.7 L8,9.3 L5,7.2 L2,9.3 L3,5.7 L0,3.5 L3.8,3.5 Z"
          fill="#B8D5E4" stroke="#252820" strokeWidth="1" />
      </g>
      {/* Star 3 */}
      <g transform="translate(390, 330)">
        <path d="M6,0 L7.5,4.2 L12,4.2 L8.5,6.8 L9.8,11.1 L6,8.5 L2.2,11.1 L3.5,6.8 L0,4.2 L4.5,4.2 Z"
          fill="#E9957B" stroke="#252820" strokeWidth="1" />
      </g>
      {/* Sparkle (4-pointed star) */}
      <g transform="translate(10, 316)">
        <path d="M6,0 L7,5 L12,6 L7,7 L6,12 L5,7 L0,6 L5,5 Z"
          fill="#315C46" opacity="0.7" />
      </g>

      {/* ── Arrows ──────────────────────────────────────── */}
      {/* Arrow pointing at notebook from top */}
      <path d="M 186 42 Q 200 52 196 64"
        stroke="#252820" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <polygon points="192,62 196,64 200,60" fill="#252820" opacity="0.5" />

      {/* ── Small annotations ───────────────────────────── */}
      <text x="192" y="40" fontFamily="'Patrick Hand', cursive" fontSize="9" fill="#77766B" transform="rotate(-5 200 38)">open here →</text>
      <text x="16" y="48" fontFamily="'Patrick Hand', cursive" fontSize="9" fill="#77766B" transform="rotate(5 16 48)">my notes</text>
      <text x="390" y="22" fontFamily="'Patrick Hand', cursive" fontSize="9" fill="#77766B" transform="rotate(-10 390 20)">✏️</text>
    </svg>
  );
}

/** Small notebook doodle used in the loading/generating screen */
export function NotebookDoodle() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 120, height: 100 }} aria-hidden="true">
      <rect x="14" y="10" width="92" height="76" rx="4" fill="#FFFCF4" stroke="#252820" strokeWidth="2" />
      <rect x="10" y="10" width="10" height="76" rx="3" fill="#D9D0BE" stroke="#252820" strokeWidth="1.5" />
      {[28, 40, 52, 64, 76].map((y) => (
        <line key={y} x1="28" y1={y} x2="96" y2={y} stroke="#D9D0BE" strokeWidth="1" />
      ))}
      <text x="28" y="26" fontFamily="'Patrick Hand', cursive" fontSize="10" fill="#315C46">Generating...</text>
      <text x="28" y="42" fontFamily="'Patrick Hand', cursive" fontSize="9" fill="#77766B">✦ thinking...</text>
    </svg>
  );
}

/** Small star sparkle inline decoration */
export function StarDoodle({ size = 14, color = '#F4D66D', className = '' }: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, display: 'inline-block', verticalAlign: 'middle' }}
      className={className}
      aria-hidden="true">
      <path
        d="M10,0 L12.2,7 L20,7 L13.8,11.3 L16,18.2 L10,14 L4,18.2 L6.2,11.3 L0,7 L7.8,7 Z"
        fill={color}
        stroke="#252820"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/** Small arrow for handwritten annotations */
export function ArrowDoodle({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg viewBox="0 0 36 16" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 36, height: 16, transform: `rotate(${rotate}deg)`, display: 'inline-block' }}
      aria-hidden="true">
      <path d="M2 8 Q10 4 28 8" stroke="#77766B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M24 4 L29 8 L24 12" stroke="#77766B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Doodle logo mark — small open book */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: (size * 28) / 32 }}
      aria-hidden="true">
      {/* Left page */}
      <path d="M2 4 Q2 2 4 2 L15 2 L15 24 Q8 22 2 24 Z" fill="#FFFCF4" stroke="#252820" strokeWidth="1.5" />
      {/* Right page */}
      <path d="M17 2 L28 2 Q30 2 30 4 L30 24 Q24 22 17 24 Z" fill="#FFFCF4" stroke="#252820" strokeWidth="1.5" />
      {/* Spine */}
      <line x1="16" y1="2" x2="16" y2="24" stroke="#252820" strokeWidth="1.5" />
      {/* Lines on left page */}
      <line x1="5" y1="9" x2="13" y2="9" stroke="#D9D0BE" strokeWidth="1" />
      <line x1="5" y1="13" x2="13" y2="13" stroke="#D9D0BE" strokeWidth="1" />
      <line x1="5" y1="17" x2="11" y2="17" stroke="#D9D0BE" strokeWidth="1" />
      {/* Star on right page */}
      <text x="19" y="17" fontSize="9" fill="#F4D66D">✦</text>
      {/* Yellow strip at bottom */}
      <rect x="2" y="22" width="28" height="4" rx="1" fill="#F4D66D" stroke="#252820" strokeWidth="1" />
    </svg>
  );
}
