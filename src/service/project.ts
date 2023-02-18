
import { request } from '@/utils/request'
import { number } from '@intlify/core-base'

/** 【小程序】更多项目（项目池） */
export const getProjectRecord = (params: { page: number, size: number, projectName?: string }) => {
  return request.post('/front/project/search/more', params) as Promise<{ total: number, records: any[] }>
}

/** 【小程序】增加项目浏览次数 */
export const projectView = (params: { id: string }) => {
  return request.get('/front/project/view', { params }) as Promise<Record<string, any>>
}

/** 【小程序】申请财务信息查看权限 */
export const financeApply = (params: { projectId: string }) => {
  return request.get('/front/project/apply/view/finance', { params }) as Promise<Record<string, any>>
}

/** 【小程序】检查是否有权限查看财务数据 */
export const financePermission = (params: { projectId: string }) => {
  return request.get('/front/project/finance-permission', { params }) as Promise<Record<string, any>>
}

/** 【小程序】我的项目-确权人列表无分页 */
export const getAssistMemberList = (params: { roleType: string, filterByProjectId: string, enable:number, name: string }) => {
  return request.post('/front/assist/assist-member/list', params) as Promise<Record<string, any>>
}

/** 【小程序】邀请项目确权确权 */
export const inviteConfirm = (params: { id: string, representativeIds: string[] }) => {
  return request.post('/front/project/invite/confirm', params) as Promise<Record<string, any>>
}

/** 【小程序】依据bindId查询是否可以进行点评 */
export const commentAuth = (params: { bindId: string }) => {
  return request.get('/front/comment/object-info', { params }) as Promise<Record<string, any>>
}

/** 【小程序】获取点评总数 */
export const commentTotal = (params: { bindId: string }) => {
  return request.get('/front/comment/total', { params }) as Promise<Record<string, any>>
}