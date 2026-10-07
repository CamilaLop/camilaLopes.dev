import { useEffect, useRef } from 'react';
import { useLocale } from '../context/LocaleContext';
import type { PortfolioProject } from '../data/projects';
import { getProjectCopy } from '../data/projectCopy';

export function ProjectDialog({ project, onClose }: { project: PortfolioProject | null; onClose: () => void }) {
  const { t, locale } = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element || !project) return;
    const previousOverflow = document.body.style.overflow;
    if (!element.open) element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (element.open) element.close();
    };
  }, [project]);
  const copy = project ? getProjectCopy(locale, project) : null;
  return <dialog ref={dialog} className="project-dialog" aria-labelledby="project-dialog-title" aria-describedby="project-dialog-summary" onClose={onClose} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const r = event.currentTarget.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.currentTarget.close();
  }}>
    {project && copy && <>
      <header className="dialog-top"><span className="micro">{copy.category} / {t.projects.status[project.status]}</span><button className="dialog-close" type="button" onClick={() => dialog.current?.close()} aria-label={t.close}>×</button></header>
      <h2 id="project-dialog-title">{project.title}</h2><img className="dialog-image" src={project.image} alt={`${project.title} — ${copy.category}`} width={project.imageWidth} height={project.imageHeight} />
      <p id="project-dialog-summary" className="dialog-summary">{copy.summary}</p>
      <div className="dialog-details"><div><h3 className="micro">{t.projects.responsibility}</h3><ul>{copy.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3 className="micro">{t.projects.stack}</h3><p>{project.stack.join(' / ')}</p></div></div>
      {project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">{t.projects.view}<span aria-hidden="true">↗</span></a>}
    </>}
  </dialog>;
}
