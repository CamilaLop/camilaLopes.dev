import { heroVideo } from './heroVideo';

export type ProjectMedia =
  | { type: 'image'; src: string; fit?: 'cover' | 'contain'; poster?: string }
  | { type: 'video'; src: string; poster?: string; fit?: 'cover' | 'contain' };

// Replace just these sources to use your own project images, GIFs or videos.
// GIF: { type: 'image', src: '/assets/projects/lue.gif' }
// Video: { type: 'video', src: '/assets/projects/lue.mp4', poster: '/assets/projects/lue-brand.webp' }
// Original screenshots remain the preview in Gallery, project details and reduced motion.
export const projectMedia: Record<string, ProjectMedia> = {
  'igor-guia': { type: 'video', src: heroVideo.src, poster: heroVideo.poster },
  'lue-brand': { type: 'video', src: '/assets/projects/lue-brand.mp4', poster: '/assets/projects/lue-brand.webp' },
  'sales-dashboard': { type: 'video', src: '/assets/projects/sales-dashboard.mp4', poster: '/assets/projects/sales-dashboard.webp' }
};
