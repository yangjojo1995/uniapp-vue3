import { request } from '../lib/request'

/** 微信登录 */
export const getRecord = (params: { page: number, size: number, type: string }) => {
  return request.post('/front/history-record/search', params) as Promise<{ total: number, records: any[] }>
}

/** 【小程序】新增搜索历史 */
export const create = (params: { type: string, keyWord: string }) => {
  return request.post('/front/history-record/insert', params)
}

/** 【小程序】清除搜索历史 */
export const removeAll = (params: { type: string }) => {
  return request.delete('/front/history-record/delete', { params })
}