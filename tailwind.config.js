// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       keyframes: {
//         slide: {
//           "0%": { transform: "translateX(100%)" },
//           "100%": { transform: "translateX(-100%)" },
//         },
//       },
//       animation: {
//         slide: "slide 10s linear infinite",
//       },
//     },
//   },
//   plugins: [],
// }
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // Common text colors
    'text-red-500',
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-gray-500',

    // Background colors
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-300',
    'bg-gray-800',

    // Borders and other utilities
    'border-red-500',
    'border-blue-500',
    'border-green-500',
  ],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        slide: "slide 10s linear infinite",
      },
    },
  },
  plugins: [],
}