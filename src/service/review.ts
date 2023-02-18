import { request } from '@/utils/request'

/** 申请审核详情 */
export const reviewInfo = (params:{id:string}) => {
  return request.get('/front/todo/info', {params}) as Promise<Record<string, any>>
}

/** 申请审核列表 */
export const reviewSearch = (params:any) => {
  return request.post('/front/todo/search',params) as Promise<Record<string, any>>
}

/** 申请审核操作 */
export const reviewOperate = (params:any) => {
  return request.post('/front/todo/operate',params) as Promise<Record<string, any>>
}

