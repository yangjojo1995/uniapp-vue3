import { request } from '@/utils/request'

export const getCurrentUserInfo = () => {
  return request.get('/front/user/get/current') as Promise<any>
}

export const getRelation = (params?:any) => {
  return request.get('/front/user/relationship', {params}) as Promise<any>
}

// 获取用户协议
export const getSignatureInfo = (params: {type: string} ) => {
  return request.get('/public/commitment/signature/info', { params }) as Promise<any>
}

/** 校验手机号 */
export const checkPhone = (params: { code: number }) => {
  return request.get('/front/user/check-phone', { params }) as Promise<any>
}
/** 设置手机号 */
export const newPhone = (params?:any) => {
  return request.post('/front/user/newphone', params) as Promise<any>
}
