import { request } from '@/utils/request'

/** 【小程序】获取最新消息 */
export const getLastMessage = () => {
  return request.get('front/message/last') as Promise<Record<string, any>>
}
/** 【小程序】获取最新消息 */
export const getMessagePage = (params: { page: number, size: number }) => {
  return request.post('front/message/list', params) as Promise<any>
}
/** 【小程序】公告列表 */
export const searchAnnouncement = (params: { page: number, size: number }) => {
  return request.post('front/announcement/search', params) as Promise<any>
}
/** 【小程序】查看公告详情 */
export const announcementInfo = (params:{id:string}) => {
  return request.get('front/announcement/info', {params}) as Promise<Record<string, any>>
}

/** 【小程序】获取最新确权消息 */
export const getAssistLast = () => {
  return request.get('front/assist/last') as Promise<Record<string, any>>
}

/** 【小程序】获取最新待办审核消息 */
export const getTodoLast = () => {
  return request.get('front/todo/last') as Promise<Record<string, any>>
}

/** 【小程序】获取最新待办审核消息 */
export const getUnRead = () => {
  return request.get('front/message/un-read') as any
}

/** 【小程序】获取最新待办审核消息 */
export const wechatMsgAuth = (params: any) => {
  return request.get('front/message/wechat-msg-auth', { params }) as Promise<Record<string, any>>
}
