import { useLocale } from '../context/LocaleContext';
import { RollingText } from './RollingText';
import { HeroRevealText } from './HeroRevealText';
import { HeroVideo } from './HeroVideo';

export function HeroProjects({ reduced, loading, onEnableMotion, videoPaused, onVideoPauseChange }: { reduced: boolean; loading: boolean; onEnableMotion: () => void; videoPaused: boolean; onVideoPauseChange: (paused: boolean) => void }) {
  const { t } = useLocale();
  return <section className="hero" id="top" aria-labelledby="hero-name" data-hero-loading={loading ? 'true' : undefined}>
    <span className="hero-video-zoom-start" aria-hidden="true" />
    <div className="hero-stage">
      <div className="hero-topline micro"><span><HeroRevealText text={t.hero.role} /></span><span><HeroRevealText text={t.hero.edition} /></span></div>
      <figure className="hero-image"><div className="hero-image-parallax"><img src="/assets/hero-rio-bw.jpg" alt={t.hero.photo} width="1300" height="867" fetchPriority="high" /></div><figcaption className="micro">{t.hero.caption}</figcaption>{reduced && <button type="button" className="motion-enable" onClick={onEnableMotion}>{t.motion.enable}<span aria-hidden="true">↗</span></button>}</figure>
      <h1 className="hero-name" id="hero-name" aria-label="Camila Lopes" tabIndex={0}><span className="hero-name-line hero-name-start"><RollingText text="CAMILA" individual entrance className="hero-name-word" /></span><span className="hero-name-gap" aria-hidden="true" /><span className="hero-name-line hero-name-end"><RollingText text="LOPES" individual entrance className="hero-name-word" /></span></h1>
      <div className="hero-summary"><p><HeroRevealText text={t.hero.lead} /></p><a href="#projects" className="text-link"><HeroRevealText text={t.hero.work} /><span aria-hidden="true">↘</span></a></div>
      <HeroVideo loading={loading} reduced={reduced} paused={videoPaused} onPauseChange={onVideoPauseChange} />
      <div className="hero-bottom micro"><span><HeroRevealText text={t.based} /></span><a className="hero-scroll" href="#projects"><HeroRevealText text={t.hero.scroll} /><span aria-hidden="true">↓</span></a><a href="#contact"><HeroRevealText text={`${t.hero.contact} ↗`} /></a></div>
    </div>
  </section>;
}
