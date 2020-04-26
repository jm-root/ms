if (typeof XMLHttpRequest !== 'undefined') {
  module.exports = require('./dist/browser.js')
} else {
  module.exports = require('./dist/index.js')
}
