import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Hunter System": negro/gris oscuro + azul eléctrico + violeta.
        bg: {
          DEFAULT: "#070a12",
          soft: "#0c1019",
          card: "#10141f",
          elev: "#161b29",
        },
        line: "#1f2738",
        hunter: {
          blue: "#3b82f6",
          cyan: "#22d3ee",
          violet: "#8b5cf6",
          indigo: "#6366f1",
        },
        rank: {
          e: "#94a3b8",
          d: "#22c55e",
          c: "#06b6d4",
          b: "#3b82f6",
          a: "#8b5cf6",
          s: "#f59e0b",
          n: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(59,130,246,0.35)",
        "glow-violet": "0 0 22px rgba(139,92,246,0.4)",
        "glow-soft": "0 0 12px rgba(59,130,246,0.2)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(59,130,246,0.25)" },
          "50%": { boxShadow: "0 0 24px rgba(59,130,246,0.6)" },
        },
        "level-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.2s ease-in-out infinite",
        "level-pop": "level-pop 0.5s ease-out",
        "slide-up": "slide-up 0.35s ease-out",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
