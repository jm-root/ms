const event = require('jm-event')
const Heart = require('./heart')

const DEFAULT_MAX_RECONNECT_ATTEMPTS = 0 // 默认重试次数0 表示无限制

class WS {
  constructor (opts = {}) {
    event.enableEvent(this)

    const {Adapter, timeout = 0, reconnect = true, reconnectionDelay = 5000, reconnectAttempts = DEFAULT_MAX_RECONNECT_ATTEMPTS} = opts

    this.reconnect = reconnect
    this.autoReconnect = true
    this.reconnectionDelay = reconnectionDelay
    if (reconnect === false) this.autoReconnect = false
    this.maxReconnectAttempts = reconnectAttempts
    this.reconnectAttempts = 0
    this.reconnectTimer = null

    this.Adapter = Adapter
    this.uri = null
    this.ws = null
    this.connecting = null // or a promise instance
    const heart = new Heart()
    this.heart = heart
    heart
      .on('heartBeat', () => {
        return this.emit('heartBeat')
      })
      .on('heartDead', () => {
        this.close()
        this.autoReconnect = this.reconnect
      })
  }

  onReady () {
    if (this.ws) return
    return this.connect()
  }

  async _connect () {
    const {uri} = this

    if (!uri) throw new Error('invalid uri')

    if (this.ws) return

    this.emit('connect')

    return new Promise((resolve, reject) => {

      let ws = null
      try {
        ws = new this.Adapter(uri)
      } catch (e) {
        return reject(e)
      }

      ws
        .on('message', message => {
          this.heart.reset()
          this.emit('message', message)
        })
        .on('open', () => {
          this.emit('open')
          this.ws = ws
          this.connecting = null
          this.heart.reset()
          this.resetReconnect()
          this.autoReconnect = this.reconnect
          resolve()
        })
        .on('error', e => {
          this.emit('error', e)
          this.connecting = null
          reject(e)
        })
        .on('close', event => {
          this.emit('close', event)
          this.heart.stop()
          this.ws = null
          this.connecting = null

          if (this.autoReconnect) {
            if (this.maxReconnectAttempts && this.reconnectAttempts >= this.maxReconnectAttempts) {
              this.emit('connectFail')
              return
            }
            this.reconnectAttempts++
            this.emit('reconnect')
            this.reconnectTimer = setTimeout(() => {
              this.reconnectTimer = null
              this.connect()
            }, this.reconnectionDelay)
          }

        })

    })
  }

  connect (uri) {
    uri && (this.uri = uri)
    if (!this.connecting) {
      this.connecting = this._connect()
    }
    return this.connecting
  }

  async send () {
    await this.onReady()
    try {
      this.ws.send(...arguments)
      this.heart.reset()
    } catch (e) {
      throw e
    }
  }

  resetReconnect () {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.autoReconnect = false
    this.reconnectAttempts = 0
  }

  close () {
    this.resetReconnect()
    if (!this.ws) return
    this.ws.close(...arguments)
  }

}

module.exports = WS
