import event from 'jm-event'
import error from 'jm-err'
import WebSocket from 'ws'

const Err = error.Err
let errNetwork = error.err(Err.FA_NETWORK)

export default class Adapter {
  constructor (uri) {
    let self = this
    event.enableEvent(this)
    let ws = new WebSocket(uri)
    this.ws = ws
    ws.on('message', function (data, flags) {
      // flags.binary will be set if a binary data is received.
      // flags.masked will be set if the data was masked.
      self.emit('message', data)
    })
    ws.onopen = () => {
      self.emit('open')
    }
    ws.onerror = event => {
      self.emit('error', event)
    }
    ws.onclose = event => {
      self.emit('close', event)
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
