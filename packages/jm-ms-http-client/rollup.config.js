function fn (opts) {
  return require('jm-rollup')(__dirname, opts)
}

module.exports = [
  fn(),
  fn({
    inputFilename: 'lib/browser/index',
    outputFilename: 'dist/browser'
  }),
  fn({
    inputFilename: 'lib/mdl/index',
    outputFilename: 'dist/module'
  })
]
