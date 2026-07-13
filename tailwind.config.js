/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cr: {
          red: '#E4251B',
          'red-dark': '#C01E15',
          teal: '#4CA5A3',
          'teal-dark': '#3E8D8B',
          ink: '#3A3A3A',
          paper: '#F5F5F5',
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
