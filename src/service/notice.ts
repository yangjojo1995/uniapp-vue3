import { request } from '@/utils/request'

/** 【小程序】首页获取最新三条公告 */
export const getNoticeLatestThree = () => {
  return request.get('front/announcement/list/latest-three') as Promise<any>
}

/** 【小程序】消息获取最新一条公告 */
export const getNoticeLatest = () => {
  return request.get('front/announcement/info/latest') as Promise<any>
}

/** 【小程序】公告列表 */
export const getNoticePage = (params: { page: number, size: number }) => {
  return request.post('front/announcement/search', params) as Promise<any>
}

/** 【小程序】查看公告详情 */
export const getNoticeInfo = (params: { id: string }) => {
  return request.get('front/announcement/info', { params }) as Promise<any>
}
