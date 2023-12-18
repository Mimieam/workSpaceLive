/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx,html}",
    //   './node_modules/preline/preline.js',
    ],
    theme: {
      extend: {},
    },
    plugins: [
        // require('preline/plugin'),
        // require("daisyui")
    ],
  }
// module.exports = {
//   theme: {
//     extend: {},
//   },
//   variants: {},
//   plugins: [],
//   purge: {
//     mode: 'all',
//     preserveHtmlElements: false,
//     content:[
//     './app/**/*.html',
//     './app/**/*.jsx',
//     './app/**/*.js',
//     ]
//   },
// }
