/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    borderWidth: {
      DEFAULT: "1px",
    },
    extend: {
      width: {
        "90per": "90%",
        "95per": "95%",
        "calc-full-40": "calc(100% - 40px)",
        "calc-full-56": "calc(90vh - 56px)",
        "calc-full-340": "calc(100% - 340px)",
        "calc-full-320": "calc(100% - 320px)",
        "calc-half-2": "calc(50% - 2px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Utilisez "Inter" comme police par défaut pour "sans"
      },
      keyframes: {
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        skeleton: {
          "0%, 100%": { backgroundPosition: "200% 0" },
          "50%": { backgroundPosition: "0 0" },
        },
        tabs: {
          "0%": {
            opacity: 0,
            transform: "translateX(-10px)",
          },
          "10%": {
            opacity: 1,
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        skeleton: "skeleton 1.5s ease-in-out infinite",
        spin: "spin 1s linear infinite",
        tabs: "tabs 350ms linear",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    // Header animation come from screens object
    screens: {
      sm: { max: "480px" },
      md: { max: "768px" },
      lg: { max: "976px" },
    },
    colors: {
      dark: {
        bg: {
          primary: "rgba(19, 22, 39, 1)",
          secondary: "rgba(21, 25, 41, 1)",
          terciary: "rgba(23, 27, 43, 1)",
          table: "rgba(17, 21, 36, 1)",
          hover: "rgba(34, 37, 49, 1)",
          tags: "rgba(40, 43, 55, 1)",
        },
        border: {
          primary: "rgba(255, 255, 255, 0.03)",
          secondary: "rgba(255, 255, 255, 0.04)",
        },
        font: {
          100: "rgba(255, 255, 255, 0.95)",
          80: "rgba(255, 255, 255, 0.85)",
          60: "rgba(255, 255, 255, 0.65)",
          40: "rgba(255, 255, 255, 0.45)",
          20: "rgba(255, 255, 255, 0.25)",
          10: "rgba(255, 255, 255, 0.15)",
        },
      },
      light: {
        bg: {
          primary: "rgba(255,255,255,1)",
          secondary: "rgba(252.5, 252.5, 252.5, 1)",
          terciary: "rgba(250, 250, 250, 1)",
          table: "rgba(255, 255, 255, 1)",
          hover: "rgba(245, 245, 245, 1)",
          tags: "rgba(227, 227, 227, 1)",
        },
        border: {
          primary: "rgba(0, 0, 0, 0.03)",
          secondary: "rgba(231, 232, 236, 1)",
        },
        font: {
          100: "rgba(0, 0, 0, 0.95)",
          80: "rgba(0, 0, 0, 0.85)",
          60: "rgba(0, 0, 0, 0.65)",
          40: "rgba(0, 0, 0, 0.45)",
          20: "rgba(0, 0, 0, 0.25)",
          10: "rgba(0, 0, 0, 0.15)",
        },
      },
      red: "#ea3943",
      darkred: "rgba(234, 57, 67, 0.2)",
      green: "#0ECB81",
      darkgreen: "rgba(2, 192, 118, 0.2)",
      blue: "#5c7df9",
      darkblue: "rgba(43, 58, 117, 1)",
      telegram: "#30A7DE",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      yellow: "#ffc82c",
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
