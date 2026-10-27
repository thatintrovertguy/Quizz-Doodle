import React from 'react';
import { LogoMark } from './DoodleIllustrations';

interface NavbarProps {
  onLogoClick: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <button
        className="navbar-brand"
        onClick={onLogoClick}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        aria-label="Quizzy Doodle — go to home"
      >
        <LogoMark size={34} />
        <span className="navbar-brand-name">quizzy doodle</span>
      </button>

      <div className="navbar-tagline" aria-hidden="true">
        ✦ powered by Gemini
      </div>
    </nav>
  );
}
