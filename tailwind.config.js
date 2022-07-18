/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      // default
      transparent: colors.transparent,
      blue: colors.blue,
      red: colors.red,
      yellow: colors.amber,
      teal: colors.teal,
      // custom
      green: '#55A803',
      red: '#F17256',
      orange: '#F9B73E',
      purple: {
        DEFAULT: '#A73EF9',
        700: '#9781EE',
        800: '#9477F5',
        900: '#8C62FF',
      },
      gray: {
        light: '#324142',
        dark: '#212B2E',
      },
      white: '#FFFFFF',
    },
    extend: {},
  },
  plugins: [],
};
