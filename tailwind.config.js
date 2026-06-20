/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          50: '#fdf6f0',
          100: '#fae8d9',
          200: '#f5d1b3',
          300: '#efb98d',
          400: '#e9a267',
          500: '#e38a41',
          600: '#c47134',
          700: '#a05827',
          800: '#7c3f1a',
          900: '#58260d',
        }
      }
    },
  },
  plugins: [],
}