/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D9488', // teal-600
          light: '#14B8A6', // teal-500
          dark: '#0F766E', // teal-700
        },
        secondary: {
          DEFAULT: '#3B82F6', // blue-500
          light: '#60A5FA', // blue-400
          dark: '#2563EB', // blue-600
        }
      }
    },
  },
  plugins: [],
}
