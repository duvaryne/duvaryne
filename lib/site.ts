/**
 * Single source of truth for every fact that appears in more than one place.
 *
 * Nothing below may be re-typed into a component. Duplicating these values across
 * templates is how sites end up with three different phone numbers and two different
 * LinkedIn URLs.
 *
 * Entity-consistency rule: `name` is spelled identically here, in JSON-LD, in the footer,
 * on LinkedIn. AI search engines resolve entities by exact-string matching,
 * so "Duvaryne" and "DuVaryne" must not be used interchangeably.
 *
 * Two names, deliberately: `name` is the registered entity and belongs in JSON-LD, the
 * legal pages and anywhere a statement of incorporation is being made. `shortName` is the
 * brand and is what every other surface says. Do not use "Duvaryne LLP" — it is neither.
 */
export const site = {
  /** Registered entity. Legal pages, JSON-LD, statements of incorporation. */
  name: "Duvaryne Technologies LLP",
  shortName: "Duvaryne",

  /** The lockup, exactly as the identity sets it. Both lines are always uppercase. */
  wordmark: "DUVARYNE",
  wordmarkSub: "TECHNOLOGIES LLP",
  url: "https://duvaryne.com",
  email: "contact@duvaryne.com",

  /**
   * Every spelling of the brand a person might type or a search engine might encounter.
   *
   * "Duvaryne" is a coined word with no dictionary meaning, which is the best possible
   * starting position for a branded query — nothing else competes for it. The risk is the
   * opposite one: a search engine that has only ever seen "Duvaryne Technologies LLP" may
   * not confidently resolve a bare "duvaryne" to the same entity, and vice versa. Listing
   * the variants as `alternateName` states outright that they are one organisation.
   *
   * Order matters only in that `name` (the registered entity) is not repeated here.
   */
  alternateNames: [
    "Duvaryne",
    "Duvaryne Technologies",
    "Duvaryne LLP",
    "duvaryne.com",
  ],

  phone: "+91 95179 71933",
  phoneHref: "tel:+919517971933",

  locality: "Bengaluru",
  region: "Karnataka",
  country: "IN",
  countryName: "India",

  calendly: "https://calendly.com/abhinav-duvaryne/30min",

  social: {
    linkedin: "https://www.linkedin.com/company/duvaryne",
  },

  founded: 2025,

  /** Named founder. A specialist consultancy is bought on the credentials of the person doing the work. */
  founder: {
    name: "Abhinav Banerjee",
    jobTitle: "Founder & Principal Engineer",
    yearsExperience: 13,
    credentials: [
      {
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "The Linux Foundation",
        short: "CKA",
      },
      {
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        short: "AWS SAA",
      },
      {
        name: "Advanced Certification in DevOps",
        issuer: "IIT Madras",
        short: "IIT Madras DevOps",
      },
    ],
  },

  /** Rendered under the hero and in the footer. Kept here so it cannot drift. */
  trustSignals: [ "DPIIT-recognised", "CKA", "AWS Solutions Architect – Associate", "IIT Madras DevOps", "13 years hands-on",
  ],

  /**
   * Primary AWS regions. Deliberately NOT surfaced as a standalone claim anywhere.
   *
   * Stating "primary regions: ap-south-1, ap-south-2" with nothing beside it reads as
   * "India-only vendor" to a US or EU buyer, and prices the work before they have read a
   * sentence. Where regions are mentioned in copy (see services/aws-cloud.mdx) they are
   * always paired with US and EU coverage, and framed as a data-residency capability
   * rather than a limit. Keep it that way.
   */
  regions: ["ap-south-1 (Mumbai)", "ap-south-2 (Hyderabad)"],
  areaServed: ["IN", "US", "EU"],

  /**
   * The service catalogue, as offered rather than as navigated.
   *
   * This is deliberately not derived from `serviceNav` in lib/nav.ts. That list is a
   * menu — it is ordered for a human scanning a header, and it includes "Engagement
   * Models", which is a pricing page and not a service anyone buys. This list is the
   * commercial offer, and it is what feeds `hasOfferCatalog` in the Organization schema.
   *
   * `serviceType` values are the words a buyer actually searches, which is why they read
   * "AWS Cloud Consulting" rather than the site's own shorter nav label.
   */
  services: [
    {
      name: "AWS Cloud Consulting",
      serviceType: "AWS Cloud Consulting",
      path: "/services/aws-cloud/",
      description:
        "AWS landing zones, cloud migration, security baselines and managed support for production accounts.",
    },
    {
      name: "DevOps & Platform Engineering",
      serviceType: "DevOps Consulting",
      path: "/services/devops/",
      description:
        "CI/CD pipelines, Kubernetes, GitOps and software supply-chain signing, built to be handed over.",
    },
    {
      name: "AWS Cost Optimisation",
      serviceType: "Cloud Cost Optimisation",
      path: "/aws-cost-optimization/",
      description:
        "Cost and Usage Report analysis, waste removal and the guardrails that stop the spend returning.",
    },
    {
      name: "IT Consultation",
      serviceType: "IT Consulting",
      path: "/services/it-consultation/",
      description:
        "Architecture review and a second senior opinion on a decision that is expensive to get wrong.",
    },
  ],
} as const;

export type Site = typeof site;

/**
 * The site's base URL, normalised and guaranteed parseable.
 *
 * NEXT_PUBLIC_SITE_URL is typed by hand into a hosting dashboard, and the obvious
 * mistake is to enter "duvaryne.com" with no scheme. That value reaches `new URL()` in
 * the root layout's metadataBase and throws `TypeError: Invalid URL`, failing the whole
 * build with an error that names neither the variable nor the value. A misconfigured env
 * var must degrade to the correct default, never break the build.
 */
let warnedAboutSiteUrl = false;

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return site.url;

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(candidate);
    return `${url.protocol}//${url.host}`;
  } catch {
    if (!warnedAboutSiteUrl) {
      warnedAboutSiteUrl = true;
      console.warn(
        `[site] NEXT_PUBLIC_SITE_URL is not a valid URL (${raw}); falling back to ${site.url}`,
      );
    }
    return site.url;
  }
}

/** Absolute URL builder. Every canonical, OG and JSON-LD URL goes through this. */
export function absoluteUrl(path = "/"): string {
  const base = siteUrl();
  if (!path.startsWith("/")) path = `/${path}`;
  const withSlash = path === "/" || path.endsWith("/") ? path : `${path}/`;
  return `${base}${withSlash}`;
}
