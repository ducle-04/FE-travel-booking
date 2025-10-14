/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Đảm bảo quét tất cả file trong src
  ],
  theme: {
    extend: {
      fontFamily: {
        Montserrat: ['Montserrat', 'sans-serif'], // Cấu hình font Montserrat
      },
    },
  },
  plugins: [],
};

