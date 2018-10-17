const event = require('jm-event')

/**
 * 处理心跳
 */
class Heart {
  constructor (opts = {}) {
    event.enableEvent(this)
    this.timeout = opts.timeout || 60000 // 60 ms
  }

  reset () {
    this.stop()
    this.start()
  }

  start () {
    const {timeout} = this
    this.timeoutObj = setTimeout(() => {
      if (this.emit('heartBeat')) {
        this.serverTimeoutObj = setTimeout(() => {
          this.emit('heartDead')
        }, timeout)
      }
    }, timeout)
  }

  stop () {
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
  }
}

module.exports = Heart
