import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, FileText } from 'lucide-react';
import { articles, categories, articleHref } from '@/lib/content';
import { SearchBox, TopicIcon } from '@/components/help-ui';
import { collectionSchema, pageMetadata } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
export const dynamicParams = false;
export function generateStaticParams() { return categories.map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const c = categories.find(c => c.slug === slug); if (!c) notFound(); return pageMetadata(c.title, c.description, `/topics/${slug}`); }
export default async function Topic({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const c = categories.find(c => c.slug === slug); if (!c) notFound(); const guides = articles.filter(a => a.category === slug); return <main id="main" className="container interior"><StructuredData data={collectionSchema(c.title, c.description, `/topics/${slug}`, guides)}/><div className="breadcrumbs"><Link href="/">Help Center</Link><span>/</span><span>{c.title}</span></div><SearchBox compact/><div className={`topic-icon ${c.color}`}><TopicIcon name={c.icon}/></div><h1>{c.title}</h1><p className="lead">{c.description}</p><p className="muted">{guides.length} step-by-step guides</p><div className="topic-articles">{guides.map(a => <Link key={a.slug} href={articleHref(a.slug)}><FileText size={23}/><div><h2>{a.title}</h2><p>{a.description}</p><small>{a.steps.length} steps · {Math.max(2,Math.ceil(a.steps.join(' ').split(' ').length / 120))} min read</small></div><ArrowRight size={20}/></Link>)}</div><Link className="text-link" href="/#topics">Browse all topics <ArrowRight size={17}/></Link></main>; }
