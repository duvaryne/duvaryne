import { getPost, getPosts } from "@/lib/content";
import { sections } from "@/lib/phase";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Duvaryne engineering blog";

export function generateStaticParams() {
  return sections.blog ? getPosts().map((p) => ({ slug: p.slug })) : [];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  return renderOgImage({
    eyebrow: post?.tags[0] ?? "Engineering",
    title: post?.h1 ?? "Notes from production",
    metric: post ? `${post.readingMinutes} min read · Abhinav Banerjee` : undefined,
  });
}
