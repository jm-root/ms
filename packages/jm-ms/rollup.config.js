function fn (opts) {
  return require('jm-rollup')(__dirname, opts)
}

module.exports = [
  fn(),
  fn({
    inputFilename: 'lib/browser',
    outputFilename: 'dist/browser'
  })
]
