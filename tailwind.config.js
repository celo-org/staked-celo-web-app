/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      textColor: {
        'color-primary': 'var(--c-text-primary-color)',
        'color-secondary': 'var(--c-text-secondary-color)',
        'color-contrast': 'var(--c-text-contrast-color)',
        'color-error': 'var(--c-text-error-color)',
        'color-primary-callout': 'var(--c-text-primary-callout-color)',
        'color-secondary-callout': 'var(--c-text-secondary-callout-color)',
        'color-tertiary-callout': 'var(--c-text-tertiary-callout-color)',
        'color-modal': 'var(--c-text-modal)',
        'color-green': {
          DEFAULT: '#55A803',
        },
        'color-purple': {
          DEFAULT: '#6A38F6',
        },
      },
      placeholderColor: {
        primary: 'var(--c-placeholder-primary)',
      },
      backgroundColor: {
        primary: 'var(--c-bg-primary-color)',
        secondary: 'var(--c-bg-secondary-color)',
        tertiary: 'var(--c-bg-tertiary-color)',
        'secondary-oposite': 'var(--c-bg-secondary-oposite-color)',
        'action-primary-light': 'var(--c-bg-action-primary-light-color)',
        'action-primary-regular': 'var(--c-bg-action-primary-regular-color)',
        'action-primary-dark': 'var(--c-bg-action-primary-dark-color)',
        'action-secondary-light': 'var(--c-bg-action-secondary-light-color)',
        'action-secondary-regular': 'var(--c-bg-action-secondary-regular-color)',
        'action-secondary-dark': 'var(--c-bg-action-secondary-dark-color)',
        'highlight-primary': 'var(--c-bg-highlight-primary-color)',
        'highlight-secondary': 'var(--c-bg-highlight-secondary-color)',
      },
      padding: {
        base: '32px',
      },
    },
  },
  plugins: [],
};
