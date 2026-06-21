/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#050508",
          900: "#07070a",
          850: "#0c0c14",
          800: "#11111f",
          700: "#1b1b2f",
          600: "#2a2a47"
        },
        accent: {
          primary: "#7c3aed",
          primaryGlow: "rgba(124, 58, 237, 0.4)",
          hover: "#9333ea",
          light: "#a78bfa",
          neon: "#c084fc",
          dim: "#6d28d9"
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
