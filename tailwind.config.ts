import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "white" : "#fcfcfc",
        "black" : "#4d4d4d",
        "primary": "#2bb109",
        "secondary": "#368f1f",
        "tertiary": "#416e36",
        // "red": "#ff0000",
        // "dark-red": "#b10000",
      },
    },
  },
  plugins: [],
}
export default config
