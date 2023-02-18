import config from '@/config'
import { SocketIo, SocketManagerWeb } from './socket'

declare const wx: {
  connectSocket: (paramr: any) => UniApp.SocketTask
}

/** Socket Wx代理 */
class SocketManagerWx extends SocketManagerWeb {
  private WxWs?: UniApp.SocketTask
  public connect(url?: string) {
    this.WxWs = wx.connectSocket({ url })
    this.WxWs.onOpen(this.eventListener.trigger.bind(this.eventListener, 'open'))
    this.WxWs.onError(this.eventListener.trigger.bind(this.eventListener, 'error'))
    this.WxWs.onMessage((event) => this.eventListener.trigger('message', event.data))
    this.WxWs.onClose(this.eventListener.trigger.bind(this.eventListener, 'close'))
  }
  public disconnect() {
    this.WxWs?.close({})
    this.WxWs = undefined
  }
  public send(message: string) {
    return this.WxWs?.send({ data: message })
  }
}

/** 乡产投盟 SocketIo */
class XctmSocketIo extends SocketIo {
  // 是否登录
  public logged: boolean = false
  // 是否重新连接中
  public reconnecting: boolean = false

  // 等待发送事件队列
  public waitingSendEventQueue: { query: any[], resolve: (value: any) => any, reject: (value: any) => any }[]  = []
  public waitingEmitEventQueue: { name: string, query: any[], resolve: (value: any) => any, reject: (value: any) => any }[]  = []

  constructor() {
    super({
      socket: new SocketManagerWx(),
      compatibleSendPromise: true,
      compatibleEmitPromise: true,
      handleMessageStringify: async (params) => {
        try {
          return JSON.stringify({
            requestId: params.id,
            api: params.name,
            body: params.query[0]
          })
        } catch (error) {
          return false
        }
      },
      handleMessageParse: async (message) => {
        let response: {
          requestId?: string
          api: string
          code: number
          msg: string
          data?: any
        }

        // 过滤不合格数据
        try {
          response = JSON.parse(message)
          if (typeof response !== 'object') throw new Error('响应消息格式错误')
          const keys = Object.keys(response)
          if (!keys.includes('api')) throw new Error('响应消息格式错误')
          if (!keys.includes('code')) throw new Error('响应消息格式错误')
          if (!keys.includes('msg')) throw new Error('响应消息格式错误')
        } catch (error) {
          return false
        }

        const { code, msg, data } = response

        // 401 退出登录
        if (code === 401) {
          await this.logout()
          throw new Error(msg)
        }

        // 报错提示
        if (code !== 200) {
          uni.showToast({ title: msg, icon: 'none' })
          throw new Error(msg)
        }

        const id = response.requestId
        const name = response.api
        const query = undefined
        const result = data
        return { id, name, query, result }
      }
    })

    // 处理重连
    this.onError(this.handleReconnect.bind(this))
    this.onClose(this.handleReconnect.bind(this))

    // 处理定时 ping
    this.onOpen(this.handleTimingPing.bind(this))

    // 处理等待发送事件
    this.onOpen(this.handleWaitingSendEventQueue.bind(this))
  }

  // 处理重连
  private async handleReconnect () {
    // 如果重连中，则不重连
    if (this.reconnecting) return

    // 如果不是登录中，则不重连
    if (!this.logged) return

    // 如果z正在连接，则不重连
    if (this.connecting) return

    // 如果已经连接，则不重连
    if (this.connected) return

    this.reconnecting = true
    
    try {
      await this.connect()
      this.reconnecting = false
    } catch (error) {
      setTimeout(() => {
        this.reconnecting = false
        this.handleReconnect()
      }, 3000)
    }
  }

  // 处理定时 ping
  private async handleTimingPing () {
    try {
      await this.ping()
      setTimeout(this.handleTimingPing.bind(this), 1000 * 30)
    } catch (error) {}
  }

