import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PlaceLink, panel, textLink } from '@/components/nearby/NearbyNavigation';
import { Link, routing } from '@/i18n/routing';
import { buildAlternates, ogLocale } from '@/lib/seo';
import { findPlace, mapLinks, placePath, places, relatedPlaces } from '@/lib/nearby';
import { labels } from '@/lib/nearby/labels';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return places.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const place = findPlace(slug);
  if (!place) notFound();

  const copy = place.copy[locale];
  const title = `${copy.name} | Chișinău`;
  const description = copy.highlight;
  const alternates = buildAlternates(placePath(slug), locale);
  return {
    title,
    description,
    keywords: [copy.name, labels[locale].categories[place.category], 'Chișinău'],
    alternates,
    openGraph: { title, description, url: alternates.canonical, locale: ogLocale(locale), type: 'article' },
  };
}

export default async function PlacePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const place = findPlace(slug);
  if (!place) notFound();
  setRequestLocale(locale);

  const t = labels[locale];
  const copy = place.copy[locale];
  const links = mapLinks(place.mapName, locale);
  const sections = [
    [t.history, copy.history],
    [t.highlight, copy.highlight],
    [t.route, t.areas[place.area]],
    [t.visit, copy.visit],
    [t.photo, copy.photo],
  ];

  return (
    <>
      <Header solid />
      <main className="pt-16">
        <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label={t.nearby} className="mb-5 flex flex-wrap gap-x-3 text-sm">
            <Link href="/" className={textLink}>{t.home}</Link>
            <span aria-hidden="true">/</span>
            <Link href={{ pathname: '/nearby', hash: place.category }} className={textLink}>{t.categories[place.category]}</Link>
          </nav>
          <h1 className="mb-5 font-display text-4xl font-bold sm:text-5xl">{copy.name}</h1>
          <p className="mb-6 text-lg text-[var(--text-secondary)]">{t.categories[place.category]} · Chișinău</p>
          <a className={textLink} href={links.place}>{t.showMap}</a>
          {place.image ? (
            <figure className="my-8">
              {/* External photographs are only used when the place and credit have been checked. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={place.image.path} alt={copy.name} className="max-h-[55vh] w-full rounded-xl object-contain" />
              <figcaption className="mt-2 text-sm"><a className={textLink} href={place.image.source}>{place.image.credit}</a></figcaption>
            </figure>
          ) : (
            <div className="my-8 grid min-h-[37vh] place-items-center rounded-xl bg-[var(--bg-tertiary)] px-4 text-center text-[var(--text-muted)]">
              {t.pendingImage}
            </div>
          )}
          <aside className={`mb-10 p-5 sm:p-6 ${panel}`}>
            <h2 className="mb-2 font-display text-2xl font-semibold">{t.manager}</h2>
            <p className="mb-2">
              {place.operatorUrl ? <a className={textLink} href={place.operatorUrl}>{place.operator}</a> : place.operator || t.pendingManager}
            </p>
            <a href={place.source} className={textLink}>{t.source}</a>
          </aside>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-7">
              {sections.map(([heading, content]) => (
                <section key={heading}>
                  <h2 className="mb-2 font-display text-2xl font-semibold">{heading}</h2>
                  <p className="leading-relaxed text-[var(--text-secondary)]">{content}</p>
                </section>
              ))}
            </div>
            <section>
              <h2 className="mb-2 font-display text-2xl font-semibold">{t.map}</h2>
              <p className="mb-3">{place.mapName} · Chișinău, Moldova</p>
              <iframe
                className="aspect-[4/3] w-full rounded-xl border border-[var(--border-color)]"
                src={links.embed}
                title={`${t.map} · ${copy.name}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <ul className="mt-3 space-y-2">
                <li><a href={links.walk} className={textLink}>{t.walk}</a></li>
                <li><a href={links.transit} className={textLink}>{t.transit}</a></li>
                <li><a href={links.district} className={textLink}>{t.district}</a></li>
              </ul>
            </section>
          </div>
          <section className={`my-10 p-5 sm:p-6 ${panel}`}>
            <h2 className="mb-4 font-display text-2xl font-semibold">{t.faq}</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold">{t.accessQuestion}</dt>
                <dd>{t.access[place.access]}</dd>
              </div>
              <div>
                <dt className="font-semibold">{t.parkQuestion}</dt>
                <dd><a href={links.walk} className={textLink}>{t.walk}</a> · <a href={links.transit} className={textLink}>{t.transit}</a></dd>
              </div>
            </dl>
          </section>
          <section>
            <h2 className="mb-4 font-display text-2xl font-semibold">{t.related}</h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {relatedPlaces(place).map((other) => (
                <li key={other.slug}><PlaceLink place={other} locale={locale} /></li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
