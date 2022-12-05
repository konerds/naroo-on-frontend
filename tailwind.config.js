module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: { min: '0px', max: '639.98px' },
        lg: { min: '1024px' },
        xl: { min: '1200px' },
      },
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
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
