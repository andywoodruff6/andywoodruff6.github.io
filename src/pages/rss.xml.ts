import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

const sections = ['ideas', 'predictions', 'curation', 'projects'] as const;

export async function GET(context: APIContext) {
  const all = (
    await Promise.all(
      sections.map(async (s) => {
        const entries = await getCollection(s, ({ data }) => !data.draft);
        return entries.map((e) => ({ ...e, section: s }));
      })
    )
  ).flat();

  all.sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));

  return rss({
    title: 'Andy Woodruff',
    description: 'Andy Woodruff — bringing self-sovereign identity to 100M people by 2034. Ideas, predictions, projects, and curation.',
    site: context.site!,
    items: all.map((e) => ({
      title: e.data.title,
      pubDate: e.data.date,
      description: e.data.description ?? '',
      link: `/${e.section}/${e.id}/`,
    })),
  });
}
