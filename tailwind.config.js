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
        cupid: {
          lightBg: '#E1B9FE',
          lightBgSoft: '#F3E3FF',
          lightCard: '#FFFFFF',
          darkBg: '#0B0B0E',
          darkCard: '#16161D',
          darkBorder: '#282634',
          primary: '#7904CD',
          primaryHover: '#6202A7',
          lightAccent: '#E1B9FE',
          vivid: '#9D4EDD',
          pink: '#FF4D8D',
          rose: '#E63946',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cupid-glow': '0 8px 30px rgba(121, 4, 205, 0.25)',
        'cupid-light': '0 10px 25px -5px rgba(121, 4, 205, 0.15), 0 8px 10px -6px rgba(121, 4, 205, 0.1)',
        'card-dark': '0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '40%': { transform: 'scale(1)' },
          '60%': { transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
