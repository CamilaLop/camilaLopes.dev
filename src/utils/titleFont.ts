// The supplied Trial font has a limited cmap. Select a font for the complete
// heading, never replace accents or mix a fallback glyph into a Druk word.
export function titleFont(text: string): string {
  return /^[A-Za-z0-9\s!"',.?’‘“”\-]+$/u.test(text) ? ' title-druk' : '';
}
