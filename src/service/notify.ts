import { request } from '@/utils/request'

/** 【小程序】获取最新消息 */
export const getNotifyLast = () => {
  return request.get('front/message/last') as Promise<Record<string, any>>
}
/** 【小程序】获取最新消息 */
export const getNotifyPage = (params: { page: number, size: number }) => {
  return request.post('front/message/list', params) as Promise<any>
}
