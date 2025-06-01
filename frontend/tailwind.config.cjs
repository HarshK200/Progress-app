/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        foreground: "rgba(var(--foreground))",
        border: "rgba(var(--border))",
        "background-secondary": "rgba(var(--background-secondary))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
