
class Paging {

  /** 请求ID */
  private __requestId = 0

  /** 请求服务 */
  public service: (page: number, size: number) => Promise<{ total: number, records: any[] }>

  /** 当前页数 */
  public page: number = 1

  /** 每页数量 */
  public size: number = 10

  /** 总记录数 */
  public total: number = 0

  /** 范围 */
  public records: any[] = []

  /** 是否加载中 */
  public loading: boolean = false

  /** 加载失败错误对象 */
  public error: Error | null = null

  /** 加载失败错误信息 */
  public errorMessage: string | null = null

  /** 构造函数 */
  constructor(service: Paging['service']) {
    this.service = service
  }

  /** 更新当前页面 */
  public async update () {
    if (this.loading) return
    this.loading = true
    try {
      const __requestId = this.__requestId += 1
      const { total, records } = await this.service(this.page, this.size)
      if (this.__requestId !== __requestId) return

      this.total = total
      this.records = [...records]

      this.error = null
      this.errorMessage = null
      this.loading = false
    } catch (e) {
      this.error = e as Error
      this.errorMessage = this.error.message
      this.loading = false
      throw e
    }
  }

  /** 跳转到 page 页 */
  public go (page: number) {
    if (this.loading) return
    this.page = page
    return this.update()
  }

  /** 重置刷新 */
  public async refresh () {
    this.page = 1
    this.records = []
    this.error = null
    this.errorMessage = null
    await this.update()
  }
}

class PagingLazy extends Paging {
  
  /** 列表 */
  public page: number = 0
  public list: any[] = []

  /** 是否加载完成 */
  public finished: boolean = false

  /** 是否为空 */
  get isEmpty (): boolean {
    return this.finished && this.total <= 0
  }

  /** 加载更多的状态 */
  get loadStatus (): 'more' | 'loading' | 'noMore' {
    if (this.loading) return 'loading'
    else if (this.finished) return 'noMore'
    return 'more'
  }

  /** 更新当前页面（删除） */
  public async update () {
    if (this.finished) return
    await super.update()
    this.finished = this.page * this.size >= this.total
  }

  /** 跳转到 page 页 */
  public async go (page: number) {
    if (this.loading) return
    if (this.finished) return
    if (page <= this.page || page > this.page + 1) throw new Error('页码只能是下一页')
    await super.go(page)
    this.list = this.list.concat(this.records)
  }

  /** 重置刷新 */
  public async refresh () {
    this.list = []
    this.finished = false
    await super.refresh()
    this.list = this.list.concat(this.records)
  }

  /** 加载下一页 */
  public async load () {
    return this.next()
  }

  /** 加载下一页 */
  public async next () {
    await this.go(this.page + 1)
  }
}

export default Paging
export { Paging, PagingLazy }
