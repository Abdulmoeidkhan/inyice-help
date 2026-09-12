import { Expand } from 'lucide-react';
import { screenshots } from '@/lib/screenshots';

export function GuideScreenshots({ slug }: { slug: string }) {
  const images = screenshots[slug];
  if (!images?.length) return null;
  return <section className="guide-screenshots" aria-label="Page screenshots">
    <h2>See it in the workspace</h2>
    <p className="screenshot-intro">Actual portal screens. Private values are hidden where needed. Open an image to see it at full size.</p>
    {images.map(image => <figure key={image.src}>
      <a className="screenshot-link" href={image.src} target="_blank" rel="noreferrer" aria-label={`Open screenshot: ${image.caption} (new tab)`}>
        {/* Native images preserve the full-size screenshot link and need no image service. */}
        <img src={image.src} alt={image.caption} width={image.width} height={image.height} loading="lazy"/>
        <span className="screenshot-expand"><Expand size={14}/> View full size</span>
      </a>
      <figcaption>{image.caption}</figcaption>
    </figure>)}
  </section>;
}
