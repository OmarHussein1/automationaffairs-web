/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Lexend Tera', 'sans-serif'],
        'body': ['Lexend Deca', 'sans-serif'],
      },
      fontSize: {
        // Golden ratio scale based on 18px base
        'xs': '0.694rem',    // 18 / 1.618^2
        'sm': '0.889rem',    // 18 / 1.618^1.5
        'base': '1rem',      // 18px (adjusted to 1rem for consistency)
        'lg': '1.125rem',    // 18 * 1.618^0.25
        'xl': '1.44rem',     // 18 * 1.618^0.5
        '2xl': '1.618rem',   // 18 * 1.618^0.75
        '3xl': '2.618rem',   // 18 * 1.618^1.25
        '4xl': '4.236rem',   // 18 * 1.618^1.75
        '5xl': '6.854rem',   // 18 * 1.618^2.25
      },
      lineHeight: {
        'heading': '1.25',
        'body': '1.6',
      },
      fontFamily: {
        'heading': ['var(--font-heading)'],
        'body': ['var(--font-body)'],
      },
      colors: {
        primary: {
          DEFAULT: '#3b5bdb',
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#3b5bdb',
          600: '#3730a3',
          700: '#312e81',
          800: '#1e1b4b',
          900: '#1e1b4b',
        },
        accent: {
          DEFAULT: '#f3ff5a',
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#f3ff5a',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        'neutral-bg': '#f7f8fa',
        'neutral-surface': '#ffffff',
        'neutral-ink': '#0a0a0a',
        'neutral-ink-muted': '#4b5563',
        'dark-bg': '#0d0f12',
        'dark-surface': '#121418',
        'dark-text': '#ffffff',
      },
      borderRadius: {
        'pill': '9999px',
      },
      maxWidth: {
        'content': '1200px',
      },
      spacing: {
        'section-desktop': '6rem', // py-24
        'section-mobile': '4rem',  // py-16
      },
    },
  },
  plugins: [],
}
