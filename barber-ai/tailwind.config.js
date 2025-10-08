/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          brand: { dark: "#0f1b2d", mid: "#17273d", gold: "#f7a500" },
        },
        boxShadow: { soft: "0 10px 25px rgba(0,0,0,0.15)" },
        fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      },
    },
    plugins: [],
  }
  