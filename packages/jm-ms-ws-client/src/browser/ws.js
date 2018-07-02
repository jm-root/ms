import event from 'jm-event'
import error from 'jm-err'

const Err = error.Err
let errNetwork = error.err(Err.FA_NETWORK)

export default class Adapter {
  constructor (uri) {
    let self = this
    event.enableEvent(this)
    let ws = new WebSocket(uri)
    this.ws = ws
    ws.on('message', function (event) {
      self.emit('message', event.data)
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
