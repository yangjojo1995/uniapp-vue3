import { request } from '@/utils/request'
interface ListParams {
  representativeId?: string,
  roleNotIn?: string[],
  page?:number,
  size?:number,
  sortField?:string,
  asc?:boolean
}

interface inviteParams{
  representativeId?:string // 挂靠的企业主体id，不传代表 传给当前
  account: string, //账号	
  secondaryRoleId: string // 默认给1完事	
}
// 获取子账号列表
export const getSubAccountList = (params:ListParams) => {
  return request.post('/front/sub-account/search', params) as Promise<Record<string, any>>
}

/** 邀请子账号 */
export const bindSubAccount = (params:inviteParams) => {
  return request.post('/front/sub-account/invite',params) as Promise<Record<string, any>>
}

/*** 【小程序】解绑子账号*/
// identityId 子账号管理-销毁当前子账号的Id
// representativeId  身份切换-解绑当前账号下的办事员
export const unbindSubAccount = (params:{identityId?: string, representativeId?:string}) => {
  return request.get('/front/sub-account/unbind',{params}) as Promise<Record<string, any>>
}
// /*** 【小程序】转让管理员
export const transferAdmin = (params:{identityId: string, representativeId?: string}) => {
  return request.get('/front/sub-account/transfer',{params}) as Promise<Record<string, any>>
}


