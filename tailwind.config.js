const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xxs: '0px',
      xs: '420px',
      lg: '1024px',
      xl: '1200px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        gray: {
          100: '#C4C4C4',
          200: '#666666',
          300: '#555555',
          400: '#111111',
          ...colors.neutral,
        },
        'shuttle-gray': '#5E6774',
        harp: '#E9EFF1',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
