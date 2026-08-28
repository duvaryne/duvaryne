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
