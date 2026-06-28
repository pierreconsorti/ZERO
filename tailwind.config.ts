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
          paper: "#f6f7f2",
          panel: "#ffffff",
          ink: "#121a18",
          muted: "#5f6864",
          rule: "#d9ded4",
          blue: "#355c7d",
          rust: "#805541",
          moss: "#52675d",
          amber: "#9b6a2f"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
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
