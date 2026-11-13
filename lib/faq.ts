import { projects } from "@/lib/projects";

export interface Faq {
  question: string;
  answer: string;
}

/**
 * Single source for the FAQ. Rendered visibly by components/FAQ.tsx and emitted
 * as FAQPage JSON-LD by components/StructuredData.tsx — structured data must
 * match what visitors can actually read, so never mark up a question here that
 * the page doesn't show.
 */
const inBuild = projects.filter((p) => p.status === "In build").length;

export const faqs: Faq[] = [
  {
    question: "What is Scalar Inc.?",
    answer:
      "Scalar Inc. is a product studio that designs and builds AI systems for cybersecurity, enterprise operations, education, accessibility, and cloud platform infrastructure. A small senior team owns each product end to end, from architecture through to production.",
  },
  {
    question: "What engineering services does Scalar provide?",
    answer:
      "Scalar provides technical leadership and end-to-end engineering across five capabilities: Architecture & System Design, Applied AI & Machine Learning, Security Engineering, Platform & Cloud Infrastructure, and Product Delivery.",
  },
  {
    question: "What products is Scalar currently building?",
    answer: `Scalar has ${projects.length} AI products in motion, ${inBuild} of them in active build, including the AI Bug & Vulnerability Detector, AI Urdu Notes Assistant, AI RFP Processor, AI Network Threat Detection, Automated Compliance Evidence Collection, and a Cloud Fine-Tuning Platform.`,
  },
  {
    question: "How do I get in touch with Scalar Inc.?",
    answer:
      "Email info@scalar-ai.co or send an enquiry through the contact form on this page. We reply to every enquiry and will tell you honestly whether we're the right team for the problem.",
  },
];
