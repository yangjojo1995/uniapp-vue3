import pagesConfig from '@/pages.json'

interface PagesConfig {
  pages: {
    path: string
  }[],
  subPackages?: {
    root: string,
    pages: {
      path: string
    }[]
  }[],
  tabBar?: {
    list: {
      pagePath: string
    }[]
  }
}

interface Url {
  href?: string
  origin?: string
  protocol?: string
  username?: string
  password?: string
  host?: string
  hostname?: string
  port?: string
  pathname?: string
  search?: string
  searchParams?: Record<string, string | string[]>
  hash?: string
}

// 路由记录
interface RouteRecordRaw {
  path: string
  meta: Record<string, any> & {
    isTab: boolean
  }
}

// 用户级的路由地址
interface RouteLocation {
  path: string
  query?: Record<string, string | string[]>
  hash?: string,
  replace?: boolean
}

// 标准化的路由地址
interface RouteLocationNormalized {
  fullPath: string
  path: string
  query: Record<string, string | string[]>
  hash: string
  meta: Record<string, any> & {
    isTab: boolean
  }
}

class Router {
  // 路由配置
  private routeRecordRaws: RouteRecordRaw[] = []

  constructor (pagesConfig: PagesConfig) {
    const routes: RouteRecordRaw[] = []
    for (const item of pagesConfig.pages) {
      routes.push({
        path: this.urlJoin('', item.path),
        meta: { isTab: false }
      })
    }
    if (pagesConfig.subPackages) {
      for (const item of pagesConfig.subPackages) {
        for (const page of item.pages) {
          routes.push({
            path: this.urlJoin('', item.root, page.path),
            meta: { isTab: false }
          })
        }
      }
    }
    if (pagesConfig.tabBar) {
      for (const item of pagesConfig.tabBar.list) {
        const route = routes.find(r => this.urlJoin('', r.path) === this.urlJoin('', item.pagePath))
        if (route) route.meta.isTab = true
      }
    }
    this.routeRecordRaws = routes
  }

  // 拼接路径
  private urlJoin (...args: string[]): string {
    return args.join('/').replace(/\/+/g, '/')
  }

  // 解析查询字符串
  private parseQueryString (query: string): Record<string, string> {
    const result: Record<string, string> = {}
    if (query) {
      const params = query.split('&')
      for (const param of params) {
        const [key, value] = param.split('=')
        result[decodeURIComponent(key)] = decodeURIComponent(value)
      }
    }
    return result
  }

  // 格式化查询字符串
  private stringifyQuery (query: Record<string, string | string[]>): string {
    const result = []
    for (const key in query) {
      if (key == null || key === '') continue
      const value = query[key]
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item == null) continue
          result.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
        }
      } else {
        if (value == null) continue
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    }
    return result.join('&')
  }
  
  // url 分析
  private urlParse (urlString: string): Url {
    const reg = /^(?:([a-z]+:)?(\/\/)(?:([^@:]+)(?::([^@]+))?@)?([^:\/]+)(?::(\d+))?)?([^?]+?)?(\?[^#]*?)?(#.*)?$/
    const match = urlString.match(reg) || []
    const href = match[0] || ''
    const protocol = match[1] || ''
    const slashes = match[2] || ''
    const username = match[3] || ''
    const password = match[4] || ''
    const hostname = match[5] || ''
    const port = match[6] || ''
    const pathname = match[7] || ''
    const search = match[8] || ''
    const hash = match[9] || ''
    const origin = `${protocol}${slashes}${hostname}${port ? `:${port}` : ''}`
    const host = `${hostname}${port ? `:${port}` : ''}`
    const searchParams = this.parseQueryString(search ? search.slice(1) : '')
    return { href, origin, protocol, username, password, host, hostname, port, pathname, search, searchParams, hash }
  }

  // url 解析
  private urlString (url: Url): string {
    if (url.href) return url.href
    let href = ''
    if (url.protocol) href += `${url.protocol}//`
    if (url.username) href += `${url.username}:${url.password || ''}@`
    if (url.host) href += url.host
    else if (url.hostname) href += `${url.hostname}:${url.port || ''}`
    if (url.pathname) href += url.pathname
    if (url.search) href += `${url.search}`
    if (url.hash) href += `${url.hash}`
    return href
  }

  // 路由记录转换标准化的路由地址
  public routeLocationNormalized (to: string | RouteLocation): RouteLocationNormalized | null {
    if (typeof to === 'string') to = { path: to }

    const toUrlParse = this.urlParse(to.path)
    const path = toUrlParse.pathname || '/'
    
    const routeRecordRaw = this.routeRecordRaws.find(r => this.urlJoin('', r.path) === path)
    if (!routeRecordRaw) return null

    const query = toUrlParse.searchParams || {}
    let hash = toUrlParse.hash || ''
    if (to.query) Object.assign(query, to.query)
    if (to.hash) hash = to.hash

    const search = this.stringifyQuery(query)
    const fullPath = this.urlString({ pathname: path, search: search ? `?${search}` : '', hash })
    const meta = routeRecordRaw.meta

    return { fullPath, path, query, hash, meta }
  }

  public push (to: string | RouteLocation): void {
    if (typeof to === 'string') to = { path: to }
    const toLocationNormalized = this.routeLocationNormalized(to)
    if (!toLocationNormalized) throw new Error('路由地址不存在')
    if (toLocationNormalized.meta.isTab) return uni.switchTab({ url: toLocationNormalized.fullPath })
    if (to.replace) return uni.redirectTo({ url: toLocationNormalized.fullPath })
    return uni.navigateTo({ url: toLocationNormalized.fullPath })
  }

  public replace (to: string | RouteLocation): void {
    if (typeof to === 'string') to = { path: to }
    return this.push({ ...to, replace: true })
  }

  public go (delta: number): void {
    if (delta >= 0) throw new Error('delta 必须小于0')
    return uni.navigateBack({ delta: -delta })
  }

  public back (): void {
    return this.go(-1)
  }

  public getRoutes (): RouteRecordRaw[] {
    return this.routeRecordRaws
  }

  public getHomeRouteRecordRaw (): RouteRecordRaw {
    return this.routeRecordRaws[0]
  }
}

const router = new Router(pagesConfig)

export default router
