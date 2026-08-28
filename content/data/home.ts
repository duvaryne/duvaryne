/**
 * Home page copy deck.
 *
 * The home page is a composed React page, not MDX — its sections are structural, not prose.
 * All copy lives here so it can be edited without touching layout code.
 *
 * Voice: CTO / business outcome. Every number carries a `source` pointing at the case study
 * it came from — nothing on this page is an unsourced claim.
 */

export const home = {
  meta: {
    title: "AWS & DevOps Consulting in Bengaluru | Duvaryne",
    description:
      "Senior-led AWS and DevOps consulting from Bengaluru. Migration, Kubernetes, CI/CD and cost optimisation delivered by the engineer who reviews your account. Free 30-min review.",
  },

  hero: {
    eyebrow: "Optimize · Automate · Innovate",
    h1: "AWS Cloud & DevOps Consulting in Bengaluru, India",
    // Subhead does the positioning work the old site's four generic feature cards were doing.
    sub: "We cut cloud bills, ship pipelines that deploy on a Friday, and hand it all over as code you own. Senior engineers only — the person who reviews your account is the person who does the work.",
    primaryCta: {
      label: "Book a free 30-minute review",
      href: "https://calendly.com/abhinav-duvaryne/30min",
    },
    secondaryCta: { label: "See how we work", href: "/case-studies" },
    // Credibility strip under the fold line — replaces the old "Expert Team" card.
    trustLine:
      "DPIIT-recognised · CKA · AWS Solutions Architect – Associate · IIT Madras DevOps · 13 years hands-on",
  },

  /**
   * Signature element — §3.4 of the tech spec.
   * Slider for monthly AWS spend; models the 30–50% waste band cited on /services/aws-cloud.
   * Uses the 21st.dev ProgressBar (re-tokenised per §4.3).
   */
  spendTeardown: {
    heading: "What is your AWS account actually wasting?",
    body: "Most unoptimised accounts carry 30–50% waste. Drag to your monthly spend to see the band. We find the real number from your Cost and Usage Report in thirty minutes.",
    sliderLabel: "Monthly AWS spend",
    resultTemplate:
      "On {spend}/month, an unoptimised account typically carries {low}–{high} of recoverable waste.",
    disclaimer:
      "Modelled from the 30–50% range we observe across engagements. Your real number comes from your CUR, not a slider.",
    cta: { label: "Find my real number", href: "https://calendly.com/abhinav-duvaryne/30min" },
  },

  proof: {
    heading: "Outcomes, not adjectives",
    body: "Every number below came out of a production engagement. Client identities are withheld under NDA; the architecture and the results are described as delivered.",
    stats: [
      {
        value: "50–60%",
        label: "Compute spend cut on a production EKS estate",
        source: "karpenter-spot-eks-cost-optimisation",
      },
      {
        value: "4 min → 45 s",
        label: "Node provisioning time after Karpenter",
        source: "karpenter-spot-eks-cost-optimisation",
      },
      {
        value: "< 15 min",
        label: "Recovery time objective, multi-region failover",
        source: "multi-region-disaster-recovery-argocd-aurora-global",
      },
      {
        value: "90%",
        label: "Fewer after-hours pages",
        source: "event-driven-remediation-prometheus-lambda",
      },
      {
        value: "80%",
        label: "Less release overhead",
        source: "containerised-cicd-jenkins-docker",
      },
      {
        value: "99.99%",
        label: "Uptime on a re-architected multi-AZ workload",
        source: "three-tier-aws-architecture-event-driven-automation",
      },
    ],
  },

  services: {
    heading: "Three things we do properly",
    body: "Not a menu of everything. These are the engagements we take because they are the ones we can point at evidence for.",
    items: [
      {
        title: "AWS Cloud",
        href: "/services/aws-cloud",
        summary:
          "Landing zones, migration, security and managed support. Built as Terraform in your repository, under your account — the handover is a git clone.",
        proof: "50–60% compute spend cut",
      },
      {
        title: "DevOps & Platform Engineering",
        href: "/services/devops",
        summary:
          "CI/CD, Kubernetes where it is warranted, GitOps, supply-chain signing and observability that reduces pages instead of generating them.",
        proof: "80% less release overhead",
      },
      {
        title: "Cost Optimisation",
        href: "/aws-cost-optimization",
        summary:
          "We read your Cost and Usage Report, find the waste, and put in the controls that stop it coming back two quarters later.",
        proof: "30–50% typical waste found",
      },
    ],
  },

  caseStudies: {
    heading: "Selected engagements",
    body: "Ten production builds, described in full technical detail. Client names withheld under NDA — everything else is on the page.",
    featured: [
      "karpenter-spot-eks-cost-optimisation",
      "multi-region-disaster-recovery-argocd-aurora-global",
      "zero-trust-supply-chain-cosign-kyverno",
    ],
    linkLabel: "Read all ten case studies",
    href: "/case-studies",
  },

  // The only place on the site that keeps 01/02/03 numbering — this genuinely is a sequence.
  process: {
    heading: "How an engagement starts",
    steps: [
      {
        n: "01",
        title: "Thirty minutes, free",
        body: "Your architecture and your bill. No deck, no discovery phase you pay for.",
      },
      {
        n: "02",
        title: "Written scope, fixed price",
        body: "You see exactly what gets built and what it costs before anything begins. No hourly meter.",
      },
      {
        n: "03",
        title: "Built with your engineers",
        body: "Embedded delivery, documented as we go. Infrastructure as Code in your repository throughout.",
      },
      {
        n: "04",
        title: "Handed over, or held",
        body: "Runbooks and a handover, or a monthly retainer as your fractional platform function. Your call.",
      },
    ],
  },

  credibility: {
    heading: "Who you are actually hiring",
    body: "Duvaryne is a DPIIT-recognised consultancy in Bengaluru, Karnataka. Engineering is led by a Certified Kubernetes Administrator who also holds the AWS Certified Solutions Architect – Associate certification and a DevOps credential from IIT Madras, with thirteen years of production infrastructure experience. We work across India and remotely with teams in the US and EU.",
    linkLabel: "More about how we work",
    href: "/about",
  },

  closingCta: {
    heading: "Start with the bill, not a proposal",
    body: "Thirty minutes on your architecture and your Cost and Usage Report. You leave with the three largest savings in your account, quantified. If there is nothing worth doing, we will tell you.",
    buttonLabel: "Book a free 30-minute review",
    href: "https://calendly.com/abhinav-duvaryne/30min",
    secondary: { label: "contact@duvaryne.com", href: "mailto:contact@duvaryne.com" },
  },
} as const;

export type Home = typeof home;
