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
        nordic: {
          bg: '#0C131D',          // Deep Midnight Frost Navy
          card: '#151F2C',        // Frosted Dark Slate surface
          hover: '#1E2C3F',       // Hover state
          border: '#222F43',      // Subtle icy border
          aqua: '#2DD4BF',        // Soft Aquamarine / Seafoam
          cyan: '#38BDF8',        // Sky Cyan
          text: '#F0F9FF',        // Crisp Icy White
          muted: '#94A3B8'
        }
      }
    },
  },
  plugins: [],
}