  // 处理等待发送事件
  private async handleWaitingSendEventQueue () {
    for (const item of this.waitingSendEventQueue) {
      this.send(...item.query).then(item.resolve).catch(item.reject)
    }
    for (const item of this.waitingEmitEventQueue) {
      this.emit(item.name, ...item.query).then(item.resolve).catch(item.reject)
    }
    this.waitingSendEventQueue = []
    this.waitingEmitEventQueue = []
  }

  /** 登录 */
  public async login(token: string, subToken: string) {
    this.logged = true
    try {
      await this.connect(`${config.WS_BASE_URL}/websocket/${token}/${subToken}`)
      await this.getUnReadTotal()
    } catch (error) {}
  }

  /** 退出登录 */
  public async logout() {
    this.waitingSendEventQueue = []
    this.waitingEmitEventQueue = []
    this.logged = false
    try {
      await this.disconnect()
    } catch (error) {}
    this.waitingSendEventQueue = []
    this.waitingEmitEventQueue = []
    this.logged = false
  }

  // 发送消息事件
  public async send(...query: any[]) {
    if (!this.logged) throw new Error('未登录')

    // 如果没有连接，进入等待发送事件队列
    if (!this.connected) {
      return new Promise((resolve, reject) => {
        return this.waitingSendEventQueue.push({ query, resolve, reject })
      })
    }

    // 如果没有连接，尝试连接
    if (!this.connected && !this.connecting) {
      await this.connect()
    }

    return super.send(...query)
  }

  // 发送具名消息事件
  public async emit(name: string, ...query: any[]) {
    if (!this.logged) throw new Error('未登录')

    // 如果没有连接，进入等待发送事件队列
    if (!this.connected) {
      return new Promise((resolve, reject) => {
        return this.waitingEmitEventQueue.push({ name, query, resolve, reject })
      })
    }

    // 如果没有连接，尝试连接
    if (!this.connected && !this.connecting) {
      await this.connect()
    }

    return super.emit(name, ...query)
  }

  // Ping
  public async ping() {
    return this.emit('ping')
  }

  /** 获取联系人列表 */
  public async getContactList() {
    return this.emit('getContactList')
  }

  /** 获取聊天历史 */
  public async getChatHistory(params: { contact: string }) {
    return this.emit('getChatHistory', params)
  }

  /** 获取未读数 */
  public async getUnReadTotal() {
    return this.emit('getUnReadTotal')
  }

  /** 获取联系人详情 */
  public async getContact(params: { contact: string }) {
    return this.emit('getContact', params)
  }

  /** 主动上报消息已读 */
  public async readMessage(params: { contact: string }) {
    return this.emit('readMessage', params)
  }

  /** 发送聊天消息 */
  public async sendChat(params: { target: string, type: 'text', content: string }) {
    return this.emit('sendChat', params)
  }

  /** 监听未读数 */
  public onUnReadTotal (listener: Function) {
    return this.on('getUnReadTotal', listener)
  }
  
  /** 取消监听未读数 */
  public offUnReadTotal (listener: Function) {
    return this.off('getUnReadTotal', listener)
  }

  /** 监听联系人列表 */
  public onContactList (listener: Function) {
    return this.on('getContactList', listener)
  }

  /** 取消监听联系人列表 */
  public offContactList (listener: Function) {
    return this.off('getContactList', listener)
  }

  /** 监听消息 */
  public onChatMessage (listener: Function) {
    return this.on('sendChat', listener)
  }

  /** 取消监听消息 */
  public offChatMessage (listener: Function) {
    return this.off('sendChat', listener)
  }

}

const socketIo = new XctmSocketIo()


// #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-ALIPAY
const accountInfo = uni.getAccountInfoSync()
const env = accountInfo.miniProgram.envVersion
if (env === 'trial' || env === 'release') {
  socketIo.onOpen(() => console.log(`socket:onopen`))
  socketIo.onClose(() =>console.log(`socket:onclose`))
  socketIo.onError(() =>console.log(`socket:onerror`))
  socketIo.onMessage((message: string) => console.log(`socket:onmessage`, { message }))
  socketIo.onSend((message: string) => console.log(`socket:onsend`, { message }))
}
// #endif

globalThis.socketIo = socketIo

export default socketIo
