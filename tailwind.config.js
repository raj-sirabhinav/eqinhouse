/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f9f8f6',
        surface: '#ffffff',
        borderSubtle: '#e6ded5',
        textPrimary: '#1c1917',
        textSecondary: '#78716c',
        accentNavy: '#1e293b',
        accentNavyHover: '#0f172a',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 1px 2px -1px rgba(28, 25, 23, 0.03)',
        'elevated': '0 10px 30px -5px rgba(28, 25, 23, 0.06), 0 4px 6px -2px rgba(28, 25, 23, 0.02)',
      },
    },
  },
  plugins: [],
}
