import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { buildAlternates, TOPIC_PATHS } from '@/lib/seo';

const locales = routing.locales as readonly string[];

const contentPaths = ['/', ...Object.values(TOPIC_PATHS)];
const legalPaths = ['/privacy-policy', '/terms-of-service', '/cookie-settings'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of [...contentPaths, ...legalPaths]) {
    for (const locale of locales) {
      const { canonical, languages } = buildAlternates(path, locale);
      entries.push({
        url: canonical,
        alternates: { languages },
      });
    }
  }

  return entries;
}
