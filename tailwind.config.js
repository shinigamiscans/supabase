module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class', // Enable dark mode
  theme: {
      extend: {
          colors: {
              zinc: require('tailwindcss/colors').zinc,
          },
      },
  },
  plugins: [],
};
