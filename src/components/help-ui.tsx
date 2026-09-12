'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, Sun, Moon, Menu, X, ArrowRight, BookOpen, Rocket, Plane, FileText, Wallet, ChartNoAxesCombined, Users, ChevronRight, Check, Copy } from 'lucide-react';
import { articles, categories, articleHref } from '@/lib/content';

export function TopicIcon({ name, size = 23 }: { name: string; size?: number }) {
  const Icon = ({ rocket: Rocket, plane: Plane, file: FileText, wallet: Wallet, chart: ChartNoAxesCombined, users: Users } as Record<string, typeof Rocket>)[name] || BookOpen;
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
export function Header() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const value = localStorage.getItem('inyice-help-theme') === 'dark'; setDark(value); document.documentElement.dataset.theme = value ? 'dark' : 'light'; }, []);
  function toggle() { const value = !dark; setDark(value); document.documentElement.dataset.theme = value ? 'dark' : 'light'; localStorage.setItem('inyice-help-theme', value ? 'dark' : 'light'); }
  return <header className="header"><div className="container header-inner"><Link className="brand" href="/" aria-label="inYice Help Center home"><span className="brand-word">inYice<span className="brand-dot">.</span></span><span className="brand-divider"/><span className="brand-label">Help Center</span></Link><nav aria-label="Main navigation" className={open ? 'nav is-open' : 'nav'}><Link onClick={() => setOpen(false)} href="/pages">Help by page</Link><Link onClick={() => setOpen(false)} href="/articles/first-booking">Quick start guide</Link><a href="https://inyice.com" className="site-link">Go to inYice <ArrowUpRight size={15}/></a></nav><button className="icon-button theme-button" onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun size={19}/> : <Moon size={19}/>}</button><button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X/> : <Menu/>}</button></div></header>;
}
export function SearchBox({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { function key(event: KeyboardEvent) { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); input.current?.focus(); } if (event.key === 'Escape') { setQuery(''); input.current?.blur(); } } window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, []);
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = terms.length ? articles.filter(a => terms.every(t => `${a.title} ${a.description} ${a.path} ${a.steps.join(' ')} ${a.note}`.toLowerCase().includes(t))).sort((a, b) => {
    const score = (item: typeof a) => terms.reduce((sum, term) => sum + (item.title.toLowerCase().includes(term) ? 3 : 0) + (item.path.toLowerCase().includes(term) ? 2 : 0), 0);
    return score(b) - score(a);
  }) : [];
  return <div className={`search-wrap ${compact ? 'compact' : ''}`}><div className="search-box"><Search size={23}/><input ref={input} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for a guide, topic, or question…" aria-label="Search help articles" aria-controls="search-results" autoComplete="off"/>{query ? <button className="icon-button" onClick={() => { setQuery(''); input.current?.focus(); }} aria-label="Clear search"><X size={18}/></button> : <kbd>Ctrl K</kbd>}</div>{terms.length > 0 && <div id="search-results" className="search-results"><p className="result-label" role="status">{results.length} {results.length === 1 ? 'guide' : 'guides'} found</p>{results.slice(0, 8).map(a => <Link key={a.slug} href={articleHref(a.slug)} onClick={() => setQuery('')}><FileText size={19}/><span><strong>{a.title}</strong><small>{a.description}</small></span><ChevronRight size={17}/></Link>)}{results.length === 0 && <p className="empty-search">Try “invoice”, “GDS”, “customer receipt”, or a shorter search.</p>}</div>}</div>;
}
export function TopicCards() { return <div className="topic-grid">{categories.map(c => <Link className="topic-card" href={`/topics/${c.slug}`} key={c.slug}><span className={`topic-icon ${c.color}`}><TopicIcon name={c.icon}/></span><h3>{c.title}</h3><p>{c.description}</p><div className="card-bottom"><span>{articles.filter(a => a.category === c.slug).length} guides</span><ArrowRight size={18}/></div></Link>)}</div>; }
export function ArticleTools({ slug }: { slug: string }) {
  const [vote, setVote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setVote(localStorage.getItem(`help-vote-${slug}`)); }, [slug]);
  function feedback(value: string) { localStorage.setItem(`help-vote-${slug}`, value); setVote(value); }
  async function copy() { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } }
  return <div className="article-tools"><div><strong>Was this guide helpful?</strong><div className="feedback-buttons"><button aria-pressed={vote === 'yes'} onClick={() => feedback('yes')}>Yes, thank you</button><button aria-pressed={vote === 'no'} onClick={() => feedback('no')}>Not quite</button></div>{vote && <small role="status">Your preference is saved on this device.{vote === 'no' && <> <a href="https://inyice.com/contact">Contact the inYice team for help.</a></>}</small>}</div><button className="copy-button" onClick={copy}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Link copied' : 'Copy guide link'}</button></div>;
}

