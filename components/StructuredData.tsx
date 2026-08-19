import { projects } from "@/lib/projects";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://scalar-ai.co/#organization",
    name: "Scalar Inc.",
    legalName: "Scalar Inc.",
    alternateName: ["Scalar", "Scalar AI"],
    url: "https://scalar-ai.co",
    logo: {
      "@type": "ImageObject",
      url: "https://scalar-ai.co/scalar-assets/logo.png",
      caption: "Scalar Inc. Logo",
    },
    image: "https://scalar-ai.co/og-image.png",
    description:
      "Scalar Inc. is a product studio building production-grade AI systems for security, enterprise operations, education, and accessibility.",
    sameAs: ["https://www.linkedin.com/company/scalarinc"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "info@scalar-ai.co",
        contactType: "customer support",
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
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://scalar-ai.co/#website",
    url: "https://scalar-ai.co",
    name: "Scalar Inc.",
    description:
      "Scalar is a product studio building AI systems for security, enterprise operations, education, and accessibility.",
    publisher: {
      "@id": "https://scalar-ai.co/#organization",
    },
    inLanguage: "en-US",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://scalar-ai.co/#webpage",
    url: "https://scalar-ai.co",
    name: "Scalar Inc. — Built for what's next | AI Systems & Product Studio",
    description:
      "Scalar is a product studio building AI systems for security, enterprise operations, education, and accessibility.",
    isPartOf: {
      "@id": "https://scalar-ai.co/#website",
    },
    about: {
      "@id": "https://scalar-ai.co/#organization",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://scalar-ai.co/og-image.png",
      width: "1200",
      height: "630",
      caption: "Scalar Inc. — AI Systems & Engineering Product Studio",
    },
    inLanguage: "en-US",
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        position: 1,
        name: "Architecture & System Design",
        description:
          "System shape definition, boundaries, data flow, failure modes, and zero-downtime migration paths.",
        provider: { "@id": "https://scalar-ai.co/#organization" },
        serviceType: "Software Architecture & Systems Engineering",
      },
      {
        "@type": "Service",
        position: 2,
        name: "Applied AI & Machine Learning",
        description:
          "Production models for detection, extraction, forecasting, and generative intelligence evaluated against accuracy and cost constraints.",
        provider: { "@id": "https://scalar-ai.co/#organization" },
        serviceType: "Applied Machine Learning",
      },
      {
        "@type": "Service",
        position: 3,
        name: "Security Engineering",
        description:
          "Threat detection, vulnerability analysis, and compliance automation built directly into products and infrastructure.",
        provider: { "@id": "https://scalar-ai.co/#organization" },
        serviceType: "Cybersecurity Engineering",
      },
      {
        "@type": "Service",
        position: 4,
        name: "Platform & Cloud Infrastructure",
        description:
          "Provisioning, pipelines, GPU/CPU clusters, observability, and high-velocity cloud developer environments.",
        provider: { "@id": "https://scalar-ai.co/#organization" },
        serviceType: "Cloud Infrastructure Engineering",
      },
      {
        "@type": "Service",
        position: 5,
        name: "Product Delivery",
        description:
          "End-to-end interface and system implementation taken from architectural inception to active production usage.",
        provider: { "@id": "https://scalar-ai.co/#organization" },
        serviceType: "Product Engineering",
      },
    ],
  };

  const productCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Scalar Inc. Products in Motion",
    description: "Portfolio of AI products and systems developed by Scalar Inc.",
    itemListElement: projects.map((p, idx) => ({
      "@type": "SoftwareApplication",
      position: idx + 1,
      name: p.name,
      description: p.summary,
      applicationCategory: p.sector,
      operatingSystem: "Cloud / Web",
      author: {
        "@id": "https://scalar-ai.co/#organization",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStoreOnly",
      },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Scalar Inc.?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Scalar Inc. is an advanced product studio building production-grade AI systems across cybersecurity, enterprise operations, education, accessibility, and cloud platform infrastructure.",
        },
      },
      {
        "@type": "Question",
        name: "What capabilities and engineering services does Scalar provide?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Scalar provides technical leadership and end-to-end engineering across Architecture & System Design, Applied AI & Machine Learning, Security Engineering, Platform & Cloud Infrastructure, and Product Delivery.",
        },
      },
      {
        "@type": "Question",
        name: "What products is Scalar currently building?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Scalar is developing 12 specialized AI products including the AI Bug & Vulnerability Detector, AI Urdu Notes Assistant, AI RFP Processor, Network Threat Detection Engine, Automated Compliance Evidence Collection, Sign Language Companion, Cloud Fine-Tuning Platform, and more.",
        },
      },
      {
        "@type": "Question",
        name: "How do I get in touch with Scalar Inc.?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can email info@scalar-ai.co directly or submit an enquiry through the contact form at https://scalar-ai.co/#contact.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://scalar-ai.co",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productCatalogSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
