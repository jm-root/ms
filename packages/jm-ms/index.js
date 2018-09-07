if (typeof XMLHttpRequest !== 'undefined') {
  module.exports = require('./dist/browser.js').default
} else {
  module.exports = require('./dist/index.js').default
}
module.exports.default = module.exports
