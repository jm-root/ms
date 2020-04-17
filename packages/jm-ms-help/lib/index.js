const cluster = require('cluster')
const fs = require('fs')
const path = require('path')
const error = require('jm-err')
const { Err } = error

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

  // health
  const { status } = o
  if (status !== undefined && !status) {
    const e = error.err(Err.FA_UNAVAILABLE)
    e.data = o
    throw e
  }

  return o
}

function help (opts = {}) {
  return deal(opts, pkg)
}

function enableHelp (router, pkg) {
  if (pkg) {
    router.add('/', 'get', (opts = {}) => {
      deal(opts, pkg)
    })
  }
  router.add('/', 'get', help)
}

module.exports = {
  help,
  enableHelp
}
