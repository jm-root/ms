const event = require('jm-event')
const error = require('jm-err')
const WebSocket = require('ws')

const Err = error.Err
let errNetwork = error.err(Err.FA_NETWORK)

module.exports = class Adapter {
  constructor (uri) {
    event.enableEvent(this)
    let ws = new WebSocket(uri)
    this.ws = ws
    ws.on('message', (data, flags) => {
      this.emit('message', data)
    })
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
    this.ws.send(...arguments)
  }

  close () {
    if (!this.ws) return
    this.ws.close(...arguments)
  }
}
