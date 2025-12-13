/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Google Sans', 'Battambang', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        khmer: ['Battambang', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
