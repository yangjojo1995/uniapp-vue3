import { request } from '@/utils/request'

/** 【小程序】依据企业ID查询详情 */
export const getCompanyInfo = (params: { id: string }) => {
  return request.get('/front/enterprise/info/base', { params }) as Promise<Record<string, any>>
}

/** 【小程序】【小程序】获取当前账户的企业信息 */
export const getCurrentCompanyInfo = () => {
  return request.get('/front/enterprise/info/current') as Promise<Record<string, any>>
}

/** 【小程序】更新当前账户的企业信息 */
export const updateCompanyInfo = (params:any) => {
  return request.put('/front/enterprise/update/current', params) as Promise<Record<string, any>>
}

/** 【小程序】企业列表 */
export const enterpriseList = (params:any) => {
  return request.post('/front/enterprise/search', params) as Promise<Record<string, any>>
}

