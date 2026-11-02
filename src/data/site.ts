export const siteConfig = {
  brand: "solarquack",
  legalName: "Jeel Nada",
  givenName: "Jeel",
  familyName: "Nada",
  // Other spellings people search for, used in structured data
  alternateNames: ["solarquack", "Solarquack", "Solar Quack"],
  url: "https://solarquack.in",
  role: "CSE Student / Software Developer",
  college: "PES University, B.Tech CSE, class of 2027, CGPA 8.43",
  location: "Bengaluru, India",
  locationCity: "Bengaluru",
  locationCountry: "IN",
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
  // Plain facts shown under the hero line at every screen size
  heroFacts: ["Jeel Nada", "PES University, CSE '27", "Bengaluru", "Open to Summer 2027 internships"],
  // Accessible name for the hero h1 (the visible letters are decorative)
  heroHeading: "Jeel Nada (solarquack), CSE student and developer",
  // First paragraph on /about, and the plain statement of who runs this site
  aboutIntro:
    "I'm Jeel Nada, a Computer Science student in Bengaluru. Online I go by solarquack, sometimes written Solar Quack, and solarquack.in is where I keep my projects, résumé and contact details.",
  personDescription:
    "Jeel Nada, also known as solarquack, is a Computer Science student at PES University in Bengaluru who builds distributed systems, ML tools and web applications.",
  knowsAbout: [
    "Distributed systems",
    "Systems programming",
    "Machine learning",
    "Web development",
    "Android development",
  ],
  taglineDisplay: "Built with strength. Shipped with taste.",
  taglineGreek: "ΙΣΧΥΣ ΚΑΙ ΤΕΧΝΗ",
  authorDossier: "Jeel Nada // solarquack",
  systemLabel: "SYSTEM DOSSIER",
  repoUrl: "https://github.com/jeelnadaa/portfolio",
  version: "1.0.0",
  statementWords: [
    "I", "am", "a", "computer", "science", "student", "at", "PES", "University", "in", "Bengaluru.",
    "I", "engineer", "distributed", "backend", "utilities,", "fast", "local-first", "interfaces,",
    "and", "production", "multimodal", "AI", "pipelines", "with", "uncompromising", "taste."
  ],
} as const;

export type SiteConfig = typeof siteConfig;
