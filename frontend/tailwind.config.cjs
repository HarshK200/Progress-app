/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background), <alpha-value>)",
        foreground: "rgba(var(--foreground), <alpha-value>)",
        border: "rgba(var(--border), <alpha-value>)",
        "background-secondary":
          "rgba(var(--background-secondary), <alpha-value>)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
