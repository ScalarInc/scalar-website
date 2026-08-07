export type Track =
  | "Security"
  | "Enterprise"
  | "Education"
  | "Accessibility"
  | "Platforms";

export interface Project {
  slug: string;
  index: string;
  name: string;
  lead: string;
  sector: string;
  kind: "Product" | "Service";
  track: Track;
  status: "In build" | "Concept";
  summary: string;
  problem?: string;
  audience?: string;
}

/**
 * Source: scalar-assests/projects.xlsx
 * Copy lightly edited for consistency of tense and punctuation.
 */
export const projects: Project[] = [
  {
    slug: "ai-bug-vulnerability-detector",
    index: "01",
    name: "AI Bug & Vulnerability Detector",
    lead: "Abdullah",
    sector: "Cybersecurity",
    kind: "Product",
    track: "Security",
    status: "In build",
    summary:
      "AI that scans a codebase, predicts where vulnerabilities are likely to surface, and proposes concrete fixes.",
    problem: "Developers miss security flaws.",
    audience: "Developers, startups, companies",
  },
  {
    slug: "ai-urdu-notes-assistant",
    index: "02",
    name: "AI Urdu Notes Assistant",
    lead: "Abdullah",
    sector: "EdTech / Productivity",
    kind: "Product",
    track: "Education",
    status: "In build",
    summary:
      "Records lectures and meetings, converts Urdu and mixed Urdu-English speech into structured notes with headings and summaries, and exports clean PDFs.",
    problem:
      "Students and professionals struggle to take organised notes while listening, often missing key points and wasting time rewriting messy notes later.",
    audience:
      "University students, teachers, and professionals who attend meetings regularly",
  },
  {
    slug: "ai-rfp-processor",
    index: "03",
    name: "AI RFP Processor",
    lead: "Ahmed",
    sector: "Enterprise AI / GovTech",
    kind: "Product",
    track: "Enterprise",
    status: "In build",
    summary:
      "Automates the complete analysis, structuring and response lifecycle of Requests for Proposal.",
    problem:
      "Organisations spend significant time manually reviewing lengthy and complex RFP documents. Critical requirements are scattered across sections, increasing the risk of missed obligations, compliance gaps, pricing errors and delayed submissions.",
    audience:
      "Enterprise sales and bid management teams, government contractors and system integrators",
  },
  {
    slug: "smart-ops",
    index: "04",
    name: "Smart Ops",
    lead: "Abdullah",
    sector: "BusinessTech",
    kind: "Product",
    track: "Enterprise",
    status: "In build",
    summary:
      "Connects spreadsheets to a central system that tracks changes, enforces structure, auto-processes data and handles sharing, version control and report distribution — while teams keep working in Excel.",
    problem:
      "Businesses rely on messy Excel files shared manually, leading to errors, duplication, lack of visibility and inefficiency.",
    audience: "SMEs, hotels, restaurants, small companies",
  },
  {
    slug: "network-threat-detection",
    index: "05",
    name: "AI Network Threat Detection",
    lead: "Ahmed",
    sector: "Cybersecurity / Network Analytics",
    kind: "Product",
    track: "Security",
    status: "In build",
    summary:
      "Analyses network flow logs to detect, classify and investigate cybersecurity threats in real time.",
    problem:
      "Threat detection and analysis stay manual, stretching response time and leaving gaps in network visibility.",
    audience:
      "Security Operations Centres, cybersecurity teams, managed security providers, enterprises and government agencies",
  },
  {
    slug: "compliance-evidence-platform",
    index: "06",
    name: "Automated Compliance Evidence Collection",
    lead: "Ahmed",
    sector: "RegTech / Compliance Automation",
    kind: "Product",
    track: "Enterprise",
    status: "In build",
    summary:
      "Continuously gathers, validates and organises the evidence needed for audits and certifications.",
    problem:
      "Manual evidence gathering dominates audit preparation, costing weeks and introducing accuracy risk.",
    audience:
      "Compliance teams, internal auditors, risk managers, regulated enterprises and consulting firms",
  },
  {
    slug: "sign-language-companion",
    index: "07",
    name: "Sign Language Companion",
    lead: "Hasnain",
    sector: "Mobile / Accessibility",
    kind: "Service",
    track: "Accessibility",
    status: "Concept",
    summary:
      "An app that reads sign language and lets deaf users communicate with people who don't sign — combining computer vision, speech-to-text, text-to-speech and language models. A long-horizon build.",
    audience: "Deaf and hard-of-hearing users",
  },
  {
    slug: "cloud-fine-tuning-platform",
    index: "08",
    name: "Cloud Fine-Tuning Platform",
    lead: "Safwan",
    sector: "Cloud Infrastructure",
    kind: "Service",
    track: "Platforms",
    status: "In build",
    summary:
      "Cloud-based virtual pods for generating data and fine-tuning models on demand.",
    problem:
      "Accessible infrastructure for data generation and fine-tuning on virtual CPUs and GPUs is hard to come by.",
    audience: "AI developers, data scientists, ML engineers",
  },
  {
    slug: "ai-shorts-generation",
    index: "09",
    name: "AI Shorts Generation",
    lead: "Safwan",
    sector: "AI Content",
    kind: "Product",
    track: "Platforms",
    status: "In build",
    summary:
      "Generates explainer videos and short-form stories, then publishes them straight to YouTube, Instagram and other channels through automation.",
    problem: "Manual video creation and uploading takes too much time.",
    audience: "Content creators, marketers",
  },
  {
    slug: "3d-virtual-rooms",
    index: "10",
    name: "3D Virtual Room Experience",
    lead: "Hasnain",
    sector: "TravelTech",
    kind: "Service",
    track: "Platforms",
    status: "In build",
    summary:
      "Turns real hotel rooms into interactive 3D tours from ordinary phone or camera capture, so guests can walk a room before they book it.",
    problem:
      "Hotel sites rely on static, sometimes misleading 2D images. Guests don't trust what they see, which drives poor booking decisions, bad reviews and cancellations.",
    audience: "Hotels, Airbnb hosts, resorts, travel agencies",
  },
  {
    slug: "playhub-courtbook",
    index: "11",
    name: "PlayHub / CourtBook",
    lead: "Hasnain",
    sector: "SportsTech",
    kind: "Product",
    track: "Platforms",
    status: "In build",
    summary:
      "One app listing every futsal, football and padel court in a city, with live availability and instant slot booking.",
    problem:
      "Booking runs on calls and WhatsApp, which produces double bookings, confusion, no transparency and wasted time.",
    audience: "Court owners, players",
  },
  {
    slug: "special-education-case-manager",
    index: "12",
    name: "AI Special Education Case Manager",
    lead: "Ali Taha",
    sector: "EdTech / Special Education",
    kind: "Product",
    track: "Education",
    status: "In build",
    summary:
      "An agent system that automates IEP drafting, progress monitoring, compliance tracking, parent communication and meeting coordination for special education teachers in K-12 schools.",
    problem:
      "Special education teachers spend 60% of their time on paperwork instead of teaching. Children with disabilities don't receive the services they are legally entitled to, and districts lose both teachers and due process lawsuits.",
    audience:
      "Directors of Special Education at mid-sized US public school districts (5,000–15,000 students), case managers and special education teachers",
  },
  {
    slug: "hotel-management-simulator",
    index: "13",
    name: "AI Hotel Management Simulator",
    lead: "Ahmed",
    sector: "EdTech / Hospitality",
    kind: "Product",
    track: "Education",
    status: "In build",
    summary:
      "A training simulator that replicates hotel management workflows, using intelligent agents to play guests, staff operations and system behaviour.",
    problem:
      "Hands-on training normally requires access to expensive enterprise systems, so most students never touch the real workflow.",
    audience:
      "Hospitality students, hotel management institutes, training academies and entry-level staff onboarding",
  },
  {
    slug: "ai-life-companion",
    index: "14",
    name: "AI Life Companion for Disabled Kids",
    lead: "Ali Taha",
    sector: "SpecialNeeds / EdTech",
    kind: "Product",
    track: "Accessibility",
    status: "In build",
    summary:
      "One app that manages daily routines, practises therapy goals through games, supports communication, tracks behaviour, and connects parents with therapists and schools.",
    problem:
      "Families manage a disabled child's life across 16 fragmented apps and notebooks. Therapists work in silos, children don't get consistent support, and parents burn out.",
    audience:
      "Parents of children with autism, ADHD or Down syndrome, therapy providers and special education teachers",
  },
];

export const tracks: Track[] = [
  "Security",
  "Enterprise",
  "Education",
  "Accessibility",
  "Platforms",
];

export const leads = Array.from(new Set(projects.map((p) => p.lead)));
