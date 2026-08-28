import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

/**
 * Metadata builders — SPEC §10.2.
 *
 *   title        <= 60 chars, keyword-first, " | Duvaryne" suffix
 *   description  150-160 chars, hand-written, contains a reason to click
 *   canonical    self-referencing, apex host, trailing slash
 *   og:image     1200x630 from next/og
 *
 * Lengths are enforced by zod at content-load time, so this file only assembles.
 */

const SUFFIX = ` | ${site.shortName}`;

/** Appends the brand suffix unless the hand-written title already carries it. */
export function withSuffix(title: string): string {
  return title.includes(site.shortName) ? title : `${title}${SUFFIX}`;
}

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
  ogImage,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: Date;
  modifiedTime?: Date;
  authors?: string[];
  noIndex?: boolean;
  ogImage?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const full = withSuffix(title);
  const image = ogImage ?? `${url}opengraph-image`;

  return {
    title: full,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    openGraph: {
      type,
      url,
      title: full,
      description,
      siteName: site.name,
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(type === "article"
        ? {
            publishedTime: publishedTime?.toISOString(),
            modifiedTime: modifiedTime?.toISOString(),
            authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: [image],
    },
  };
}

/** Human-readable date for bylines and "Updated" lines. Fixed locale = stable SSR output. */
export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
