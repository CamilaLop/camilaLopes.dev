export function SectionLabel({ number, children }: { number: string; children: string }) {
  return <p className="section-label"><span aria-hidden="true">[{number}]</span><span>{children}</span></p>;
}
