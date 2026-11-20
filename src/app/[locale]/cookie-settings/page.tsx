import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildAlternates, ogLocale } from '@/lib/seo';
import type { Metadata } from 'next';
import CookieSettingsClient from './CookieSettingsClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cookieSettings' });
  const title = t('title');
  const description = t('metaDescription');
  const alternates = buildAlternates('/cookie-settings', locale);

  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical, locale: ogLocale(locale), type: 'website' },
  };
}

export default async function CookiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookieSettingsClient />;
}
