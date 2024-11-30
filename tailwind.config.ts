import type { Config } from "tailwindcss";

export default {
  darkMode: 'media',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#18181b',
        darkPrimary: '#d4d4d4', 
        background: '#d4d4d4',
        darkBackground: '#0a0a0a',
      },
    },
  },
  plugins: [],
} satisfies Config;
