const { logger } = require('jm-logger')
const { client } = require('../lib')

logger.level = 'info'

const uri = 'ws://localhost:3000/sso'

let $ = null

async function prepare () {
  if (!$) {
    $ = await client({ uri })
  }
}

async function main () {
  await prepare()
  const t = Date.now()
  try {
    for (let i = 0; i < 10000; i++) {
      await $.request('/', 'get')
    }
    console.log('t', Date.now() - t)
    $.close()
  } catch (e) {
    console.error(e)
  }
}

main()
