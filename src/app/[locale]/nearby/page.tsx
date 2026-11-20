import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NearbyNavigation, { textLink } from '@/components/nearby/NearbyNavigation';
import { Link, routing } from '@/i18n/routing';
import { buildAlternates, ogLocale } from '@/lib/seo';
import { NEARBY_PATH, PARK_MAP } from '@/lib/nearby';
import { labels } from '@/lib/nearby/labels';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const { title, description } = labels[locale];
  const alternates = buildAlternates(NEARBY_PATH, locale);

  return {
    title,
    description,
    keywords: [labels[locale].nearby, 'Chișinău', 'Ștefan cel Mare'],
    alternates,
    openGraph: { title, description, url: alternates.canonical, locale: ogLocale(locale), type: 'website' },
  };
}

export default async function NearbyPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = labels[locale];

  return (
    <>
      <Header solid />
      <main className="pt-16">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <Link href="/" className={textLink}>{t.home}</Link>
          <h1 className="my-4 font-display text-4xl font-bold sm:text-5xl">{t.title}</h1>
          <p className="max-w-2xl text-lg text-[var(--text-secondary)]">{t.description}</p>
          <a className={`mt-5 inline-block ${textLink}`} href={PARK_MAP}>{t.showMap} · {t.home}</a>
        </div>
        <NearbyNavigation locale={locale} />
      </main>
      <Footer />
    </>
  );
}
