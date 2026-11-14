/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0b1120',
        panelBg: '#1e293b',
        accentBlue: '#0ea5e9',
      }
    },
  },
  plugins: [],
}