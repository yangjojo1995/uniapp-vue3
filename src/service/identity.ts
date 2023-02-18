import { request } from '@/utils/request'

export const realNameCheck = (params: { realName:string,idCard: string }) => {
  return request.post('/front/user/verification', params ) as Promise<any>
}

