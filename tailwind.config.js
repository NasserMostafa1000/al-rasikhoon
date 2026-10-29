/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#cfba82",
          deep: "#c8a767",
          soft: "#e8d6a5",
          muted: "#bba770",
        },
        cream: "#f4f3ec",
        ink: {
          DEFAULT: "#1a1a1a",
          soft: "#323232",
          muted: "#656565",
        },
        sea: {
          DEFAULT: "#1c4b63",
          deep: "#0f2d3d",
          mist: "#7eb8d4",
          glass: "#a8d4e8",
        },
      },
      fontFamily: {
        display: ["Syne", "IBM Plex Sans Arabic", "sans-serif"],
        sans: ["IBM Plex Sans Arabic", "Syne", "sans-serif"],
      },
      boxShadow: {
        gold: "0 18px 50px rgba(207, 186, 130, 0.28)",
        soft: "0 20px 60px rgba(15, 45, 61, 0.12)",
      },
      backgroundImage: {
        "coastal-wash":
          "radial-gradient(ellipse at 20% 0%, rgba(207,186,130,0.28), transparent 45%), radial-gradient(ellipse at 90% 20%, rgba(126,184,212,0.22), transparent 40%), linear-gradient(165deg, #f4f3ec 0%, #e8eef2 48%, #dfe8ee 100%)",
        "ink-wash":
          "radial-gradient(ellipse at 30% 0%, rgba(207,186,130,0.18), transparent 50%), linear-gradient(160deg, #0f2d3d 0%, #1a1a1a 55%, #1c4b63 100%)",
      },
      keyframes: {
        spinY: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        spinY: "spinY 4.5s linear infinite",
        floaty: "floaty 4s ease-in-out infinite",
        shimmer: "shimmer 3.2s linear infinite",
      },
    },
  },
  plugins: [],
};
