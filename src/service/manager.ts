import { request } from '@/utils/request'

/** 【小程序】投资经理列表 */
export const getManagerRecords = (params: { page: number, size: number, [key: string]: any }) => {
  return request.post('/front/invest-manager/search', params) as Promise<{ total: number, records: any[] }>
}

/** 【小程序】查询投资经理基本信息 */
export const getManagerInfo = (params: { id: string }) => {
  return request.get('/front/invest-manager/info/base', { params }) as Promise<Record<string, any>>
}

/** 【小程序】获取当前账户的投资经理信息 */
export const getCurrentManagerInfo = () => {
  return request.get('/front/invest-manager/info/current') as Promise<Record<string, any>>
}

/** 【小程序】更新当前账户的投资经理信息 */
export const updateManagerInfo = (params:any) => {
  return request.put('/front/invest-manager/update/current', params) as Promise<Record<string, any>>
}


/** 【小程序】【小程序】申请挂靠机构 */
export const applyRelation = (params:{investInstitutionId: string}) => {
  return request.get('/front/invest-manager/apply/affiliate', {params}) as Promise<Record<string, any>>

}
// 【小程序】退出机构挂靠
export const exitRelation = (params: {investInstitutionId: string}) => {
  return request.delete?.('/front/invest-manager/delete/affiliate', {params}) as Promise<Record<string, any>>
}
// 【小程序】获取当前机构已挂靠的经理列表
export const relationManagerList = (params:any) => {
  return request.post('/front/invest-manager/search/affiliate', params) as Promise<Record<string, any>>

}