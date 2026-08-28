import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { sections } from "@/lib/phase";
import { OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Duvaryne case study";

export function generateStaticParams() {
  return sections.caseStudies ? getCaseStudies().map((c) => ({ slug: c.slug })) : [];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);

  return renderOgImage({
    eyebrow: "Case Study",
    title: cs?.h1 ?? "Case study",
    // The headline metric is the first sentence of the outcome line — the fact that
    // should be legible in a LinkedIn card at thumbnail size.
    metric: cs?.outcomeHeadline.split(". ").slice(0, 2).join(". "),
  });
}
