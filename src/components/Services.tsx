import { useLocale } from '../context/LocaleContext';
import { SectionLabel } from './SectionLabel';
import { TitleRevealText } from './TitleRevealText';
import '../styles/services-circular.css';
import '../styles/services-interactions.css';

export function Services() {
  const { t } = useLocale();
  return <section className="services section-paper" id="services" aria-labelledby="services-title">
    <div className="services-circular-stage"><div className="services-content">
    <div className="section-rule" data-rule />
    <div className="services-layout">
      <div className="services-copy">
        <div data-reveal data-service-reveal><SectionLabel number="03">{t.services.label}</SectionLabel></div>
        <h2 id="services-title" className="display services-title" data-title-reveal aria-label={t.services.title.join(' ')}>{t.services.title.map(line => <span key={line} data-service-reveal data-title-reveal-line><TitleRevealText text={line} /></span>)}</h2>
        <p className="section-lead" data-reveal data-service-reveal>{t.services.lead}</p>
      </div>
      <div className="services-list"><p className="micro services-hint" data-reveal data-service-reveal>{t.services.hint} ↓</p>{t.services.items.map((item, i) => <details className="service-row" key={i} data-reveal data-service-reveal>
        <summary aria-controls={`service-description-${i}`}><span className="service-number micro">0{i + 1}</span><span className="service-name">{item.name}</span><span className="service-meta">{item.meta}</span><span className="service-expand" aria-hidden="true">+</span></summary>
        <div className="service-description-panel" id={`service-description-${i}`}><p className="service-description">{item.text}</p></div>
      </details>)}</div>
    </div>
    </div></div>
  </section>;
}
