import { request } from '@/utils/request'

/** 【小程序】观察者列表 */
export const getObserverRecords = (params: { page: number, size: number, [key: string]: any }) => {
  return request.post('/front/observer/search', params) as Promise<{ total: number, records: any[] }>
}

/** 【小程序】观察者列表 */
export const getObserverInfo = (params: { id: string }) => {
  return request.get('/front/observer/info/base', { params }) as Promise<Record<string, any>>
}

/** 【小程序】获取当前账户的观察者信息 */
export const getCurrentObserverInfo = () => {
  return request.get('/front/observer/info/current') as Promise<Record<string, any>>
}

/** 【小程序】更新当前账户的观察者信息 */
export const updateObserverInfo = (params:any) => {
  return request.put('/front/observer/update/current', params) as Promise<Record<string, any>>
}
