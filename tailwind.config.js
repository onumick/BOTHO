/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bu-navy': '#1B2A4A',
        'bu-maroon': '#7B1A2C',
        'bu-orange': '#D95F0E',
        'bu-teal': '#0A7B73',
        'bu-gold': '#C9922A',
        'bu-cream': '#F5F0E8',
      },
      fontFamily: {
        sora: ['Sora', 'ui-sans-serif', 'system-ui'],
        dmsans: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        soft: '0 12px 30px rgba(27, 42, 74, 0.12)',
      },
    },
  },
  plugins: [],
};
