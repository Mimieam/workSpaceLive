module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
  purge: {
    mode: 'all',
    preserveHtmlElements: false,
    content:[
    './app/**/*.html',
    './app/**/*.jsx',
    './app/**/*.js',
    ]
  },
}
