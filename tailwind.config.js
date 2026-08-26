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
        antigravity: {
          bg: '#0F1117',          // Antigravity Deep Obsidian Slate
          card: '#1A1D27',        // Surface Container Card
          hover: '#222634',       // Hover / Selected surface
          border: '#2B3042',      // Micro-border
          indigo: '#6366F1',      // Antigravity Primary Electric Indigo
          indigoSoft: '#818CF8',  // Soft Indigo highlight
          text: '#F8FAFC',        // High-contrast text
          subtext: '#94A3B8',     // Slate secondary text
          muted: '#64748B'
        }
      }
    },
  },
  plugins: [],
}
