import { request } from '@/utils/request'

/** 【小程序】搜索投资机构列表 */
export const getOrganizationRecords = (params: { page: number, size: number, name?: string, factor?: number, statues?: string[] }) => {
  return request.post('/front/invest-institution/search', params) as Promise<{ total: number, records: any[] }>
}

/** 【小程序】搜索投资机构列表 */
export const getOrganizationInfo = (params: { id: string }) => {
  return request.get('/front/invest-institution/info/base', { params }) as Promise<Record<string, any>>
}


/** 【小程序】获取当前账户的投资机构信息 */
export const getCurrentOrganizationInfo = () => {
  return request.get('/front/invest-institution/info/current') as Promise<Record<string, any>>
}

/** 【小程序】更新当前账户的投资机构信息 */
export const updateOrganizationInfo = (params:any) => {
  return request.put('/front/invest-institution/update/current', params) as Promise<Record<string, any>>
}

// 【小程序】解除经理的挂靠关系
export const exitRelation = (params: any) => {
  return request.post('/front/invest-institution/delete/affiliate', params) as Promise<Record<string, any>>
}
/** 【小程序】【小程序】邀请挂靠经理 */
export const applyRelation = (params:{investManagerId: string}) => {
  return request.get('/front/invest-institution/invite/affiliate', {params}) as Promise<Record<string, any>>
}
