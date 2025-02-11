/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/App.jsx",
    "./src/main.jsx",
    "./src/user/page/Home.jsx",
    "./src/user/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/dashboard-doctor/layouts/sidebar.jsx"
  ],
     darkMode: "class", // تفعيل الوضع الداكن باستخدام class
  theme: {
    extend: {
      fontFamily: {
        arabic: ["Cairo", "sans-serif"],
      },
      
      colors: {
        darkText: "#333",
        customText: "rgb(186 412 290 / var(--tw-text-opacity, 1))",
        mainColor: "rgb(95 111 255)",
      },
    },
  },
  plugins: [],
};

