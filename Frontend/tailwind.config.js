/** @type {import('tailwindcss').Config} */
export default = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path as needed
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // Enable class-based dark mode
  plugins: [],
};
