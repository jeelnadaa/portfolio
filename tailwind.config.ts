import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        bone: "var(--bone)",
        muted: "var(--muted)",
        rule: "var(--rule)",
        sun: "var(--sun)",
        gold: "var(--gold)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        greek: ["var(--font-didot)", "serif"],
        sans: ["var(--font-geist)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      letterSpacing: {
        dossier: "0.08em",
        tightest: "-0.035em",
      },
      borderRadius: {
        sharp: "0px",
        subtle: "2px",
      },
      screens: {
        xs: "390px",
      },
    },
  },
  plugins: [],
};

export default config;
