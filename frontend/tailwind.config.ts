import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#EEF2FF',
          dark: '#3730A3',
        },
        secondary: {
          DEFAULT: '#0EA5E9',
          light: '#F0F9FF',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          light: '#F5F3FF',
        },
        background: {
          DEFAULT: '#F8FAFC',
          tint: '#F1F5F9',
        },
        surface: '#FFFFFF',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%)',
        'gradient-surface': 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(99, 102, 241, 0.15)',
        'premium-hover': '0 20px 40px -15px rgba(99, 102, 241, 0.25)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.3)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
