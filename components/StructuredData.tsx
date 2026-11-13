import { projects } from "@/lib/projects";
import { faqs } from "@/lib/faq";

const SITE = "https://scalar-ai.co";
const ORG = `${SITE}/#organization`;

const DESCRIPTION =
  "Scalar is a product studio building AI systems for security, enterprise operations, education, and accessibility.";

const SERVICES = [
  {
    name: "Architecture & System Design",
    description:
      "System shape definition, boundaries, data flow, failure modes, and zero-downtime migration paths.",
    serviceType: "Software Architecture & Systems Engineering",
  },
  {
    name: "Applied AI & Machine Learning",
    description:
      "Production models for detection, extraction, forecasting, and generative intelligence evaluated against accuracy and cost constraints.",
    serviceType: "Applied Machine Learning",
  },
  {
    name: "Security Engineering",
    description:
      "Threat detection, vulnerability analysis, and compliance automation built directly into products and infrastructure.",
    serviceType: "Cybersecurity Engineering",
  },
  {
    name: "Platform & Cloud Infrastructure",
    description:
      "Provisioning, pipelines, GPU/CPU clusters, observability, and high-velocity cloud developer environments.",
    serviceType: "Cloud Infrastructure Engineering",
  },
  {
    name: "Product Delivery",
    description:
      "End-to-end interface and system implementation taken from architectural inception to active production usage.",
    serviceType: "Product Engineering",
  },
];

// schema.org applicationCategory values Google recognises, keyed by track.
const CATEGORY: Record<string, string> = {
  Security: "SecurityApplication",
  Enterprise: "BusinessApplication",
  Education: "EducationalApplication",
  Accessibility: "LifestyleApplication",
  Platforms: "DeveloperApplication",
};

export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG,
        name: "Scalar Inc.",
        legalName: "Scalar Inc.",
        alternateName: ["Scalar", "Scalar AI"],
        url: SITE,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE}/#logo`,
          url: `${SITE}/icon-512.png`,
          width: 512,
          height: 512,
          caption: "Scalar Inc. logo",
        },
        image: `${SITE}/og-image.png`,
        description:
          "Scalar Inc. is a product studio building production-grade AI systems for security, enterprise operations, education, and accessibility.",
        sameAs: ["https://www.linkedin.com/company/scalarinc"],
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: "info@scalar-ai.co",
            contactType: "sales",
            availableLanguage: ["English", "Urdu"],
          },
        ],
        knowsAbout: [
          "Artificial Intelligence",
          "Cybersecurity",
          "Applied Machine Learning",
          "Enterprise Automation",
          "Cloud Infrastructure",
          "Compliance Automation",
          "Software Architecture",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        // Drives the site name shown above the URL in Google results. `alternateName`
        // gives Google shorter fallbacks it may prefer over the full legal name.
        name: "Scalar Inc.",
        alternateName: ["Scalar", "Scalar AI"],
        description: DESCRIPTION,
        publisher: { "@id": ORG },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE}/#webpage`,
        url: SITE,
        name: "Scalar Inc. — Product Studio Building AI Systems",
        description: DESCRIPTION,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": ORG },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE}/og-image.png`,
          width: 1200,
          height: 630,
          caption: "Scalar Inc. — AI Systems & Engineering Product Studio",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/#services`,
        name: "Scalar Inc. Capabilities",
        itemListElement: SERVICES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            ...s,
            provider: { "@id": ORG },
          },
        })),
      },
      {
        // No `offers`: these products are in development, not on sale. Claiming
        // a price or availability that doesn't exist is misleading markup.
        "@type": "ItemList",
        "@id": `${SITE}/#products`,
        name: "Scalar Inc. Products in Motion",
        description: "Portfolio of AI products and systems in development at Scalar Inc.",
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: p.name,
            description: p.summary,
            applicationCategory: CATEGORY[p.track] ?? "BusinessApplication",
            applicationSubCategory: p.sector,
            operatingSystem: "Web",
            creativeWorkStatus: p.status === "Concept" ? "Concept" : "In development",
            author: { "@id": ORG },
          },
        })),
      },
      {
        // Mirrors the visible FAQ section (components/FAQ.tsx), same source data.
        "@type": "FAQPage",
        "@id": `${SITE}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
