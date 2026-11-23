export const biography =
  "Giovanni Carrion is a Computer Science student interested in cybersecurity, networking, IT infrastructure, and AI systems.";

type DocumentationAddress = `192.0.2.${number}`;

export const portfolioCore = {
  id: "giovanni-core",
  hostname: "GIOVANNI-CORE",
  label: "Giovanni",
  address: "192.0.2.1",
} as const satisfies {
  id: string;
  hostname: string;
  label: string;
  address: DocumentationAddress;
};

export const servers = [
  {
    id: "it-infrastructure",
    label: "IT",
    hostname: "IT-INFRA-SRV",
    address: "192.0.2.10",
    title: "IT Infrastructure",
    summary: "Networking, systems administration, and infrastructure projects.",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    hostname: "CYBER-OPS-SRV",
    address: "192.0.2.11",
    title: "Cybersecurity",
    summary:
      "Security research, competitions, and defensive security projects.",
  },
  {
    id: "ai-projects",
    label: "AI",
    hostname: "AI-LAB-SRV",
    address: "192.0.2.12",
    title: "AI Projects",
    summary: "Experiments and projects involving applied AI systems.",
  },
  {
    id: "professional",
    label: "Professional",
    hostname: "PROFESSIONAL-SRV",
    address: "192.0.2.13",
    title: "Professional",
    summary: "Education, professional interests, and résumé information.",
  },
  {
    id: "personal",
    label: "Personal",
    hostname: "PERSONAL-SRV",
    address: "192.0.2.14",
    title: "Personal",
    summary: "Interests and projects outside of work and school.",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  summary: string;
  hostname: string;
  label: string;
  address: DocumentationAddress;
}[];

export type ServerId = (typeof servers)[number]["id"];

export const readingLinks = [
  { href: "/about/", title: "About" },
  { href: "/projects/", title: "Portfolio" },
  { href: "/resume/", title: "Resume" },
  { href: "/contact/", title: "Contact" },
] as const;

export const resumePdf = "/GiovanniCarrionResume.pdf";

export const publicProfiles = [
  { title: "GitHub", href: "https://github.com/itsjustgiio" },
  { title: "LinkedIn", href: "https://www.linkedin.com/in/giovannicarrion/" },
] as const;
