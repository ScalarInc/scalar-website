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
 *
 * `index` is derived from position rather than stored, so adding or removing
 * a project renumbers the whole list automatically.
 */
const raw: Omit<Project, "index">[] = [
  {
    slug: "ai-bug-vulnerability-detector",
    name: "AI Bug & Vulnerability Detector",
    lead: "Abdullah",
    sector: "Cybersecurity",
    kind: "Product",
    track: "Security",
    status: "In build",
    summary:
      "An autonomous code intelligence engine that performs deep semantic analysis across entire repositories to detect zero-days, memory safety issues, logic flaws, and supply chain risks before code reaches production. Beyond flagging anomalies, it generates validated, pull-request-ready refactors with full test context.",
    problem:
      "Modern software teams ship under intense velocity pressure, causing critical security flaws, race conditions, and architectural oversights to bypass conventional static analysis tools. Manual security audits are slow, expensive, and fail to scale with rapid release cycles.",
    audience:
      "Software engineering teams, cybersecurity auditors, DevSecOps units, fast-scaling technology startups, and enterprise software platforms.",
  },
  {
    slug: "ai-urdu-notes-assistant",
    name: "AI Urdu Notes Assistant",
    lead: "Abdullah",
    sector: "EdTech / Productivity",
    kind: "Product",
    track: "Education",
    status: "In build",
    summary:
      "A bilingual AI note-taking intelligence platform specifically fine-tuned for code-switched Urdu and English (Urdish) audio streams. It transcribes, organizes, and distills live lectures and corporate meetings into structured hierarchical notes, key decision items, action matrices, and formatted PDF summaries.",
    problem:
      "Standard voice-to-text tools fail entirely when handling code-switched bilingual dialogue (Urdu-English dialect blend). Students and professionals lose crucial contextual nuances during fast-paced lectures and boardroom discussions, spending hours attempting to transcribe and structure fragmented manual notes.",
    audience:
      "University students, academic faculties, corporate executive teams, research personnel, and multilingual organizations operating in South Asia.",
  },
  {
    slug: "ai-rfp-processor",
    name: "AI RFP Processor",
    lead: "Ahmed",
    sector: "Enterprise AI / GovTech",
    kind: "Product",
    track: "Enterprise",
    status: "In build",
    summary:
      "An end-to-end enterprise bidding intelligence system that ingests multi-hundred-page Request for Proposal (RFP) documents, parses technical and legal compliance matrices, extracts key deliverables, and drafts hyper-accurate proposal responses using historical win data and internal knowledge bases.",
    problem:
      "Enterprise sales and proposal teams spend weeks manually sifting through complex 200+ page tenders. Unstructured requirements lead to compliance oversights, misaligned pricing models, missed submission deadlines, and lower proposal win rates.",
    audience:
      "Enterprise bid desks, defense and government contractors, system integrators, legal compliance officers, and global consulting firms.",
  },
  {
    slug: "network-threat-detection",
    name: "AI Network Threat Detection",
    lead: "Ahmed",
    sector: "Cybersecurity / Network Analytics",
    kind: "Product",
    track: "Security",
    status: "In build",
    summary:
      "A high-throughput threat analysis engine that processes gigabytes of network telemetry and flow logs in real time. Applying unsupervised anomaly detection and graph neural networks, it identifies lateral movement, exfiltration patterns, rogue nodes, and sophisticated APTs with sub-second alert latency.",
    problem:
      "Traditional Security Information and Event Management (SIEM) systems trigger thousands of false positive alerts daily, overwhelming SOC analysts while sophisticated attackers hide within normal baseline network traffic.",
    audience:
      "Security Operations Centers (SOCs), enterprise cybersecurity teams, Managed Security Service Providers (MSSPs), financial institutions, and critical infrastructure providers.",
  },
  {
    slug: "compliance-evidence-platform",
    name: "Automated Compliance Evidence Collection",
    lead: "Ahmed",
    sector: "RegTech / Compliance Automation",
    kind: "Product",
    track: "Enterprise",
    status: "In build",
    summary:
      "An automated compliance governance platform that continuously monitors cloud infrastructure, access controls, and code repositories to automatically gather, cryptographic-stamp, and map evidence against SOC 2, ISO 27001, HIPAA, and GDPR audit frameworks.",
    problem:
      "Manual evidence gathering dominates audit preparation, costing engineering teams hundreds of hours capturing screenshots, pulling configuration snapshots, and assembling spreadsheets right before certification cycles.",
    audience:
      "Chief Information Security Officers (CISOs), GRC managers, internal security auditors, and regulated SaaS enterprises.",
  },
  {
    slug: "sign-language-companion",
    name: "Sign Language Companion",
    lead: "Hasnain",
    sector: "Mobile / Accessibility",
    kind: "Service",
    track: "Accessibility",
    status: "Concept",
    summary:
      "A real-time visual translation system powered by edge computer vision and spatial hand tracking. It translates sign language gestures into natural synthesized speech while instantaneously transcribing spoken responses into text and visual sign annotations, enabling fluid bidirectional communication.",
    problem:
      "Over 70 million deaf individuals worldwide face immense communication barriers in daily public interactions, healthcare appointments, and professional environments due to a severe shortage of certified sign language interpreters.",
    audience:
      "Deaf and hard-of-hearing communities, educational institutions, public service providers, healthcare facilities, and customer service teams.",
  },
  {
    slug: "cloud-fine-tuning-platform",
    name: "Cloud Fine-Tuning Platform",
    lead: "Safwan",
    sector: "Cloud Infrastructure",
    kind: "Service",
    track: "Platforms",
    status: "In build",
    summary:
      "An elastic infrastructure platform that provisions optimized GPU/CPU computing clusters on demand for LLM fine-tuning, synthetic dataset generation, and hyperparameter optimization, featuring zero-configuration environment setup and automated checkpoint management.",
    problem:
      "AI research teams and developers waste substantial time and capital configuring fragmented cloud GPU environments, managing CUDA dependencies, and struggling with out-of-memory errors during large-scale model optimization runs.",
    audience:
      "Machine learning engineers, AI research labs, data science teams, and tech enterprises building proprietary AI models.",
  },
  {
    slug: "ai-shorts-generation",
    name: "AI Shorts Generation",
    lead: "Safwan",
    sector: "AI Content",
    kind: "Product",
    track: "Platforms",
    status: "In build",
    summary:
      "An automated media engine that converts raw scripts or long-form video content into engaging, publication-ready short videos. It handles voiceover generation, motion typography, visual scene stitching, dynamic captions, and multi-channel automated social distribution.",
    problem:
      "Creating viral, high-quality short-form content for platforms like YouTube Shorts, TikTok, and Reels demands hours of tedious video editing, audio sync, caption styling, and multi-platform publishing per video.",
    audience:
      "Digital media agencies, content creators, brand marketing teams, educational publishers, and social media managers.",
  },
  {
    slug: "3d-virtual-rooms",
    name: "3D Virtual Room Experience",
    lead: "Hasnain",
    sector: "TravelTech",
    kind: "Service",
    track: "Platforms",
    status: "In build",
    summary:
      "A spatial computing platform that constructs photorealistic, interactive 3D digital twins of hotel rooms and luxury rentals directly from standard smartphone videos, offering prospective guests immersive spatial walkthroughs prior to booking.",
    problem:
      "Hospitality platforms depend on static 2D photographs that fail to convey space, lighting, layout, and room condition, leading to traveler hesitation, low booking conversion rates, and negative post-stay reviews.",
    audience:
      "Boutique hotels, luxury resort operators, vacation rental hosts, real estate agencies, and online travel platforms.",
  },
  {
    slug: "playhub-courtbook",
    name: "PlayHub / CourtBook",
    lead: "Hasnain",
    sector: "SportsTech",
    kind: "Product",
    track: "Platforms",
    status: "In build",
    summary:
      "A unified sports venue management and marketplace ecosystem that aggregates local athletic facilities (futsal, padel, tennis, football), syncing venue calendars in real time for instant online reservations and split-payment transactions.",
    problem:
      "Recreational sports bookings still operate through fragmented phone calls, WhatsApp messages, and manual ledgers, resulting in frequent double-bookings, uncollected reservation fees, and operational headaches for venue operators.",
    audience:
      "Sports facility owners, venue managers, recreational athletes, local tournament organizers, and sports clubs.",
  },
  {
    slug: "special-education-case-manager",
    name: "AI Special Education Case Manager",
    lead: "Ali Taha",
    sector: "EdTech / Special Education",
    kind: "Product",
    track: "Education",
    status: "In build",
    summary:
      "An intelligent workflow automation platform tailored for K-12 special education administration. It automates Individualized Education Program (IEP) drafting, goal progress tracking, legal federal compliance validation, and multi-stakeholder parent-teacher communication.",
    problem:
      "Special education educators spend up to 60% of their working hours trapped in complex compliance paperwork rather than working directly with students, triggering severe burnout, high teacher turnover, and costly school district due-process litigation.",
    audience:
      "Directors of Special Education, K-12 public school district administrators, case managers, IEP coordinators, and special education teachers.",
  },
  {
    slug: "ai-life-companion",
    name: "AI Life Companion for Disabled Kids",
    lead: "Ali Taha",
    sector: "SpecialNeeds / EdTech",
    kind: "Product",
    track: "Accessibility",
    status: "In build",
    summary:
      "An integrated therapeutic assistant and daily care management hub designed for neurodivergent children. It unifies routine scheduling, gamified therapy reinforcement, assistive communication, behavioral logging, and multi-provider data sharing.",
    problem:
      "Parents of children with special needs must coordinate daily life across dozens of disconnected notebooks, apps, therapy guidelines, and school reports, leading to fragmented care and extreme parental exhaustion.",
    audience:
      "Parents and caregivers of children with neurodevelopmental needs (Autism, ADHD, Down Syndrome), pediatric occupational therapists, speech pathologists, and special education professionals.",
  },
];

export const projects: Project[] = raw.map((p, i) => ({
  ...p,
  index: String(i + 1).padStart(2, "0"),
}));

export const tracks: Track[] = [
  "Security",
  "Enterprise",
  "Education",
  "Accessibility",
  "Platforms",
];

export const leads = Array.from(new Set(projects.map((p) => p.lead)));
