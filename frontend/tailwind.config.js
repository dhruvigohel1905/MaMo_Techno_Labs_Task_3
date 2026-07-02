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
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#6366F1', // Premium Indigo
          600: '#4F46E5',
          700: '#4338CA',
        },
        secondary: {
          500: '#0F172A', // Obsidian Deep Dark
          600: '#020617',
        },
        accent: {
          500: '#06B6D4', // Premium Cyan
          600: '#0891B2',
          700: '#EC4899', // Hot Pink alert
        },
        bgLight: '#F8FAFC',
        bgDark: '#030712', // Pure pitch-black obsidian
        cardDark: '#0B0F19', // Space Gray card backdrop
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'scan-slow': 'scan 6s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'spin-reverse': 'spinReverse 12s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(1.05)' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.15)',
        'glow-primary': '0 0 15px rgba(99, 102, 241, 0.15)',
        'glow-rose': '0 0 15px rgba(244, 63, 94, 0.15)',
      }
    },
  },
  plugins: [],
};
