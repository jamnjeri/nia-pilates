/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: '#f7f5f1',
        lightbrown: '#6d6059',
        brown: '#53311c',
        black: '#1e130e',
        white: '#fdfbfa',
        orange: '#c77a41',
        greybeige: '#eee7dd',
        line: "#dfd6c9",
        btext: "#6d6059",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}

