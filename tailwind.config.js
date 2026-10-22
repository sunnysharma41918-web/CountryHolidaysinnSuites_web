/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#ff5938',
          'orange-hover': '#e84a28',
          'orange-light': '#fff3f0',
          navy: '#0d1829',
          dark: '#111827',
          gray: '#64748b',
          muted: '#94a3b8',
          border: '#e2e8f0',
          bg: '#f8f9fb',
        },
        midnight: '#0d1829',
        emerald: '#1D4637',
        gold: '#ff5938',
        ivory: '#ffffff',
        sand: '#f3f4f6',
        charcoal: '#111827',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        card: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
        float: '0 25px 50px -12px rgba(255, 89, 56, 0.25)',
        popup: '0 30px 60px -15px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
