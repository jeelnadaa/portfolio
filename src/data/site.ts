export const siteConfig = {
  brand: "solarquack",
  legalName: "Jeel Nada",
  url: "https://solarquack.in",
  role: "CSE Student / Software Developer",
  college: "PES University, B.Tech CSE, class of 2027, CGPA 8.43",
  location: "Bengaluru, India",
  locationShort: "BLR",
  email: "jeelnadaa@gmail.com",
  phone: "+91 80000 50317",
  github: "https://github.com/jeelnadaa",
  githubUsername: "jeelnadaa",
  linkedin: "https://www.linkedin.com/in/jeelnada/",
  linkedinLabel: "Jeel Nada",
  instagram: "https://instagram.com/jeel_nada77",
  resumePdf: "/resume.pdf",
  resumeDownloadName: "Jeel-Nada-Resume.pdf",
  availableFrom: null as string | null, // ISO date string e.g. "2027-06-01" or null
  openStatus: "Open to internships",
  heroPositioning: "CSE student in Bengaluru building systems, ML tools, and distinctive web apps.",
  taglineDisplay: "Built with strength. Shipped with taste.",
  taglineGreek: "ΙΣΧΥΣ ΚΑΙ ΤΕΧΝΗ",
  authorDossier: "Jeel Nada // solarquack",
  systemLabel: "SYSTEM DOSSIER",
  repoUrl: "https://github.com/jeelnadaa/portfolio",
  version: "1.0.0",
} as const;

export type SiteConfig = typeof siteConfig;
