import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      red: "#880808",
    },
    borderWidth: {
      DEFAULT: "3px",
      0: "0",
    },
    borderColor: {
      DEFAULT: "#000",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-stk-bureau)", "sans-serif"],
      },
      fontSize: {
        base: ["1rem", "1.3"],
        // lg: ["2.5rem", "1.3"],
      },
      fontWeight: {
        normal: "500",
      },
      container: {
        center: true,
        padding: "2rem",
      },
      animation: {
        blink: "blink 1s infinite",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
