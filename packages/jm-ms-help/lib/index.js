const cluster = require('cluster')
const fs = require('fs')
const path = require('path')

let pkg = null
let pkgFile = path.join(process.cwd(), '/package.json')
try {
  fs.accessSync(pkgFile, fs.constants.R_OK)
  pkg = require(pkgFile)
} catch (e) {
}

function deal (opts, pkg) {
  opts.help || (opts.help = {})
  let o = opts.help
  if (pkg) {
    o.name || (o.name = pkg.name)
    o.version || (o.version = pkg.version)
  }
  if (cluster.isWorker) {
    o.clusterId = cluster.worker.id
  }
  return o
}

let help = function (opts = {}) {
  return deal(opts, pkg)
}

let enableHelp = function (router, pkg) {
  if (pkg) {
    router.add('/', 'get', (opts = {}) => {
      deal(opts, pkg)
    })
  }
  router.add('/', 'get', help)
}

module.exports = {
  help: help,
  enableHelp: enableHelp
}
