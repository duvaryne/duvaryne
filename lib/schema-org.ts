import { absoluteUrl, site } from "./site";
import type { Faq } from "./content-schema";

/**
 * Typed JSON-LD builders — SPEC §10.1. No plugin, no runtime dependency.
 *
 * The old site had none of this (defect 21). AI search engines resolve entities by
 * exact-string consistency, so every `name` below comes from lib/site.ts rather than
 * being re-typed.
 */

type Json = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const PERSON_ID = `${site.url}/about/#founder`;

export function organizationSchema(): Json {
  return { "@type": ["Organization", "ProfessionalService"], "@id": ORG_ID,
    name: site.name,
    // The registered entity is `name`; `legalName` repeats it explicitly because some
    // consumers read only one of the two and the pair must never disagree.
    legalName: site.name,
    // An array, not a string: a bare "duvaryne" and the full registered name have to
    // resolve to this same node, and the only way to assert that is to list both.
    alternateName: [...site.alternateNames],
    url: site.url,
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.founded),
    description: "Senior-led AWS and DevOps consulting from Bengaluru. Cloud migration, Kubernetes, CI/CD and cost optimisation.",
    address: { "@type": "PostalAddress",
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: site.areaServed.map((c) => ({ "@type": "Country", name: c })),
    award: "DPIIT-recognised startup (Government of India)",
    founder: { "@id": PERSON_ID },
    // Topical scope of the organisation itself, distinct from the founder's `knowsAbout`.
    // This is what ties the entity to "AWS" and "DevOps" as subjects rather than as words
    // that merely happen to appear in the page copy.
    knowsAbout: [
      "Amazon Web Services",
      "AWS cloud migration",
      "DevOps",
      "Kubernetes",
      "CI/CD",
      "Infrastructure as Code",
      "Terraform",
      "Cloud cost optimisation",
      "Site reliability engineering",
    ],
    hasOfferCatalog: { "@type": "OfferCatalog",
      name: `${site.shortName} services`,
      itemListElement: site.services.map((s) => ({ "@type": "Offer",
        itemOffered: { "@id": `${absoluteUrl(s.path)}#service` },
      })),
    },
    contactPoint: { "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phone,
      areaServed: [...site.areaServed],
      availableLanguage: ["en"],
      url: absoluteUrl("/contact"),
    },
    sameAs: Object.values(site.social),
  };
}

export function websiteSchema(): Json {
  return { "@type": "WebSite", "@id": SITE_ID,
    url: site.url,
    // The site name a search engine should print under the result, which is the brand and
    // not the registered entity. `alternateName` carries the long form.
    name: site.shortName,
    alternateName: site.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    // No `potentialAction`/SearchAction here on purpose. Declaring one commits the site to
    // a working /search/?q= endpoint, and there is no search route — a sitelinks searchbox
    // pointing at a 404 is worse than none, and Google drops the markup either way.
  };
}

/** SPEC §9.4 — the largest single E-E-A-T and GEO gain available to this site. */
export function personSchema(): Json {
  return { "@type": "Person", "@id": PERSON_ID,
    name: site.founder.name,
    jobTitle: site.founder.jobTitle,
    worksFor: { "@id": ORG_ID },
    url: absoluteUrl("/about"),
    sameAs: [site.social.linkedin],
    knowsAbout: [ "Amazon Web Services", "Kubernetes", "DevOps", "Infrastructure as Code", "Cloud cost optimisation", "Site reliability engineering",
    ],
    hasCredential: site.founder.credentials.map((c) => ({ "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
  };
}

export function localBusinessSchema(): Json {
  return { "@type": "ProfessionalService", "@id": `${site.url}/contact/#localbusiness`,
    name: site.name,
    image: `${site.url}/opengraph-image`,
    url: absoluteUrl("/contact"),
    email: site.email,
    // ONE phone number — the old site published three different ones (defects 6, 7).
    telephone: site.phone,
    priceRange: "$$",
    address: { "@type": "PostalAddress",
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: site.areaServed.map((c) => ({ "@type": "Country", name: c })),
    parentOrganization: { "@id": ORG_ID },
    sameAs: Object.values(site.social),
  };
}

export function serviceSchema({
  name,
  description,
  serviceType,
  path,
}: {
  name: string;
  description: string;
  serviceType?: string;
  path: string;
}): Json {
  return { "@type": "Service", "@id": `${absoluteUrl(path)}#service`,
    name,
    description,
    serviceType: serviceType ?? name,
    provider: { "@id": ORG_ID },
    areaServed: site.areaServed.map((c) => ({ "@type": "Country", name: c })),
    url: absoluteUrl(path),
  };
}

export function faqPageSchema(faqs: Faq[]): Json | null {
  if (!faqs.length) return null;
  return { "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema({
  title,
  description,
  path,
  published,
  updated,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  published: Date;
  updated: Date;
  tags?: string[];
}): Json {
  const url = absoluteUrl(path);
  return { "@type": "Article", "@id": `${url}#article`,
    headline: title,
    description,
    url,
    datePublished: published.toISOString(),
    dateModified: updated.toISOString(),
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    image: `${url}opengraph-image`,
    keywords: tags?.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isAccessibleForFree: true,
  };
}

export function caseStudyArticleSchema({
  title,
  description,
  path,
  updated,
  stack,
}: {
  title: string;
  description: string;
  path: string;
  updated: Date;
  stack: string[];
}): Json {
  const url = absoluteUrl(path);
  return { "@type": "Article", "@id": `${url}#article`,
    headline: title,
    description,
    url,
    datePublished: updated.toISOString(),
    dateModified: updated.toISOString(),
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    image: `${url}opengraph-image`,
    keywords: stack.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return { "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({ "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function webPageSchema({
  type,
  title,
  description,
  path,
  updated,
}: {
  type: "WebPage" | "AboutPage" | "ContactPage";
  title: string;
  description: string;
  path: string;
  updated: Date;
}): Json {
  const url = absoluteUrl(path);
  return { "@type": type, "@id": `${url}#webpage`,
    name: title,
    description,
    url,
    dateModified: updated.toISOString(),
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    ...(type === "AboutPage" ? { mainEntity: { "@id": PERSON_ID } } : {}),
  };
}

/** Wraps builders into one @graph so a page emits a single <script> tag. */
export function graph(...nodes: (Json | null)[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes.filter((n): n is Json => n !== null),
  });
}
