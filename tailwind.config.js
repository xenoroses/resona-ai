/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        resona: {
          bg: '#18181B',
          card: '#27272A',
          hover: '#3F3F46',
          border: '#3F3F46',
          coral: '#D97757',       // Signature warm coral
          amber: '#F59E0B',
          cyan: '#06B6D4',
          emerald: '#10B981'
        }
      }
    },
  },
  plugins: [],
}
