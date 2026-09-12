import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
// The wildcard includes search and AI crawlers. Avoid narrower groups that
// accidentally override these permissions for a particular user agent.
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') }; }
