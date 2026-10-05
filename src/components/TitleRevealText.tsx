/** Decorative letter masks; the heading supplies one complete accessible label. */
export function TitleRevealText({ text }: { text: string }) {
  return <span className="title-reveal-text" aria-hidden="true">{text.split(/(\s+)/).map((word, index) =>
    /^\s+$/.test(word) ? word : <span className="title-reveal-word" key={index}>{Array.from(word).map((letter, letterIndex) =>
      <span className="title-reveal-char" data-title-char key={letterIndex}>{letter}</span>
    )}</span>
  )}</span>;
}
