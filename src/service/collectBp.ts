import { request } from '@/utils/request'

// 【小程序】修改BP公开权限 id: bpId,   showAll:  公开权限（0不公开，1公开）
export const updateBpAuth = (params:any) => {
  return request.put('/front/project/update/bp/show', params) as Promise<Record<string, any>>
}
// 【小程序】根据BP的ID获取BP文件信息
export const getBpFile = (params: {bpId:string, latest?: boolean}) => {
  return request.get('/front/project/info/bp', { params }) as Promise<Record<string, any>>
}
// 【小程序】根据项目ID获取最新已确权BP基本信息
export const getBpFileLast = (params: {id:string}) => {
  return request.get('/front/project/info/confirmed-bp-base', { params }) as Promise<Record<string, any>>
}
// 【小程序】根据项目ID获取最新已确权BP基本信息
export const getBpFileLastest = (params: {id:string}) => {
  return request.get('/front/project/info/latest-bp-base', { params }) as Promise<Record<string, any>>
}

// 【小程序】申请BP查看权限  bpId
export const applyBpAuth = (params:{projectId: string}) => {
  return request.get('/front/project/apply/view/bp', { params }) as Promise<Record<string, any>>
}

// 【小程序】分页查询当前BP已获得查看、下载权限的用户列表
export const getBpMemberPagelist = (params:{page:number, size:number, projectId:string}) => {
  return request.post('/front/project/search/bp-authorized-member', params) as Promise<Record<string, any>>
}
// 【小程序】移除用户BP查看、下载权限
export const removeBpAuth = (params:{bpId:string, id:string}) => {
  return request.post('/front/project/remove/bp-authorization', params) as Promise<Record<string, any>>
}

// 【小程序】BP确权管理，BP确权人列表
export const getBpMemberList = (params:{projectId:string}) => {
  return request.get('/front/project/list/bp-assist-member', { params }) as Promise<Record<string, any>>
}
// 【小程序】BP确权管理，撤销BP确权人, 确权操作的id
export const removeBpAssist = (params:{ id:string}) => {
  return request.get('/front/project/revoke/bp-assist-member', { params }) as Promise<Record<string, any>>
}

// 【小程序】收藏/取消收藏BP  //id：bpid collected: BP的收藏状态（要收藏时传0，取消收藏时传1）
export const toggleCollect = (params:{id:string, collected:0|1}) => {
  return request.post('/front/project/collect/bp', params) as Promise<Record<string, any>>
}

export const getCollectList = (params:any) => {
  // page size
  return request.post('/front/project/search/collect-bp', params) as Promise<Record<string, any>>
}
export const removeCollect = (params:{id:string}) => {
  // id
  return request.delete?.('/front/project/delete/collect-bp', { params }) as Promise<Record<string, any>>
}
