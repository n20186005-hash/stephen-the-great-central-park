import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { categories, places } from '@/lib/nearby';
import { labels } from '@/lib/nearby/labels';
import type { NearbyPlace } from '@/lib/nearby/types';

export const panel = 'rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]';
export const textLink = 'font-medium text-[var(--accent)] underline underline-offset-4 hover:no-underline';

export function PlaceLink({ place, locale }: { place: NearbyPlace; locale: Locale }) {
  return (
    <Link
      href={{ pathname: '/nearby/[slug]', params: { slug: place.slug } }}
      className={`block h-full p-4 font-display text-lg font-semibold text-[var(--accent)] hover:underline ${panel}`}
    >
      {place.copy[locale].name}
    </Link>
  );
}

export default function NearbyNavigation({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = labels[locale];
  return (
    <section className="section-padding bg-[var(--bg-secondary)]" id="nearby">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {compact && (
          <>
            <h2 className="mb-3 font-display text-3xl font-semibold sm:text-4xl">{t.nearby}</h2>
            <p className="mb-6 text-[var(--text-secondary)]">{t.description}</p>
          </>
        )}
        <nav aria-label={t.nearby} className="flex flex-wrap gap-x-5 gap-y-3">
          {categories.map((category) => (
            <Link key={category} href={{ pathname: '/nearby', hash: category }} className={textLink}>
              {t.categories[category]}
            </Link>
          ))}
        </nav>
        {compact ? (
          <Link href="/nearby" className={`mt-6 inline-block ${textLink}`}>{t.all}</Link>
        ) : (
          categories.map((category) => (
            <section key={category} id={category} className="mt-12 scroll-mt-24">
              <h2 className="mb-4 font-display text-2xl font-semibold">{t.categories[category]}</h2>
              <ul className="grid auto-rows-fr gap-3 sm:grid-cols-2 md:grid-cols-3">
                {places.filter((place) => place.category === category).map((place) => (
                  <li key={place.slug}><PlaceLink place={place} locale={locale} /></li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </section>
  );
}
