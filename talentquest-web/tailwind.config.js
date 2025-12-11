/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta TalentQuest (Baseada na Logo)
        tq: {
          dark: '#020617',    // Fundo Principal (Navy Profundo)
          card: '#0f172a',    // Fundo de Cards (Slate Escuro)
          border: '#1e293b',  // Bordas sutis
          text: '#94a3b8',    // Texto secundário
          white: '#f8fafc',   // Texto principal
          purple: '#8b5cf6',  // Roxo Neon (Principal)
          orange: '#f97316',  // Laranja (Acento/Ação)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'], // Para a IDE
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}