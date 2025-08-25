/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Poppins'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#e6f6f3",
          100: "#c8ece6",
          200: "#99ddd2",
          300: "#6ec9ba",
          400: "#3eb3a1",
          500: "#0e9b87",
          600: "#0b7f70",
          700: "#09665a",
          800: "#074f46",
          900: "#053c36",
          light: "#dff6f2",
          DEFAULT: "#0e9b87",
          dark: "#074f46",
        },
        accent: {
          50: "#fff3e6",
          100: "#ffe4c7",
          200: "#ffcf99",
          300: "#ffb56b",
          400: "#ff993d",
          500: "#ff7a0f",
          600: "#db650a",
          700: "#b15108",
          800: "#8a4207",
          900: "#6b3405",
          light: "#fff7ed",
          DEFAULT: "#ff7a0f",
          dark: "#b15108",
        },
        neutral: {
          lightest: "#fafafa",
          light: "#f3f4f6",
          muted: "#9ca3af",
          DEFAULT: "#374151",
          dark: "#111827",
          darkest: "#0b1220",
        },
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.06)",
        elevate: "0 8px 24px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "0.9rem",
        '2xl': "1.25rem",
      },
    },
  },
  plugins: [],
};
