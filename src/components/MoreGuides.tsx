import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { TOPIC_PATHS } from '@/lib/seo';

const ORDER = [
  { key: 'thingsToDo', path: TOPIC_PATHS.thingsToDo },
  { key: 'parks', path: TOPIC_PATHS.parks },
  { key: 'parkHistory', path: TOPIC_PATHS.parkHistory },
  { key: 'parkMap', path: TOPIC_PATHS.parkMap },
] as const;

export default async function MoreGuides() {
  const tg = await getTranslations('guides');
  const tt = await getTranslations('topics');

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {tg('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          {tg('subtitle')}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {ORDER.map(({ key, path }) => {
            const topic = tt.raw(key) as { title: string; description: string };
            return (
              <Link
                key={path}
                href={path}
                className="block rounded-xl p-5 sm:p-6 transition-shadow hover:shadow-md"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
              >
                <div className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--accent)' }}>
                  {topic.title}
                </div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {topic.description}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
