import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-stk-bureau)", "sans-serif"],
      },
      fontSize: {
        base: ["1.5rem", "1.4"],
        lg: ["2.5rem", "1.3"],
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
