require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
let config = {
  development: {
    debug: true,
    lng: 'zh_CN',
    port: 3000,
    modules: {
      example: {
        module: process.cwd() + '/lib'
      }
    }
  },
  production: {
    lng: 'zh_CN',
    port: 80,
    modules: {
      example: {
        module: process.cwd() + '/lib'
      }
    }
  }
}

let env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

module.exports = config
