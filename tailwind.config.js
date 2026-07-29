/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kindle: {
          paper: '#fbf0d9',
          paperDark: '#f4e4bc',
          textLight: '#2c2523',
          darkBg: '#121212',
          darkCard: '#1e1e1e',
          darkText: '#e0e0e0',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Merriweather', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
