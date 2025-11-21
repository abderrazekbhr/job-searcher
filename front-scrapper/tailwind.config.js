/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // must include all src files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"), // optional if using ShadCN animations
  ],
  darkMode: "class", // enables dark mode via class
};
