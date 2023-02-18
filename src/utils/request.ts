/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { getToken, setToken, getUserInfo, setUserInfo } from '@/plugins/app-core'
import { getSubToken } from '@/utils/subToken'
import sha256 from '@/utils/sha256'
import config from '@/config'

type AnyObject = Record<string, any>
interface RequestOptions extends UniApp.RequestOptions { path?: string, params?: string | AnyObject }
interface RequestError extends Error { code: number, response?: UniApp.RequestSuccessCallbackResult }
interface RequestBusinessResult { code: number, data: string | number | boolean | AnyObject | any[] | null, msg: string }
interface RequestResult extends UniApp.RequestSuccessCallbackResult { data: RequestBusinessResult }

interface RequestFunction {
  (options: RequestOptions): Promise<any>
  get?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  post?: (url: string, data?: RequestOptions['data'], options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  put?: (url: string, data?: RequestOptions['data'], options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  delete?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  connect?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  head?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  options?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  trace?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
}

interface Request extends RequestFunction {
  get: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  post: (url: string, data?: RequestOptions['data'], options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  put: (url: string, data?: RequestOptions['data'], options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  delete?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  connect?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  head?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  options?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
  trace?: (url: string, options?: Omit<RequestOptions, 'url'>) => Promise<RequestBusinessResult['data']>
}

function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function handleRequestError (code: number, error: Error, options?: AnyObject): RequestError {
  return Object.assign(error, { code: code || 500 }, options || {})
}

function wrap <Func extends (...args: any) => any, Wrapper extends (func: Func, ...args: Parameters<Func>) => any>(func: Func, wrapper: Wrapper): (...args: Parameters<Func>) => ReturnType<Wrapper> {
  return function (...args): ReturnType<Wrapper> {
    return wrapper(func, ...args)
  }
}

/**
 * 请求接口
 * @param options RequestOptions
 * @returns Promise<UniApp.RequestSuccessCallbackResult>
 */
let requestFunction: RequestFunction = async function (options): Promise<UniApp.RequestSuccessCallbackResult> {
  return new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {
    return uni.request({
      ...options,
      success: resolve,
      fail: (error) => reject(new Error(error.errMsg || 'request failed'))
    })
  })
}

// #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-ALIPAY
const accountInfo = uni.getAccountInfoSync()
const env = accountInfo.miniProgram.envVersion
if (env === 'trial' || env === 'release') {
  // Monitor
  requestFunction = wrap(requestFunction, async function (request, options) {
    let error: Error | null = null
    let response: UniApp.RequestSuccessCallbackResult | null = null
    try {
      response = await request(options)
    } catch (err: any) {
      error = err
    }
    console.log(
      'request: ====================\n',
      `${(options.method || 'GET').toLocaleUpperCase()} ${options.path}\n`,
      { options, response, error },
      '\n============================='
    )
    if (error) throw error
    return response as UniApp.RequestSuccessCallbackResult
  })
}
// #endif

// BaseURL
requestFunction = wrap(requestFunction, async function (request, options) {
  const baseURL = (config.API_BASE_URL || '').replace(/\/$/, '')
  let url = options.path || options.url
  if (!/^http/.test(url)) url = `${baseURL}/${url.replace(/^\//, '')}`
  if (!options.path) options.path = options.url.replace(baseURL, '')
  options.url = url
  return request(options)
})

// Params
requestFunction = wrap(requestFunction, async function (request, options) {
  let url = options.url
  if (options.params) {
    const search = typeof options.params === 'string' ? options.params : Object.entries(options.params).map(([key, value]) => `${encodeURIComponent(String(key))}=${encodeURIComponent(value)}`).join('&')
    url = url.indexOf('?') > -1 ? `${url}&${search}` : `${url}?${search}`
  }
  return request({ ...options, url })
})

// requestId
let pageId = ''
let pageHref = ''
function getRequestId (config: RequestOptions) {
  const pages = getCurrentPages()
  const currentHref = pages[pages.length - 1]?.route || ''
  if (pageHref !== currentHref) {
    pageId = guid()
    pageHref = currentHref
  }
  try {
    try {
      return sha256(`${pageId}:${JSON.stringify(config)}`)
    } catch (error) {
      return sha256(`${pageId}:${JSON.stringify({ method: config.method, url: config.url })}`)
    }
  } catch (error) {
    return ''
  }
}
requestFunction = wrap(requestFunction, async function (request, options) {
  const requestId = getRequestId(options)
  const optionsHeader: AnyObject = {}
  if (requestId) optionsHeader['Idempotent-Id'] = requestId
  return request({ ...options, header: Object.assign(options.header || {}, optionsHeader) })
})

// Error Code
requestFunction = wrap(requestFunction, async function (request, options) {
  return request(options).then((response) => {
    if (response.statusCode !== 200) {
      throw handleRequestError(response.statusCode, new Error(`request failed, status code: ${response.statusCode}`), { response })
    }
    return response
  }).catch((error: Error | RequestError) => {
    if (!(<RequestError>error).code) (<RequestError>error).code = 400
    throw error
  })
})

// 业务接口处理
let requestFunction2 = wrap(requestFunction, async function (request, options): Promise<RequestBusinessResult['data']> {
  const token = await getToken()
  const subToken = await getSubToken()
  const optionsHeader: AnyObject = {}
  if (token) optionsHeader['Dreamkey-Token'] = token
  if (subToken) optionsHeader['Sub-Token'] = subToken
  options.header = Object.assign(options.header || {}, optionsHeader)

  const response = await request({ ...options, header: optionsHeader })

  if (response.header['Dreamkey-Token']) await setToken(response.header['Dreamkey-Token'])
  if (response.header['Sub-Token']) await setToken(response.header['Sub-Token'])

  const result = response.data as RequestBusinessResult
  if (result.code !== 200) throw handleRequestError(result.code, new Error(result.msg))

  return result.data
})

// Error Toast
requestFunction2 = wrap(requestFunction2, async function (request, options) {
  return request(options).catch((error: RequestError) => {
    if (error.message === '没有查看该BP的权限') throw error

    uni.showToast({ title: error.message, icon: 'none' })
    throw error
  })
})

// To Login
requestFunction2 = wrap(requestFunction2, async function (request, options) {
  return request(options).catch(async (error: RequestError) => {
    if (error.code === 401) {
      await setToken(null)
      await setUserInfo(null)
      uni.reLaunch({ url: '/pages/login/login' })
      return null
    } else {
      throw error
    }
  })
})

function transformRequest (request: RequestFunction): Request {
  request.get = (url: string, options) => request({ url, method: 'GET', ...options })
  request.post = (url: string, data, options) => request({ url, method: 'POST', data, ...options })

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-LARK
  request.put = (url: string, data, options) => request({ url, method: 'PUT', data, ...options })
  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
  request.delete = (url: string, options) => request({ url, method: 'DELETE', ...options })
  // #endif

  // #ifdef H5 || MP-WEIXIN
  request.connect = (url: string, options) => request({ url, method: 'CONNECT', ...options })
  // #endif

  // #ifdef H5 || MP-WEIXIN || MP-BAIDU
  request.head = (url: string, options) => request({ url, method: 'HEAD', ...options })
  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
  request.options = (url: string, options) => request({ url, method: 'OPTIONS', ...options })
  // #endif

  // #ifdef H5 || MP-WEIXIN
  request.trace = (url: string, options) => request({ url, method: 'TRACE', ...options })
  // #endif
  return request as Request
}

const request = transformRequest(requestFunction2)

/**
 * 文件上传
 * @param options Omit<UniApp.UploadFileOption
 * @returns Promise<UniApp.UploadFileSuccessCallbackResult>
 */
async function uploadFile (options: Omit<UniApp.UploadFileOption, 'url'>) {
  const token = await getToken()
  // const userInfo = await getUserInfo()
  const subToken = await getSubToken()
  return new Promise<UniApp.UploadFileSuccessCallbackResult>((resolve, reject) => {
    const header: AnyObject = {}
    if (token) header['Dreamkey-Token'] = token
    if (subToken) header['Sub-Token'] = subToken
    return uni.uploadFile({
      ...options,
      name: 'file',
      url: config.UPLOAD_FILE_URL,
      header,
      success: resolve,
      fail: (error) => reject(new Error(error.errMsg || 'upload file failed'))
    })
  })
}

/**
 * 签名上传
 * @param options Omit<UniApp.UploadFileOption
 * @returns Promise<UniApp.UploadFileSuccessCallbackResult>
 */
async function uploadSignatureFile (options: Omit<UniApp.UploadFileOption, 'url'>) {
  const token = await getToken()
  // const userInfo = await getUserInfo()
  const subToken = await getSubToken()
  return new Promise<UniApp.UploadFileSuccessCallbackResult>((resolve, reject) => {
    const header: AnyObject = {}
    if (token) header['Dreamkey-Token'] = token
    if (subToken) header['Sub-Token'] = subToken
    return uni.uploadFile({
      ...options,
      name: 'file',
      url: config.UPLOAD_SIGNATURE_URL,
      header,
      success: resolve,
      fail: (error) => reject(new Error(error.errMsg || 'upload file failed'))
    })
  })
}

/**
 * 文件下载
 * @param options Omit<UniApp.DownloadFileOption
 * @returns Promise<UniApp.DownloadSuccessData>
 */
async function downloadFile (options: UniApp.DownloadFileOption) {
  return new Promise<UniApp.DownloadSuccessData>((resolve, reject) => {
    return uni.downloadFile({
      ...options,
      success: resolve,
      fail: (error) => reject(new Error(error.errMsg || error.message || 'download failed'))
    })
  })
}

export default request
export { request, uploadFile, downloadFile, uploadSignatureFile }
