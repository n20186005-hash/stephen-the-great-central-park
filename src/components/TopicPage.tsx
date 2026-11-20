import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, routing } from '@/i18n/routing';
import { buildAlternates, BASE_URL, TOPIC_PATHS } from '@/lib/seo';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { labels } from '@/lib/nearby/labels';
import { findPlace, PARK_MAP } from '@/lib/nearby';
import { PlaceLink, textLink } from './nearby/NearbyNavigation';
import Header from './Header';
import Footer from './Footer';

type TopicKey = keyof typeof TOPIC_PATHS;
type TopicPath = (typeof TOPIC_PATHS)[TopicKey];

const topicPlaces: Record<TopicKey, string[]> = {
  thingsToDo: ['triumphal-arch', 'city-hall', 'national-history-museum'],
  parks: ['cathedral-square', 'valea-morilor', 'dendrarium', 'la-izvor'],
  parkHistory: ['stephen-monument', 'alley-of-classics'],
  parkMap: ['nativity-cathedral', 'national-history-museum'],
};

export default async function TopicPage({
  topicKey,
  locale,
}: {
  topicKey: TopicKey;
  locale: string;
}) {
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const labelsForLocale = labels[locale];
  const t = await getTranslations({ locale, namespace: 'topics' });
  const topic = t.raw(topicKey) as {
    title: string;
    description: string;
    intro: string;
    sections: { id: string; title: string; content: string }[];
    relatedTitle: string;
    related: { title: string; desc: string; href: TopicPath }[];
  };

  const { canonical } = buildAlternates(TOPIC_PATHS[topicKey], locale);
  const homeUrl = locale === 'en' ? BASE_URL + '/en' : BASE_URL + '/' + locale;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: labelsForLocale.home,
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: topic.title,
        item: canonical,
      },
    ],
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    description: topic.description,
    inLanguage: locale,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />

      <Header solid />
      <main className="section-padding pt-28 sm:pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--accent)' }}>
              {labelsForLocale.home}
            </Link>
            <span className="mx-2">/</span>
            <span style={{ color: 'var(--text-secondary)' }}>{topic.title}</span>
          </nav>

          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {topic.title}
          </h1>

          <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            {topic.intro}
          </p>

          {topicKey === 'parkMap' && (
            <a href={PARK_MAP} className={`mb-8 inline-block ${textLink}`}>{labelsForLocale.showMap}</a>
          )}

          <div className="space-y-10">
            {topic.sections.map((section) => (
              <div key={section.id}>
                <h2
                  className="font-display text-2xl sm:text-3xl font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {section.title}
                </h2>
                <div className="w-12 h-0.5 mb-4" style={{ background: 'var(--accent)' }} />
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-xl p-6 sm:p-8" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <h2 className="font-display text-xl font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
              {topic.relatedTitle}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/nearby" className="block rounded-lg p-4 font-semibold text-[var(--accent)] hover:underline">
                {labelsForLocale.all}
              </Link>
              {topic.related.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg p-4 transition-shadow hover:shadow-md"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                >
                  <div className="font-semibold mb-1" style={{ color: 'var(--accent)' }}>
                    {item.title}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <section className="mt-10">
            <h2 className="mb-4 font-display text-xl font-semibold">{labelsForLocale.related}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {topicPlaces[topicKey].map((slug) => {
                const place = findPlace(slug);
                return place && <li key={slug}><PlaceLink place={place} locale={locale} /></li>;
              })}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
