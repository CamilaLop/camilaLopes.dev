import { useLocale } from '../context/LocaleContext';
import { contactDetails } from '../data/contact';
import { SectionLabel } from './SectionLabel';
import { SkillsWaveText } from './SkillsWaveText';
import { TitleRevealText } from './TitleRevealText';
import '../styles/about-wave.css';
import '../styles/services-about.css';

const skills = [
  ['React', 'Next.js', 'JavaScript', 'TypeScript', 'GSAP', 'Tailwind', 'HTML/CSS'],
  ['Supabase', 'PostgreSQL', 'Prisma', 'Python', 'Node.js'],
  ['Figma', 'Git', 'Vercel', 'Stripe', 'Illustrator']
];

export function AboutMe() {
  const { t } = useLocale();
  return <section className="about section-paper" id="about" aria-labelledby="about-title">
    <div className="about-entry-rule" aria-hidden="true" />
    <header className="about-head"><div data-about-entry-label><SectionLabel number="04">{t.about.label}</SectionLabel></div><h2 id="about-title" className="display about-title" aria-label={t.about.title}><span className="about-title-mask"><span data-about-entry-title><TitleRevealText text={t.about.title} /></span></span></h2></header>
    <div className="about-grid">
      <div className="about-copy"><p className="about-lead" data-reveal>{t.about.lead}</p><div className="about-paragraphs" data-reveal><p>{t.about.copy1}</p><p>{t.about.copy2}</p>{contactDetails.resume && <a className="text-link" href={contactDetails.resume} target="_blank" rel="noopener noreferrer">{t.contact.resume}<span aria-hidden="true">↗</span></a>}</div></div>
      <figure className="about-portrait"><div className="portrait-image" data-portrait-reveal><img src="/assets/about-camila.png" alt={t.about.portrait} width="527" height="549" loading="lazy" decoding="async" /><div className="portrait-wave-mask" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <span className="portrait-wave-column" key={index} />)}</div></div><figcaption data-reveal><span>{t.about.education}</span><span>Estácio / 2025</span></figcaption></figure>
    </div>
    <div className="skills-grid">{skills.map((items, i) => <div className="skill-group" key={i} data-skills-wave><span className="micro"><SkillsWaveText text={`0${i + 1} / ${t.about.skills[i]}`} /></span><p><SkillsWaveText text={items.join(' / ')} /></p></div>)}</div>
    <div className="about-manifesto"><div className="section-rule" data-rule /><span className="micro" data-reveal>{t.about.approach}</span><p className="editorial-note" data-reveal-title>{t.about.manifesto}</p><p className="manifesto-copy" data-reveal>{t.about.manifestoSmall}</p></div>
  </section>;
}
