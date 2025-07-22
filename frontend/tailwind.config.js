/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background), <alpha-value>)",
        foreground: "rgba(var(--foreground), <alpha-value>)",
        border: "rgba(var(--border), <alpha-value>)",
        "background-secondary": "rgba(var(--background-secondary), <alpha-value>)",
        "drop-hint": "rgba(var(--drop-hint), <alpha-value>)",
        outline: "rgba(var(--outline), <alpha-value>)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"],
  },
};
