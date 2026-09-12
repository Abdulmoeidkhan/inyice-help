import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/help-ui';
import './globals.css';
import { site, absoluteUrl } from '@/lib/site';
import { pageMetadata } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
export const metadata: Metadata = {
  ...pageMetadata(site.title, site.description, '/'),
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s | inYice Help Center' },
  applicationName: site.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  icons: { icon: '/images/logo.png' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><StructuredData data={{ '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': 'https://inyice.com/#organization', name: 'inYice', url: 'https://inyice.com', logo: absoluteUrl('/images/logo.png') },
    { '@type': 'WebSite', '@id': site.url + '/#website', url: site.url + '/', name: site.name, description: site.description, inLanguage: 'en', publisher: { '@id': 'https://inyice.com/#organization' } },
  ] }}/><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<footer className="footer"><div className="container footer-inner"><Link href="/" className="brand-word">inYice<span className="brand-dot">.</span></Link><p>Clarity for every step of your journey.</p><a href="https://inyice.com">inYice website <ArrowUpRight size={14}/></a><span>© {new Date().getFullYear()} inYice</span></div></footer></body></html>; }
