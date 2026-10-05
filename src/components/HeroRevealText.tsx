/** Word masks keep natural wrapping and readable text without modifying React's DOM. */
export function HeroRevealText({ text }: { text: string }) {
  return <span className="hero-intro-copy" data-hero-intro-copy>
    {text.split(' ').map((word, index) => <span key={index}>{index > 0 && ' '}<span className="hero-intro-mask"><span className="hero-intro-text">{word}</span></span></span>)}
  </span>;
}
