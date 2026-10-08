import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import TopicPage from '@/components/TopicPage';
import { buildAlternates, ogLocale, TOPIC_PATHS } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'topics' });
  const topic = t.raw('thingsToDo') as { title: string; description: string };
  const { canonical, languages } = buildAlternates(TOPIC_PATHS.thingsToDo, locale);
  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical, languages },
    openGraph: {
      title: topic.title,
      description: topic.description,
      url: canonical,
      siteName: 'Stephen the Great Central Park',
      locale: ogLocale(locale),
      type: 'article',
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TopicPage topicKey="thingsToDo" locale={locale} />;
}
