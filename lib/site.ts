/**
 * Single source of truth for every fact that appears in more than one place.
 *
 * Nothing below may be re-typed into a component. The predecessor site (alvionixedge.com)
 * carried three different phone numbers and two different LinkedIn URLs across its
 * templates because these values lived in the templates themselves.
 *
 * Entity-consistency rule: `name` is spelled identically here, in JSON-LD, in the footer,
 * on LinkedIn and on GitHub. AI search engines resolve entities by exact-string matching,
 * so "Duvaryne", "Duvaryne LLP" and "DuVaryne" must not be used interchangeably.
 */
export const site = {
  name: "Duvaryne LLP",
  shortName: "Duvaryne",
  url: "https://duvaryne.com",
  email: "hello@duvaryne.com",

  phone: "+91 95179 71933",
  phoneHref: "tel:+919517971933",

  locality: "Bengaluru",
  region: "Karnataka",
  country: "IN",
  countryName: "India",

  calendly: "https://calendly.com/hello-duvaryne/30min",

  social: {
    linkedin: "https://www.linkedin.com/company/duvaryne",
    x: "https://x.com/duvaryne",
    github: "https://github.com/duvaryne",
  },

  /**
   * The practice was founded in 2025 and traded as Alvionix Edge LLP until 2026, when it
   * was renamed Duvaryne. The delivery record on this site is that same practice's work.
   * Stating the former name once, here, is what lets a reader reconcile the case studies
   * with the older references they may find elsewhere.
   */
  founded: 2025,
  formerName: "Alvionix Edge LLP",
  renamedIn: 2026,

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
  trustSignals: [
    "DPIIT-recognised",
    "CKA",
    "AWS Solutions Architect – Associate",
    "IIT Madras DevOps",
    "13 years hands-on",
  ],

  /** Primary AWS regions — drives `areaServed` in schema and the copy on service pages. */
  regions: ["ap-south-1 (Mumbai)", "ap-south-2 (Hyderabad)"],
  areaServed: ["IN", "US", "EU"],
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
