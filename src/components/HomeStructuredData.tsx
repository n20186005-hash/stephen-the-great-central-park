import { getTranslations } from 'next-intl/server';
import { BASE_URL } from '@/lib/seo';

export default async function HomeStructuredData({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: 'basicInfo' });
  const th = await getTranslations({ locale, namespace: 'hero' });
  const ti = await getTranslations({ locale, namespace: 'intro' });

  const rating = parseFloat(th('rating'));
  const reviewCount = parseInt(th('reviewCount').replace(/[^0-9]/g, ''), 10);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: t('officialNameValue'),
    alternateName: th('title'),
    description: ti('description'),
    image: `${BASE_URL}/gallery/stephen-the-great-central-park%20(1).jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ștefan cel Mare și Sfânt Boulevard 148',
      addressLocality: 'Chișinău',
      addressCountry: 'MD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 47.0186,
      longitude: 28.8246,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: 5,
    },
    sameAs: ['https://maps.app.goo.gl/8LzxATcmZkTe2biT7'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
