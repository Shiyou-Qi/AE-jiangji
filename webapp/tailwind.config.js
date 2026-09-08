/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0d12',
        panel: '#141821',
        panel2: '#1b2130',
        border: '#262c3d',
        accent: '#4f7cff',
        accent2: '#6d9bff',
      },
    },
  },
  plugins: [],
};
