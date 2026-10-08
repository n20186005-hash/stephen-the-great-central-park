import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['zh', 'en', 'ro', 'es'],
  defaultLocale: 'en',
  localePrefix: {
    mode: 'always',
  },
  pathnames: {
    '/': '/',
    '/privacy-policy': '/privacy-policy',
    '/terms-of-service': '/terms-of-service',
    '/cookie-settings': '/cookie-settings',
    '/things-to-do-in-chisinau': {
      en: '/things-to-do-in-chisinau',
      ro: '/obiective-turistice-chisinau',
      zh: '/things-to-do-in-chisinau',
      es: '/things-to-do-in-chisinau',
    },
    '/parks-in-chisinau': {
      en: '/parks-in-chisinau',
      ro: '/parcuri-chisinau',
      zh: '/parks-in-chisinau',
      es: '/parks-in-chisinau',
    },
    '/park-history': {
      en: '/stephen-the-great-park-history',
      ro: '/istoria-parcului',
      zh: '/park-history',
      es: '/park-history',
    },
    '/park-map': {
      en: '/stephen-the-great-park-map',
      ro: '/harta-parcului',
      zh: '/park-map',
      es: '/park-map',
    },
  },
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
