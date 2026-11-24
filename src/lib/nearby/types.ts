import type { Locale } from '@/i18n/routing';

export type Category = 'landmarks' | 'museums' | 'venues' | 'churches' | 'parks';
export type Area = 'garden' | 'square' | 'boulevard' | 'museumQuarter' | 'oldTown' | 'west' | 'district';
export type Access = 'outdoor' | 'exterior' | 'museum' | 'show' | 'worship' | 'garden';

export interface PlaceCopy {
  name: string;
  history: string;
  historyDetail?: string;
  highlight: string;
  photo: string;
  visit: string;
  detailQuestion: string;
  viewQuestion: string;
  caption: string;
  route?: string;
  operatorNote?: string;
}

export interface NearbyPlace {
  slug: string;
  mapName: string;
  category: Category;
  area: Area;
  access: Access;
  source: string;
  operator?: string;
  operatorUrl?: string;
  operatorEvidence?: string;
  historySource?: string;
  coordinates?: { lat: number; lng: number };
  image?: { path: string; credit: string; source: string; original?: string; heroPath?: string; heroSource?: string };
  copy: Record<Locale, PlaceCopy>;
}
