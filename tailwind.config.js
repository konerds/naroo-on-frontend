const defaultTheme = require('tailwindcss/defaultTheme');

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
        },
        'shuttle-gray': '#5E6774',
        harp: '#E9EFF1',
        yellow: '#F9D66C',
      },
      fontFamily: {
        noto: 'Noto Sans KR',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
