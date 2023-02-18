import { request } from '@/utils/request'

export const getApplyInfo = (params:{id:string}) => {
  return request.get('/front/activity-apply/info', {params}) as Promise<Record<string, any>>
}

/** 活动报名 */
export const applyActive = (params:any) => {
  return request.post('/front/activity-apply/create',params) as Promise<Record<string, any>>
}

/** 签名 */
export const signInActive = (params:any) => {
  return request.post('/front/activity-sign-in/create',params) as Promise<Record<string, any>>
}

