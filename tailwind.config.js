/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f1f8',
          100: '#d9deef',
          200: '#b3bfe0',
          300: '#8d9fd0',
          400: '#667fc1',
          500: '#4b64b2',
          600: '#3c508e',
          700: '#2d3c6b',
          800: '#1f2847',
          900: '#121624',
          950: '#0F172A', // Base navy color
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B', // Base gold color
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        cinematic: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#DC2626', // Base cinematic red color
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'inner-xl': 'inset 0 2px 20px 0 rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'film-grain': "url('https://grainy-gradients.vercel.app/noise.svg')",
      },
    },
  },
  plugins: [],
};