// /** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-gray-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-300",
    "bg-gray-800",
    "border-red-500",
    "border-blue-500",
    "border-green-500",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        accent: "#F59E0B",
        neutralDark: "#111827",
        neutralLight: "#F3F4F6",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Poppins", "sans-serif"],
        accent: ["Playfair Display", "serif"],
      },
      keyframes: {
        fadeLoop: {
          "0%, 100%": { opacity: "0", transform: "translateY(10px)" },
          "20%, 80%": { opacity: "1", transform: "translateY(0)" },
        },
        slide: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        fadeLoop: "fadeLoop 4s ease-in-out infinite",
        slide: "slide 10s linear infinite",
      },
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [daisyui, function({ addUtilities }) {
    addUtilities({ '.scrollbar-hide': { '-ms-overflow-style': 'none', 'scrollbar-width': 'none', '&::-webkit-scrollbar': { display: 'none' } } })
  }],
}