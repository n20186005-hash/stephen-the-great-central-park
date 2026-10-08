import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { buildAlternates, BASE_URL, TOPIC_PATHS } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

type TopicKey = keyof typeof TOPIC_PATHS;

export default async function TopicPage({
  topicKey,
  locale,
}: {
  topicKey: TopicKey;
  locale: string;
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'topics' });
  const topic = t.raw(topicKey) as {
    title: string;
    description: string;
    intro: string;
    sections: { id: string; title: string; content: string }[];
    relatedTitle: string;
    related: { title: string; desc: string; href: string }[];
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
        name: 'Home',
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

      <section className="section-padding pt-28 sm:pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--accent)' }}>
              Home
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
              {topic.related.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as any}
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
        </div>
      </section>
    </>
  );
}
