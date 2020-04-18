// const purgecss = require('@fullhuman/postcss-purgecss')


module.exports = {
  // modules: true,
  plugins: [
    // ...
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    // require('@fullhuman/postcss-purgecss'),
    // purgecss({
    //   content: ['./**/*.html']
    // })
    // ...
  ]
}
