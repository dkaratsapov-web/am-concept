/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false }, // не сбрасываем — дизайн живёт в styles.css
  theme: { extend: {} },
  plugins: [],
};
