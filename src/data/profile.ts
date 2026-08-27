/**
 * Résumé content.
 *
 * Mirrors the current one-page CV (7th revision, 2026-08-27). When the CV
 * changes, change this file — the /resume page renders straight from it.
 *
 * Games are not portfolio projects. Here to Slay belongs on /games.
 */

export const profile = {
  name: "Miguel Joaquin A. Sanson",
  domain: "miguisanson.dev",
  role: "BS Information Technology student building iOS apps, web platforms, and self-hosted infrastructure.",
  location: "Mandaluyong City, Philippines",
  educationLine: "Bachelor of Science in Information Technology @ De La Salle University - Manila",
  email: "miguelsanson21@gmail.com",
  phone: "0928 737 9858",
  resumeUrl: "/Miguel-Joaquin-Sanson-Resume.docx",
  socials: [
    { label: "Email", href: "mailto:miguelsanson21@gmail.com", external: false },
    { label: "GitHub", href: "https://github.com/miguisanson", external: true },
    { label: "LinkedIn", href: "https://linkedin.com/in/miguel-joaquin-sanson-474703295", external: true },
  ],
};

/** Grouped to match the CV's Technical Skills block. */
export const skillGroups = [
  {
    label: "Languages",
    items: ["Swift", "Python", "SQL", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    label: "Frameworks & Web",
    items: ["React.js", "Node.js", "Express", "UIKit", "SwiftUI", "MVVM", "Clean Architecture"],
  },
  {
    label: "Tools & Platforms",
    items: ["Xcode", "VS Code", "MySQL", "GitHub", "Proxmox", "Ubuntu Server", "Figma", "Canva"],
  },
  {
    label: "Infrastructure",
    items: ["Linux", "Cloudflare Tunnel", "Network configuration", "Self-hosting", "AWS Cloud Foundations"],
  },
];

/** Flat list, used where a single chip row is wanted. */
export const skills = skillGroups.flatMap((group) => group.items);

export const education = [
  {
    school: "De La Salle University",
    detail: "Bachelor of Science in Information Technology",
    period: "June 2021 - Present",
    location: "Manila, Philippines",
    notes:
      "Relevant coursework: Data Structures and Algorithms, Database Systems, Web Development, Programming.",
  },
  {
    school: "University of St. La Salle",
    detail: "High School Diploma, with High Honors",
    period: "June 2013 - March 2020",
    location: "Bacolod, Philippines",
  },
];

export const experience = [
  {
    organization: "Seven Seven Global Services Inc.",
    role: "Information Technology Intern",
    period: "September 2026 - December 2026",
    location: "Pasig City, Philippines",
    summary:
      "Produced 3 major technical deliverables across a 504-hour internship spanning AI enablement, research and development, and iOS training.",
    highlights: [
      "Built TicketPlease, a native iOS ticket-booking application in Swift and UIKit on an MVVM and Clean Architecture foundation with zero third-party dependencies, implementing seat selection, booking validation, and five persistence mechanisms including Keychain-secured storage across 11 build milestones in three weeks.",
      "Authored an AI Cybersecurity Training Manual aligned with the NIST Cybersecurity Framework and OWASP LLM guidance, covering prompt injection, sensitive data exposure, shadow AI, and deepfake social engineering for a non-technical employee audience.",
      "Researched and evaluated 18 AI use cases across 3 business functions — Sales, Recruitment, and HR — benchmarking public enterprise implementations against internal stakeholder interviews and identifying governance controls under Philippine data privacy regulations.",
      "Developed an iOS Development Training Manual and Video Script Guide spanning Swift, UIKit, MVVM, Clean Architecture, networking, persistence, and testing, pairing every UIKit example with its modern SwiftUI equivalent and grounding each topic in the TicketPlease codebase.",
    ],
  },
];

/** Mirrors the CV's "Projects & Technical Experience" section. */
export const technicalExperience = [
  {
    organization: "Graduate Student Lifecycle Platform",
    role: "Capstone Thesis Developer",
    period: "March 2026 - December 2026",
    highlights: [
      "Building a React, TypeScript, Node.js, Express, and MySQL platform for the University of St. La Salle Graduate School, consolidating lifecycle records, milestones, document submissions, defense scheduling, dashboards, and audit logs.",
      "Designed BPMN workflows, ERD structures, and RBAC rules, plus reporting modules and RAG-based decision support for policy-grounded case guidance.",
    ],
  },
  {
    organization: "P&G Next Leadership Camp",
    role: "SRE Operations Manager",
    period: "March 2026 - April 2026",
    highlights: [
      "Developed Consumer IQ, an application proposed for a P&G business case. Designed the monitoring, self-healing, and incident-response workflows for data, AI, API, and dashboard reliability, and built the service-level framework documentation.",
    ],
  },
  {
    organization: "Web Development & Self-Hosted Infrastructure",
    role: "Personal Projects",
    period: "2023 - Present",
    highlights: [
      "Built and deployed miguisanson.dev, a personal portfolio site, managing the project from frontend implementation through production deployment.",
      "Configured and administered a Proxmox home server for self-hosted services and centralized photo and video storage, secured for remote access via Cloudflare tunneling.",
    ],
  },
  {
    organization: "Hardware Repair & Sales",
    role: "Independent",
    period: "2021 - Present",
    highlights: [
      "Repaired, restored, and diagnosed 22 devices across 7 hardware classes — handheld and home consoles, laptops, desktop PCs, tablets, phones, and wearables — covering board-level component replacement, display and battery servicing, and OS installation, recovery, and troubleshooting.",
      "Recovered data from an 8 TB WD Red hard drive, extending hands-on work into storage troubleshooting and data recovery.",
      "Sold 15 devices through Carousell, pairing repair work with direct consumer technology sales and customer support.",
    ],
  },
];

export type Certification = {
  title: string;
  issuer: string;
  date: string;
  /** Path under /public. Omit when no certificate file is available. */
  pdf?: string;
};

export const certifications: Certification[] = [
  {
    title: "CCNA: Enterprise Networking, Security, and Automation",
    issuer: "Cisco Networking Academy",
    date: "September 2025",
    pdf: "/certificates/ccna-enterprise-networking-security-automation.pdf",
  },
  {
    title: "CCNA: Switching, Routing, and Wireless Essentials",
    issuer: "Cisco Networking Academy",
    date: "May 2025",
  },
  {
    title: "AWS Academy Graduate, Cloud Foundations",
    issuer: "Amazon Web Services Training and Certification",
    date: "November 2025",
    pdf: "/certificates/aws-academy-cloud-foundations.pdf",
  },
  {
    title: "AWS Cloud Quest: Cloud Practitioner",
    issuer: "Amazon Web Services Training and Certification",
    date: "November 2025",
    pdf: "/certificates/aws-cloud-quest-cloud-practitioner.pdf",
  },
];
