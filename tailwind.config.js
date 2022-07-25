/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: colors.amber,
        pear: '#C8D72B',
        green: '#7ED8C2',
        red: '#F17256',
        orange: {
          DEFAULT: '#E7B65D',
          700: '#E7B65D',
          800: '#DFA849',
          900: '#EEAF43',
        },
        purple: {
          DEFAULT: '#A73EF9',
          700: '#9781EE',
          800: '#9477F5',
          900: '#8C62FF',
        },
        gray: {
          100: '#E5EAEE',
          400: '#7B9799',
          800: '#324142',
          900: '#212B2E',
        },
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
