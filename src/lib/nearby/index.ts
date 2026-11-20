import type { Locale } from '@/i18n/routing';
import type { NearbyPlace } from './types';
import data from './places';

export const NEARBY_PATH = '/nearby';
export const PARK_MAP = 'https://maps.app.goo.gl/8LzxATcmZkTe2biT7';
export const places: readonly NearbyPlace[] = data;
export const categories = ['landmarks', 'museums', 'venues', 'churches', 'parks'] as const;

export function placePath(slug: string) {
  return `${NEARBY_PATH}/${slug}`;
}

export function findPlace(slug: string) {
  return places.find((place) => place.slug === slug);
}

export function relatedPlaces(place: NearbyPlace) {
  return places
    .filter((other) => other.slug !== place.slug)
    .sort((a, b) => affinity(b, place) - affinity(a, place))
    .slice(0, 3);
}

function affinity(a: NearbyPlace, b: NearbyPlace) {
  return Number(a.area === b.area) * 2 + Number(a.category === b.category);
}

export function mapLinks(mapName: string, locale: Locale) {
  const destination = mapName.includes('Chișinău') ? `${mapName}, Moldova` : `${mapName}, Chișinău, Moldova`;
  const origin = 'Grădina Publică Ștefan cel Mare și Sfânt, Chișinău, Moldova';
  const query = encodeURIComponent(destination);
  const route = new URLSearchParams({ api: '1', origin, destination });
  return {
    place: `https://www.google.com/maps/search/?api=1&query=${query}`,
    embed: `https://maps.google.com/maps?hl=${locale}&q=${query}&z=16&output=embed`,
    walk: `https://www.google.com/maps/dir/?${route}&travelmode=walking`,
    transit: `https://www.google.com/maps/dir/?${route}&travelmode=transit`,
    district: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Chișinău, Moldova')}`,
  };
}
