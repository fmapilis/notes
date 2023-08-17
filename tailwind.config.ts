import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      default: "var(--color-default)",
      green: "var(--color-green)",
      gold: "var(--color-gold)",
      sage: "var(--color-sage)",
      gray: "var(--color-gray)",
      white: "var(--color-white)",
    },
    fontFamily: {
      default: "var(--font-family-default)",
      alt: "var(--font-family-alt)",
    },
    boxShadow: {
      sm: "0 2px 20px var(--color-sage)",
      md: "0 4px 20px var(--color-sage)",
    },
  },
  plugins: [],
};
export default config;
