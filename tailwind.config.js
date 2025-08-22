/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Poppins'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      colors: {
        brand: {
          light: "#dff6f2",
          DEFAULT: "#00796b",
          dark: "#004d40",
        },
        accent: {
          light: "#fff7ed",
          DEFAULT: "#b45309",
          dark: "#7c2d12",
        },
        neutral: {
          lightest: "#fafafa",
          light: "#f3f4f6",
          DEFAULT: "#374151",
          dark: "#111827",
          darkest: "#0b1220",
        },
      },
    },
  },
  plugins: [],
};
