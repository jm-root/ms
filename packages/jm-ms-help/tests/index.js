const helper = require('../lib')
const MS = require('jm-ms-core')
let ms = new MS()
let router = ms.router()

// 附加help信息
router.add('/', 'get', (opts = {}) => {
  opts.help = {
    hi: 123,
    status: 1
  }
})

helper.enableHelp(router)

router.get('/', { abc: 123 })
  .then(doc => {
    console.info('1: ', doc)
  })

router.clear()
helper.enableHelp(router)
router.get('/')
  .then(doc => {
    console.info('2: ', doc)
  })
