/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cr: {
          red: 'rgb(var(--cr-red) / <alpha-value>)',
          'red-dark': 'rgb(var(--cr-red-dark) / <alpha-value>)',
          teal: 'rgb(var(--cr-teal) / <alpha-value>)',
          'teal-dark': 'rgb(var(--cr-teal-dark) / <alpha-value>)',
          ink: 'rgb(var(--cr-ink) / <alpha-value>)',
          paper: 'rgb(var(--cr-paper) / <alpha-value>)',
          screen: 'rgb(var(--cr-screen) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        condensed: ['"Roboto Condensed"', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
