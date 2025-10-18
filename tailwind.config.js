/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 👈 đặt ngay đầu cho rõ ràng
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Quét toàn bộ file trong src
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
