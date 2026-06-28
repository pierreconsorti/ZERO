import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        zero: {
          paper: "#ffffff",
          panel: "#ffffff",
          ink: "#000000",
          muted: "#555555",
          rule: "#ececec",
          blue: "#274e9b",
          rust: "#87524a",
          moss: "#315338",
          amber: "#d29b64"
        }
      },
      fontFamily: {
        sans: [
          "Helvetica Now",
          "Helvetica Now Display",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif"
        ],
        mono: [
          "SFMono-Regular",
          "ui-monospace",
          "Cascadia Code",
          "Menlo",
          "monospace"
        ]
      },
      boxShadow: {
        quiet: "0 24px 80px rgba(18, 26, 24, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
