import { useState, type FormEvent } from 'react';
import { useLocale } from '../context/LocaleContext';
import { contactDetails } from '../data/contact';
import { SectionLabel } from './SectionLabel';
import { TitleRevealText } from './TitleRevealText';

export function LetsWork({ reduced, onToggleMotion }: { reduced: boolean; onToggleMotion: () => void }) {
  const { t } = useLocale();
  const [status, setStatus] = useState('');
  const [brief, setBrief] = useState('');
  const hasEmail = Boolean(contactDetails.email);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const text = `${t.contact.form[0]}: ${data.get('name')}\n${t.contact.form[1]}: ${data.get('email')}\n${t.contact.form[2]}: ${data.get('objective')}\n\n${t.contact.form[3]}:\n${data.get('message')}`;
    if (hasEmail) {
      setStatus(t.contact.opening);
      window.location.href = `mailto:${contactDetails.email}?subject=${encodeURIComponent(`Portfolio — ${data.get('objective')}`)}&body=${encodeURIComponent(text)}`;
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setStatus(t.contact.copied);
    } catch {
      setBrief(text);
      setStatus(t.contact.copyFallback);
    }
  }
  return <section className="contact" id="contact" aria-labelledby="contact-title">
    <div className="section-rule" data-rule />
    <div className="contact-layout">
      <div className="contact-copy"><div data-reveal><SectionLabel number="05">{t.contact.label}</SectionLabel></div><h2 id="contact-title" className="display contact-title" data-title-reveal aria-label={t.contact.title.join(' ')}>{t.contact.title.map(line => <span key={line}><TitleRevealText text={line} /></span>)}</h2><p className="contact-availability micro" data-reveal><span aria-hidden="true" />{t.contact.status}</p><p className="contact-lead" data-reveal>{t.contact.lead}</p><p className="contact-small" data-reveal>{t.contact.small}</p></div>
      <form className="contact-form" onSubmit={submit} onChange={() => { setStatus(''); setBrief(''); }} data-reveal>
        <div className="form-first-row"><div className="form-field"><label htmlFor="contact-name">{t.contact.form[0]}</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} placeholder={t.contact.placeholders[0]} /></div><div className="form-field"><label htmlFor="contact-email">{t.contact.form[1]}</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder={t.contact.placeholders[1]} /></div></div>
        <div className="form-field"><label htmlFor="contact-objective">{t.contact.form[2]}</label><input id="contact-objective" name="objective" required maxLength={200} placeholder={t.contact.placeholders[2]} /></div>
        <div className="form-field"><label htmlFor="contact-message">{t.contact.form[3]}</label><textarea id="contact-message" name="message" required maxLength={3000} rows={4} placeholder={t.contact.placeholders[3]} /></div>
        <button className="swipe-button" type="submit"><span>{hasEmail ? t.contact.submit : t.contact.copy}</span><span aria-hidden="true">↗</span></button>
        {!hasEmail && <p className="form-hint">{t.contact.briefHint}</p>}
        <p className="form-status" role="status">{status}</p>
        {brief && <textarea className="brief-fallback" aria-label="Briefing" readOnly value={brief} rows={7} onFocus={event => event.currentTarget.select()} />}
      </form>
    </div>
    <div className="contact-links"><span className="micro">{t.contact.direct}</span><div>{contactDetails.email && <a className="text-link" href={`mailto:${contactDetails.email}`}>Email ↗</a>}<a className="text-link" href={contactDetails.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>{contactDetails.linkedin && <a className="text-link" href={contactDetails.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}</div><a href="#top" className="back-to-top micro">{t.contact.top} ↑</a></div>
    <footer className="site-footer micro"><span>© {new Date().getFullYear()} Camila Lopes</span><span>Front-end & UI/UX / {t.based}</span><div className="footer-settings"><span>{t.contact.rights}</span><button className="motion-toggle" type="button" aria-pressed={reduced} onClick={onToggleMotion}>{t.motion.reduce}</button></div></footer>
  </section>;
}
