import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { NEARBY_PATH, placePath, places } from '@/lib/nearby';
import { buildAlternates, TOPIC_PATHS } from '@/lib/seo';

const locales = routing.locales as readonly string[];

const contentPaths = ['/', ...Object.values(TOPIC_PATHS), NEARBY_PATH, ...places.map(({ slug }) => placePath(slug))];
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
