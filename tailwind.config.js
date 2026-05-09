/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#09090b',
        graphite: '#171717',
        steel: '#2f343b',
        express: '#e11d2f',
        ember: '#ff3548',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(225, 29, 47, 0.22)',
        panel: '0 24px 70px rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
