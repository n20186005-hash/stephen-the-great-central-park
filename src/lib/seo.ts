import { routing } from '@/i18n/routing';

export const BASE_URL = 'https://www.stephenthegreatcentralpark.com';

export const TOPIC_PATHS = {
  thingsToDo: '/things-to-do-in-chisinau',
  parks: '/parks-in-chisinau',
  parkHistory: '/park-history',
  parkMap: '/park-map',
} as const;

const locales = routing.locales as readonly string[];

function localize(path: string, locale: string): string {
  const entry = (routing.pathnames as Record<string, any> | undefined)?.[path];
  if (!entry || typeof entry === 'string') return path;
  return entry[locale] ?? path;
}

function localePrefix(locale: string): string {
  return locale === 'en' ? '/en' : '/' + locale;
}

function fullUrl(path: string, locale: string): string {
  const prefix = localePrefix(locale);
  if (path === '/') return BASE_URL + prefix;
  return BASE_URL + prefix + localize(path, locale);
}

export function buildAlternates(path: string, locale: string) {
  const canonical = fullUrl(path, locale);
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = fullUrl(path, loc);
  }
  languages['x-default'] = fullUrl(path, 'en');
  return { canonical, languages };
}

export function ogLocale(locale: string): string {
  return locale === 'zh' ? 'zh_CN' : locale === 'ro' ? 'ro_RO' : locale === 'es' ? 'es_ES' : 'en_US';
}

export function htmlLang(locale: string): string {
  return locale === 'zh' ? 'zh-CN' : locale === 'ro' ? 'ro' : locale === 'es' ? 'es' : 'en';
}
