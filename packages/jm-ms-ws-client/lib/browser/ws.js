const { EventEmitter } = require('jm-event')
const error = require('jm-err')

const Err = error.Err
let errNetwork = error.err(Err.FA_NETWORK)

module.exports = class Adapter extends EventEmitter {
  constructor (uri) {
    super({ async: true })
    const ws = new WebSocket(uri) // eslint-disable-line
    this.ws = ws
    ws.onmessage = event => {
      this.emit('message', event.data)
    }
    ws.onopen = () => {
      this.emit('open')
    }
    ws.onerror = event => {
      this.emit('error', event)
    }
    ws.onclose = event => {
      this.emit('close', event)
    }
  }

  send () {
    if (!this.ws) throw errNetwork
    this.ws.send.apply(this.ws, arguments)
  }

  close () {
    if (!this.ws) throw errNetwork
    this.ws.close.apply(this.ws, arguments)
  }
}
