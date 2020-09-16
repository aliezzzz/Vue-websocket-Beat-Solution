const socketAPI = {
  websock: null,
  wsCallback: {},
  initWebSocket () { // 初始化websocket
    // ws地址
    this.websock = new WebSocket('ws://127.0.0.1:2120/websocket')
    this.websock.onopen = this.websocketopen
    this.websock.onclose = this.websocketclose
    this.websock.onmessage = this.websocketonmessage
    return this.wsCallback
  },
  websocketopen (e) {
    console.log('-----webSocket连接成功！-----')
  },
  websocketonmessage (e) {
    const redata = JSON.parse(e.data)
    socketAPI.wsCallback[redata.action](redata)
  },
  websocketsend (data) {
    socketAPI.websock.send(JSON.stringify(data))
  },
  websocketclose (e) { // 关闭
    console.log('connection closed (' + e.code + ')')
    setTimeout(function () {
      socketAPI.initWebSocket()
    }, 5000)
  } // WS END
}

const plugin = {
  install: (Vue, Options) => {
    const wsCallback = socketAPI.initWebSocket()
    Vue.mixin({
      created () {
        if (this.$options.sockets) {
          const keys = Object.keys(this.$options.sockets)
          keys.forEach(item => {
            // 改变 $options.sockets中的上下文
            wsCallback[item] = (data) => {
              this.$options.sockets[item].call(this, data)
            }
          })
        }
      },
      beforeDestroy () {
        if (this.$options.sockets) {
          const keys = Object.keys(this.$options.sockets)
          keys.forEach(item => {
            wsCallback[item] = () => {}
          })
        }
      }
    })
  }
}

const send = socketAPI.websocketsend

export {
  plugin,
  send
}
