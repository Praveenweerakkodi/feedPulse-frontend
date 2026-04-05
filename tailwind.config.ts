import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // We use MUI for components, Tailwind for layout
  // Important: tell Tailwind to not preflight (reset) MUI styles!
  corePlugins: {
    preflight: true, 
  },
  theme: {
    extend: {
      colors: {
        // We'll use these custom brand colors alongside MUI
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Teal — primary action color
          600: '#0d9488',
          900: '#134e4a',
        },
        surface: {
          dark: '#1e293b', // Slate 800 — dashboard background
          card: '#0f172a', // Slate 900 — card background
        }
      },
    },
  },
  plugins: [],
};

export default config;
