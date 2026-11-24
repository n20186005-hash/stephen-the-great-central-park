import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { guideLabels } from '@/lib/nearby/guide-labels';
import Footer from '@/components/Footer';
import { PlaceLink, panel, textLink } from '@/components/nearby/NearbyNavigation';
import { Link, routing } from '@/i18n/routing';
import { buildAlternates, ogLocale } from '@/lib/seo';
import { findPlace, mapLinks, placePath, relatedPlaces } from '@/lib/nearby';
import { labels } from '@/lib/nearby/labels';

type Props = { params: Promise<{ locale: string; slug: string }> };

// Render known slugs through the application worker even when its prerender cache is cold.
export const dynamic = 'force-dynamic';

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
  const links = mapLinks(place, locale);
  const g = guideLabels[locale];
  const faq = [
    [copy.detailQuestion, copy.highlight],
    [copy.viewQuestion, copy.photo],
    [t.planningQuestion(copy.name), copy.visit],
  ];
  const sections = [
    [g.history, copy.historyDetail ?? copy.history],
    [t.highlight, copy.highlight],
    [t.route, copy.route ?? t.areas[place.area]],
    [t.visit, copy.visit],
    [t.photo, copy.photo],
    [g.stay, g[place.area]],
  ];

  return (
    <>
      <Header />
      <main>
        {place.image && <Hero place={{name: copy.name, subtitle: copy.highlight, type: t.categories[place.category],
          map: links.place, image: place.image.heroPath ?? place.image.path, alt: copy.caption}} />}
        <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label={t.nearby} className="mb-5 flex flex-wrap gap-x-3 text-sm">
            <Link href="/" className={textLink}>{t.home}</Link>
            <span aria-hidden="true">/</span>
            <Link href={{ pathname: '/nearby', hash: place.category }} className={textLink}>{t.categories[place.category]}</Link>
          </nav>
          {!place.image && <h1 className="mb-5 font-display text-4xl font-bold sm:text-5xl">{copy.name}</h1>}
          <p className="mb-3 text-lg text-[var(--text-secondary)]">{copy.route}</p>
          <p className="mb-4 text-[var(--text-secondary)]">{t.categories[place.category]} · Chișinău</p>
          <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t.access[place.access]}</p>
          <a className={textLink} href={links.place}>{t.showMap} · {t.reviews}</a>
          <aside className={`my-8 p-5 sm:p-6 ${panel}`}>
            <h2 className="mb-2 font-display text-2xl font-semibold">{t.about(copy.name)}</h2>
            <p className="mb-3 text-[var(--text-secondary)]">{copy.history}</p>

            <h3 className="mb-1 font-semibold">{t.manager}</h3>
            <p className="mb-2">
              {place.operatorUrl ? <a className={textLink} href={place.operatorUrl}>{place.operator}</a> : place.operator || copy.operatorNote || t.pendingManager}
            </p>
            {place.operatorEvidence && (
              <p className="mb-2"><a className={textLink} href={place.operatorEvidence}>{t.evidence}</a></p>
            )}
            <p className="mb-2 text-[var(--text-secondary)]">{t.access[place.access]}</p>
            <a href={place.source} className={textLink}>{t.source}</a>
            {place.historySource && (
              <p className="mt-2"><a className={textLink} href={place.historySource}>{t.historySource}</a></p>
            )}
          </aside>
          <section className={`my-8 p-5 sm:p-6 ${panel}`}>
            <h2 className="mb-3 font-display text-2xl font-semibold">{t.basic}</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">{t.entrance}</dt>
                <dd>{place.mapName} · Chișinău, Moldova</dd>
              </div>
              <div>
                <dt className="font-semibold">{t.duration}</dt>
                <dd>{t.time[place.access]}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold">{t.admission}</dt>
                <dd>{t.access[place.access]}</dd>
              </div>
            </dl>
          </section>
          <div className="my-8 grid gap-6 sm:grid-cols-2">
            <section className={`p-5 ${panel}`}><h2 className="mb-2 font-display text-2xl font-semibold">{g.hours}</h2>
              <p>{t.access[place.access]}</p><a className={textLink} href={place.operatorUrl ?? place.source}>{place.operator ?? t.source}</a></section>
            <section className={`p-5 ${panel}`}><h2 className="mb-2 font-display text-2xl font-semibold">{g.cost}</h2><p>{g.fees[place.access]}</p></section>
          </div>
          {place.image ? (
            <figure className="my-8"><h2 className="mb-3 font-display text-2xl font-semibold">{g.gallery}</h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={place.image.path} alt={place.image.heroPath ? t.photoCaption(copy.name) : copy.caption} className="max-h-[55vh] w-full rounded-xl object-contain" />
              <figcaption className="mt-2 text-sm">{place.image.heroPath ? t.photoCaption(copy.name) : copy.caption} · <a className={textLink} href={place.image.source}>{place.image.credit}</a>{place.image.original && <> · <a className={textLink} href={place.image.original}>{g.oldImage}</a></>}</figcaption>
            </figure>
          ) : (
            <div className="my-8 grid min-h-[37vh] place-items-center rounded-xl bg-[var(--bg-tertiary)] px-4 text-center text-[var(--text-muted)]">
              {t.pendingImage}
            </div>
          )}
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
          <section className={`my-8 p-5 sm:p-6 ${panel}`}>
            <h2 className="mb-3 font-display text-2xl font-semibold">{g.itinerary}</h2>
            <ol className="list-decimal ps-5 space-y-2"><li>{copy.route ?? t.areas[place.area]}</li><li>{copy.highlight}</li><li>{copy.visit}</li></ol>
          </section>
          <section className={`my-8 p-5 sm:p-6 ${panel}`}>
            <h2 className="mb-3 font-display text-2xl font-semibold">{t.reviews}</h2><a className={textLink} href={links.place}>{t.reviews} · {copy.name}</a>
          </section>
          <section className={`my-10 p-5 sm:p-6 ${panel}`}>
            <h2 className="mb-4 font-display text-2xl font-semibold">{t.faq}</h2>
            <dl className="space-y-4">
              {faq.map(([question, answer]) => (
                <div key={question}>
                  <dt className="font-semibold">{question}</dt>
                  <dd>{answer}</dd>
                </div>
              ))}
              <div>
                <dt className="font-semibold">{t.parkQuestion(copy.name)}</dt>
                <dd>
                  <p>{t.areas[place.area]} {t.entrance} — {place.mapName}.</p>
                  <a href={links.walk} className={textLink}>{t.walk}</a> · <a href={links.transit} className={textLink}>{t.transit}</a>
                </dd>
              </div>
            </dl>
          </section>
          <p className="my-6 text-sm">{g.checked} · 2026-11-24 · <a href={place.source} className={textLink}>{t.source}</a></p>
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
