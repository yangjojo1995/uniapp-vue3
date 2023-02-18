/** 事件监听器 */
class EventListener {
  /** 侦听器 */
  private eventListeners: { [name: string]: Function[] } = {}

  /**
   * 返回监听器数组
   * @param name 事件名
   */
  public listeners(name: string) {
    return this.eventListeners[name] || []
  }

  /**
   * 注册事件
   * @param name 事件名
   * @param listener 回调函数
   */
  public on(name: string, listener: Function) {
    if (!this.eventListeners[name]) {
      this.eventListeners[name] = []
    }
    this.eventListeners[name].push(listener)
  }

  /**
   * 注册只触发一次的事件
   * @param name 事件名
   * @param listener 回调函数
   */
  public once(name: string, listener: Function) {
    const self = this
    const onceListener = function (...args: any[]) {
      self.off(name, onceListener)
      return listener(...args)
    }
    return self.on(name, onceListener)
  }

  /**
   * 注销事件
   * @param name 事件名
   * @param listener 回调函数
   */
  public off(name: string, listener?: Function) {
    if (!this.eventListeners[name] || !this.eventListeners[name].length) {
      return
    }
    if (!listener) {
      delete this.eventListeners[name]
      return
    }
    const index = this.eventListeners[name].indexOf(listener)
    if (index >= 0) {
      this.eventListeners[name].splice(index, 1)
      if (!this.eventListeners[name].length) {
        delete this.eventListeners[name]
      }
    }
  }

  /**
   * 手动触发事件
   * @param name
   */
  public trigger(name: string, ...args: any[]) {
    if (!this.eventListeners[name] || !this.eventListeners[name].length) {
      return
    }
    for (const listener of this.eventListeners[name]) {
      listener(...args)
    }
  }
}

/** Socket Web端代理  */
class SocketManagerWeb {
  private ws?: WebSocket
  public eventListener: EventListener = new EventListener()
  constructor() {
    this.eventListener = new EventListener()
  }
  public connect(url: string) {
    this.ws = new WebSocket(url)
    this.ws.onopen = this.eventListener.trigger.bind(this.eventListener, 'open')
    this.ws.onerror = this.eventListener.trigger.bind(this.eventListener, 'error')
    this.ws.onmessage = (event) => this.eventListener.trigger('message', event.data)
    this.ws.onclose = this.eventListener.trigger.bind(this.eventListener, 'close')
  }
  public disconnect() {
    this.ws?.close()
    this.ws = undefined
  }
  public send(message: string) {
    return this.ws?.send(message)
  }
  public onOpen(listeners: Function) {
    return this.eventListener.on('open', listeners)
  }
  public offOpen(listeners: Function) {
    return this.eventListener.off('open', listeners)
  }
  public onError(listeners: Function) {
    return this.eventListener.on('error', listeners)
  }
  public offError(listeners: Function) {
    return this.eventListener.off('error', listeners)
  }
  public onClose(listeners: Function) {
    return this.eventListener.on('close', listeners)
  }
  public offClose(listeners: Function) {
    return this.eventListener.off('close', listeners)
  }
  public onMessage(listeners: Function) {
    return this.eventListener.on('message', listeners)
  }
  public offMessage(listeners: Function) {
    return this.eventListener.off('message', listeners)
  }
}
export interface SocketIoOptions {
  url?: string
  socket?: SocketManagerWeb
  compatibleSendPromise?: boolean
  compatibleSendPromiseOvertime?: number
  compatibleEmitPromise?: boolean
  compatibleEmitPromiseOvertime?: number
  handleMessageStringify?: (params: { id: string, name?: string, query: any[] }) => string | false | Promise<string | false>,
  handleMessageParse?: (message: string) => { id?: string, name?: string, query?: any[], result?: any } | false | Promise<{ id?: string, name?: string, query?: any[], result?: any } | false>
}

/** Socket */
class SocketIo {

  public url: string = ''
  public get connected() { return this._connected }
  public get connecting() { return this._connecting }

  /** 已连接 */
  private _connected: boolean = false

  /** 连接中 */
  private _connecting: boolean = false

  /** 唯一标识下标 */
  private uniqueIndex: number = 0

  /** 兼容 发送事件 promise */
  private compatibleSendPromise: boolean = false
  private compatibleSendPromiseOvertime: number = 1000 * 60
  private compatibleEmitPromise: boolean = false
  private compatibleEmitPromiseOvertime: number = 1000 * 60

