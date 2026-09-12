import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { articles, categories, getArticle, articleHref } from '@/lib/content';
import { portalPages } from '@/lib/page-guides';
import { SearchBox, TopicIcon } from '@/components/help-ui';

import { collectionSchema, pageMetadata } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
export const metadata = pageMetadata('Help for every portal page', 'Find step-by-step help by the page name in your inYice agency workspace.', '/pages');
export default function PageDirectory() {
  return <main id="main" className="container interior"><StructuredData data={collectionSchema('Help for every portal page', 'Find step-by-step help by the page name in your inYice agency workspace.', '/pages', articles.filter(article => portalPages.some(([, , slug]) => slug === article.slug)))}/>
    <div className="breadcrumbs"><Link href="/">Help Center</Link><span>/</span><span>Help by page</span></div>
    <span className="small-eyebrow">YOUR WORKSPACE, EXPLAINED</span>
    <h1>Find help for your page.</h1>
    <p className="lead">Choose the screen you’re using for instructions, practical notes, and next steps.</p>
    <p className="muted">{portalPages.length} agency and public pages covered. Available screens depend on your role.</p>
    <SearchBox compact/>
    <nav className="directory-jumps" aria-label="Page groups">{categories.map(c => <a key={c.slug} href={`#${c.slug}`}>{c.title}</a>)}</nav>
    <div className="directory-grid">{categories.map(c => <section key={c.slug} id={c.slug} className="directory-section">
      <div className="directory-heading"><span className={`topic-icon ${c.color}`}><TopicIcon name={c.icon}/></span><h2>{c.title}</h2></div>
      {portalPages.filter(([, , slug]) => getArticle(slug)?.category === c.slug).map(([route, name, slug]) => <Link key={route} className="directory-link" href={articleHref(slug)}><span><strong>{name}</strong><small>{getArticle(slug)!.description}</small></span><ArrowRight size={17}/></Link>)}
    </section>)}</div>
  </main>;
}
