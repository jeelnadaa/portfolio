export interface GlyphEntry {
  place: string;
  giantLetter: string;
  greekWord: string;
  englishLabel: string;
  numeral?: string;
}

export const glyphs: Record<string, GlyphEntry> = {
  hero: {
    place: "Hero",
    giantLetter: "Ω",
    greekWord: "ΦΑΚΕΛΟΣ",
    englishLabel: "System dossier",
  },
  whatItIs: {
    place: "What it is",
    giantLetter: "Ε",
    greekWord: "ΕΓΩ",
    englishLabel: "About, short",
    numeral: "00",
  },
  strength: {
    place: "Strength",
    giantLetter: "Ι",
    greekWord: "ΙΣΧΥΣ",
    englishLabel: "Strength",
    numeral: "01",
  },
  craft: {
    place: "Craft",
    giantLetter: "Τ",
    greekWord: "ΤΕΧΝΗ",
    englishLabel: "Craft",
    numeral: "02",
  },
  work: {
    place: "Work",
    giantLetter: "Ε",
    greekWord: "ΕΡΓΑ",
    englishLabel: "Work",
    numeral: "03",
  },
  skills: {
    place: "Skills",
    giantLetter: "Ο",
    greekWord: "ΟΠΛΟΘΗΚΗ",
    englishLabel: "Armory (skills)",
    numeral: "04",
  },
  github: {
    place: "GitHub",
    giantLetter: "Κ",
    greekWord: "ΚΩΔΙΚΑΣ",
    englishLabel: "Code",
    numeral: "05",
  },
  experience: {
    place: "Experience",
    giantLetter: "Π",
    greekWord: "ΠΟΡΕΙΑ",
    englishLabel: "Path",
    numeral: "06",
  },
  path: {
    place: "Path",
    giantLetter: "Π",
    greekWord: "ΠΟΡΕΙΑ",
    englishLabel: "Path",
    numeral: "06",
  },
  status: {
    place: "Status",
    giantLetter: "Κ",
    greekWord: "ΚΑΤΑΣΤΑΣΗ",
    englishLabel: "Status",
    numeral: "07",
  },
  faq: {
    place: "FAQ",
    giantLetter: "Ε",
    greekWord: "ΕΡΩΤΗΣΕΙΣ",
    englishLabel: "Questions",
    numeral: "08",
  },
  about: {
    place: "About page",
    giantLetter: "Α",
    greekWord: "ΑΝΘΡΩΠΟΣ",
    englishLabel: "Human",
  },
  resume: {
    place: "Resume",
    giantLetter: "Β",
    greekWord: "ΒΙΟΣ",
    englishLabel: "Life / résumé",
  },
  contact: {
    place: "Contact",
    giantLetter: "Ε",
    greekWord: "ΕΠΑΦΗ",
    englishLabel: "Contact",
  },
  log: {
    place: "Log",
    giantLetter: "Η",
    greekWord: "ΗΜΕΡΟΛΟΓΙΟ",
    englishLabel: "Log",
  },
  notFound: {
    place: "404",
    giantLetter: "Α",
    greekWord: "ΑΝΥΠΑΡΚΤΟ",
    englishLabel: "Not found",
  },
};

export const greekNumerals = ["Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι"] as const;
