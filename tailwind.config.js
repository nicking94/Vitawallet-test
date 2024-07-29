/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        sm: "20px",
        md: "32px",
        lg: "40px",
      },
      fontWeight: {
        sm: "400",
        lg: "900",
      },
      colors: {
        azul: "#005FEE",
        gris: "#4F4F4F",
      },
    },
  },
  plugins: [],
};
