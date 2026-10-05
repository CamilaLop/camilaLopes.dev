import type { CSSProperties } from 'react';

/** The readable label belongs to the link or heading; these two rows are decorative. */
export function RollingText({ text, individual = false, entrance = false, className = '' }: { text: string; individual?: boolean; entrance?: boolean; className?: string }) {
  return <span className={`rolling-text${individual ? ' rolling-text--individual' : ''} ${className}`} aria-hidden="true">
    {Array.from(text).map((letter, index) => <span className="rolling-letter" key={index} style={{ '--letter-index': index } as CSSProperties}>
      {entrance ? <span className="hero-intro-char"><span className="rolling-glyph" data-letter={letter}>{letter === ' ' ? '\u00a0' : letter}</span></span>
        : <span className="rolling-glyph" data-letter={letter}>{letter === ' ' ? '\u00a0' : letter}</span>}
    </span>)}
  </span>;
}
