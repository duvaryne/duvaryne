import { sections } from "./phase";

export type NavLink = { label: string; href: string; description?: string };

/**
 * The navigation graph, declared once. Header, footer and sitemap all read this, so
 * "Project" vs "Case Studies" can never diverge between templates again (defect 11).
 *
 * Entries gated by `sections.*` disappear entirely when their content is not in the
 * production build — a nav link to a 404 is worse than no link.
 */
const all: (NavLink & { enabled: boolean })[] = [
  { label: "Services", href: "/services/", enabled: true },
  { label: "Case Studies", href: "/case-studies/", enabled: sections.caseStudies },
  { label: "Products", href: "/products/", enabled: true },
  { label: "Blog", href: "/blog/", enabled: sections.blog },
  { label: "About", href: "/about/", enabled: true },
  { label: "FAQ", href: "/faq/", enabled: true },
  { label: "Contact", href: "/contact/", enabled: true },
];

export const primaryNav: NavLink[] = all
  .filter((l) => l.enabled)
  .map(({ label, href, description }) => ({ label, href, description }));

export const serviceNav: NavLink[] = [
  {
    label: "AWS Cloud",
    href: "/services/aws-cloud/",
    description: "Landing zones, migration, security and managed support.",
  },
  {
    label: "DevOps & Platform",
    href: "/services/devops/",
    description: "CI/CD, Kubernetes, GitOps and supply-chain signing.",
  },
  {
    label: "Cost Optimisation",
    href: "/aws-cost-optimization/",
    description: "Read the CUR, cut the waste, keep it from coming back.",
  },
  {
    label: "IT Consultation",
    href: "/services/it-consultation/",
    description: "Architecture review and a second senior opinion.",
  },
  {
    label: "Engagement Models",
    href: "/engagement-models/",
    description: "How we scope, price and deliver. Fixed price, written first.",
  },
  /**
   * Listed here so the page is not an orphan. It is in the sitemap either way, but a page
   * nothing links to collects no internal link equity and ranks accordingly — and the
   * footer renders this list on every page, which is the cheapest way to fix that without
   * adding a top-level nav item for an audience segment.
   */
  {
    label: "For US Companies",
    href: "/aws-consulting-us/",
    description: "Fixed USD pricing, calls in US hours, compliance-driven builds.",
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy/" },
  { label: "Terms of Service", href: "/legal/terms/" },
];
