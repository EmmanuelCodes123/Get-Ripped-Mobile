/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryGreen: '#6CD34F',
        darkGreen: '#2D4A1F',
        deepGreen: '#1F3B1C',
        background: '#030302',
        cardBackground: '#111111',
        textPrimary: '#E0E0DC',
        textSecondary: '#727071',
        aggressiveRed: '#FF0000', // As per the architecture rules [cite: 9]
      },
      fontFamily: {
        // You can define your bold/heavy typography here later [cite: 10]
      },
    },
  },
  plugins: [],
};