  /** socket */
  private socket: SocketManagerWeb = new SocketManagerWeb()

  /** 事件 */
  private readonly eventListener: EventListener = new EventListener()

  constructor(options?: SocketIoOptions) {
    // 配置
    if (options) Object.assign(this, options)

    // 确保状态
    this.socket.onOpen(() => {
      this._connected = true
      this._connecting = false
    })

    // 确保状态
    this.socket.onError(() => {
      this._connected = false
      this._connecting = false
    })

    // 确保状态
    this.socket.onClose(() => {
      this._connected = false
      this._connecting = false
    })

    // 确保状态
    this.socket.onMessage(() => {
      this._connected = true
      this._connecting = false
    })

    // 处理接收消息
    this.socket.onMessage(this.handleMessageListener.bind(this))

    // 自动连接
    if (options && options.url) {
      this.url = options.url
      this.connect()
    }
  }

  // 将监听事件转换为 Promise 事件
  private handlePromiseListener (listener: Function, onResolve: Function, onReject?: Function, offResolve?: Function, offReject?: Function, overtime?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let responded = false
      const timer = setTimeout(() => {
        if (responded) return
        responded = true
        offResolve && offResolve(rf)
        offReject && offReject(ef)
        return reject(new Error('响应超时'))
      }, overtime || 1000 * 60)
      const rf = (result: any) => {
        if (responded) return
        responded = true
        offResolve && offResolve(rf)
        offReject && offReject(ef)
        clearTimeout(timer)
        return resolve(result)
      }
      const ef = (error: Error) => {
        if (responded) return
        responded = true
        offResolve && offResolve(rf)
        offReject && offReject(ef)
        clearTimeout(timer)
        return reject(error)
      }
      onResolve(rf)
      onReject && onReject(ef)
      return listener()
    })
  }

  // 获取唯一标识
  private getUniqueId () {
    return String(this.uniqueIndex++)
  }

  // 打包消息体
  private handleMessageStringify (params: { id: string, name?: string, query: any[] }) {
    return JSON.stringify(params)
  }

  // 解析消息体
  private handleMessageParse (message: string) {
    return Object.assign({
      id: undefined,
      name: undefined,
      query: undefined,
      result: undefined,
    }, JSON.parse(message))
  }

  // 处理接收消息
  private async handleMessageListener (message: string) {
    const messageData = await this.handleMessageParse(message)
    if (!messageData || !messageData.name) return
    const { id, name, result } = messageData
    const eventName = `${name || '__sendEvent__'}`
    this.eventListener.trigger(eventName, result)
    if (id) {
      this.eventListener.trigger(`${eventName}:${id}`, result)
      this.eventListener.off(`${eventName}:${id}`)
    }
  }

  // 连接
  public async connect(url?: string) {
    url = url || this.url
    if (!url) throw new Error('缺少连接 socket url 参数')

    this.url = url

    // 如果正在连接，则直接返回
    if (this.connecting) {
      throw new Error('连接 socket 操作频繁')
    }

    // 设置连接中状态
    this._connecting = true

    // 如果已连接，则先断开
    await this.disconnect()

    // 应为断开后，状态会重置，所以需要再次强制设置状态
    this._connecting = true

    try {
      await this.handlePromiseListener(
        this.socket.connect.bind(this.socket, url),
        this.socket.onOpen.bind(this.socket),
        this.socket.onError.bind(this.socket),
        this.socket.offOpen.bind(this.socket),
        this.socket.offError.bind(this.socket),
        1000 * 60
      )
      this._connecting = false
    } catch (error) {
      this._connecting = false
      throw new Error('连接 socket 失败')
    }
  }

  // 断开
  public async disconnect() {
    if (this.connected) {
      await this.handlePromiseListener(
        this.socket.disconnect.bind(this.socket),
        this.socket.onClose.bind(this.socket),
        this.socket.onError.bind(this.socket),
        this.socket.offClose.bind(this.socket),
        this.socket.offError.bind(this.socket),
        1000 * 60
      )
    }
  }

  // 发送消息事件
  public async send(...query: any[]) {
    if (!this.connected) throw new Error('socket 没有处于连接中')

    const id = this.getUniqueId()

    const message = await this.handleMessageStringify({ id, query })
    if (!message) return
    if (typeof message !== 'string') throw new Error('发送的消息必须是字符串')

    this.eventListener.trigger('socket:send', message)

    if (this.compatibleSendPromise) {
      return this.handlePromiseListener(
        this.socket.send.bind(this.socket, message),
        this.eventListener.once.bind(this.eventListener, `__sendEvent__:${id}`),
        undefined,
        undefined,
        undefined,
        this.compatibleSendPromiseOvertime
      )
    } else {
      let listener: Function
      if (typeof query[query.length - 1] === 'function') {
        listener = query.pop()
        this.eventListener.once(`__sendEvent__:${id}`, listener)
      }
      return this.socket.send(message)
    }
  }

  // 发送具名消息事件
  public async emit(name: string, ...query: any[]) {
    if (!this.connected) throw new Error('socket 没有处于连接中')

    const id = this.getUniqueId()

    const message = await this.handleMessageStringify({ id, name, query })
    if (!message) return
    if (typeof message !== 'string') throw new Error('发送的消息必须是字符串')

    this.eventListener.trigger('socket:send', message)

    if (this.compatibleEmitPromise) {
      return this.handlePromiseListener(
        this.socket.send.bind(this.socket, message),
        this.eventListener.once.bind(this.eventListener, `${name}:${id}`),
        undefined,
        undefined,
        undefined,
        this.compatibleEmitPromiseOvertime
      )
    } else {
      let listener: Function
      if (typeof query[query.length - 1] === 'function') {
        listener = query.pop()
        this.eventListener.once(`${name}:${id}`, listener)
      }
      return this.socket.send(message)
    }
  }

  // 注册事件
  public on(name: string, listener: Function) {
    return this.eventListener.on(name, listener)
  }
  
  // 注册只触发一次的事件
  public once(name: string, listener: Function) {
    return this.eventListener.once(name, listener)
  }

  // 注销事件
  public off(name: string, listener: Function) {
    return this.eventListener.off(name, listener)
  }

  // 返回监听器数组
  public listeners(name: string) {
    return this.eventListener.listeners(name)
  }

  // 监听连接事件
  public onOpen(listener: Function) {
    return this.socket.onOpen(listener)
  }
  // 取消监听连接事件
  public offOpen(listener: Function) {
    return this.socket.offOpen(listener)
  }
  // 监听一次连接事件
  public onceOpen(listener: Function) {
    const self = this
    const onceListener = function (...args: any[]) {
      self.socket.offOpen(onceListener)
      return listener(...args)
    }
    return self.socket.onOpen(listener)
  }
  // 监听关闭事件
  public onClose(listener: Function) {
    return this.socket.onClose(listener)
  }
  // 取消监听关闭事件
  public offClose(listener: Function) {
    return this.socket.offClose(listener)
  }
  // 监听一次关闭事件
  public onceClose(listener: Function) {
    const self = this
    const onceListener = function (...args: any[]) {
      self.socket.offClose(onceListener)
      return listener(...args)
    }
    return self.socket.onClose(listener)
  }
  // 监听错误事件
  public onError(listener: Function) {
    return this.socket.onError(listener)
  }
  // 取消监听错误事件
  public offError(listener: Function) {
    return this.socket.offError(listener)
  }
  // 监听一次错误事件
  public onceError(listener: Function) {
    const self = this
    const onceListener = function (...args: any[]) {
      self.socket.offError(onceListener)
      return listener(...args)
    }
    return self.socket.onError(listener)
  }
  // 监听消息事件
  public onMessage(listener: Function) {
    return this.socket.onMessage(listener)
  }
  // 取消监听消息事件
  public offMessage(listener: Function) {
    return this.socket.offMessage(listener)
  }
  // 监听一次消息事件
  public onceMessage(listener: Function) {
    const self = this
    const onceListener = function (...args: any[]) {
      self.socket.offMessage(onceListener)
      return listener(...args)
    }
    return self.socket.onMessage(listener)
  }
  // 监听发送事件
  public onSend(listener: Function) {
    return this.eventListener.on('socket:send', listener)
  }
  // 取消监听发送事件
  public offSend(listener: Function) {
    return this.eventListener.off('socket:send', listener)
  }
  // 监听一次发送事件
  public onceSend(listener: Function) {
    return this.eventListener.once('socket:send', listener)
  }
}

export default SocketIo
export { EventListener, SocketIo, SocketManagerWeb }
