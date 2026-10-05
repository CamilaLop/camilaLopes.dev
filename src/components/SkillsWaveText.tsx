/** Word masks preserve wrapping; assistive technology receives the complete text. */
export function SkillsWaveText({ text }: { text: string }) {
  return <span className="skills-wave-text">
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{text.split(' ').map((word, index) => <span key={index}>
      {index > 0 && ' '}<span className="skills-wave-word">{Array.from(word).map((letter, letterIndex) =>
        <span className="skills-wave-char" key={letterIndex}>{letter}</span>
      )}</span>
    </span>)}</span>
  </span>;
}
