import { generateOGImage } from 'fumadocs-ui/og';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (!slug || slug[slug.length - 1] !== 'image.png') {
    return new Response('Not Found', { status: 404 });
  }
  // Remove trailing 'image.png' and fallback to [] for the index page
  const pageSlug = slug.slice(0, -1);
  const page = source.getPage(pageSlug);
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: 'Powergems Wiki',
  });
}

// Note: No generateStaticParams here because Edge runtime cannot be combined
// with generateStaticParams for route handlers in Next.js 15.
