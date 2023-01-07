const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      ...defaultTheme.screens,
      xxs: '0px',
      xs: '420px',
      lg: '1024px',
      xl: '1200px',
    },
    extend: {
      colors: {
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        gray: {
          ...colors.neutral,
          100: '#C4C4C4',
          200: '#666666',
          300: '#555555',
          400: '#111111',
        },
        'shuttle-gray': '#5E6774',
        harp: '#E9EFF1',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
