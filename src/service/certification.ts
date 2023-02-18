import { request } from '@/utils/request'
// 当不存在草稿id的时候，点击创建的时候生成一个唯一id
export const getUnionId = () => {
  return request.get('/public/get/unique-id') as Promise<string>
}

  // 是否在草稿中 有id ，失败
  // 新创建 是否在审核中，确权中  
interface State{
  id?: string,
  status?:string,
  reason?: string
}
export  const getOrganizationId = () => {
  return request.get('/front/invest-institution/get/newest-status') as Promise<State>
}
export  const getEnterpriseId = () => {
  return request.get('/front/enterprise/get-last-draft-id') as Promise<State>
}
export  const getObserverId = () => {
  return request.get('/front/observer/get-last-draft-id') as Promise<State>
}
export  const getManagerId = () => {
  return request.get('/front/invest-manager/get-last-draft-id') as Promise<State>
}


//*******投资机构********* */
// 添加投资机构草稿
export const addOrganizationDraft = (params:Object) => {
  return request.post('/front/invest-institution/save', params) as Promise<any>
}

// 提交投资机构信息
export const addOrganization = (params: {id:string}) => {
  return request.get('/front/invest-institution/submit', {params}) as Promise<any> // true成功	
}
// 确认运营后台创建投资机构信息
export const confirmOrganization = (params: {id:string}) => {
  return request.get('/front/invest-institution/confirm', {params}) as Promise<any> // true成功	
}
// 通过id获取投资机构基本信息,编辑回显时使用
export const getOrganizationDetail = (params: {id:string}) => {
  return request.get('/front/invest-institution/info/detail', {params}) as Promise<Record<string, any>> // true成功	
}


//*******投资经理********* */

// 添加投资经理草稿
export const addManagerDraft = (params:Object) => {
  return request.post('/front/invest-manager/insert/draft', params) as Promise<any>
}
// 提交投资经理信息
export const addManager = (params: {id:string}) => {
  return request.get('/front/invest-manager/submit', {params}) as Promise<any> // true成功	
}
// 通过id获取投资经理基本信息
export const getManagerDetail = (params: {id:string}) => {
  return request.get('/front/invest-manager/info/base', {params}) as Promise<Record<string, any>> // true成功	
}

//*******企业********* */

// 添加投资经理草稿
export const addEnterpriseDraft = (params:Object) => {
  return request.post('/front/enterprise/insert/draft', params) as Promise<any>
}
// 提交投资经理信息
export const addEnterprise= (params: {id:string}) => {
  return request.get('/front/enterprise/submit', {params}) as Promise<any> // true成功	
}
// 通过id获取投资经理基本信息
export const getEnterpriseDetail = (params: {id:string}) => {
  return request.get('/front/enterprise/info/base', {params}) as Promise<Record<string, any>> // true成功	
}
// 获取推荐单位列表
export const getRecommendList = (params:Object) => {
  return request.post('/front/recommend-unit/search', params) as Promise<any>
}


//*******指导单位********* */

// 添加投资经理草稿
export const addObserverDraft = (params:Object) => {
  return request.post('/front/observer/insert/draft', params) as Promise<any>
}
// 提交投资经理信息
export const addObserver= (params: {id:string}) => {
  return request.get('/front/observer/submit', {params}) as Promise<any> // true成功	
}
// 通过id获取投资经理基本信息
export const getObserverDetail = (params: {id:string}) => {
  return request.get('/front/observer/info/base', {params}) as Promise<Record<string, any>> // true成功	
}



// 邀请确权  机构 投资经理列表
export const getManagerList = (params:any) =>{
  return request.post('/front/invest-manager/search', params) as Promise<Record<string, any>> // true成功	
}

export const getOrganizationList = (params:any) =>{
  return request.post('/front/invest-institution/search', params) as Promise<Record<string, any>> // true成功	
}


// 获取当前账户的 发起确权记录


export const getCooperationRecord = (params:any) => {
  return request.post('/front/assist/send/current', params) as Promise<Record<string, any>> // true成功	
}
// 追加

export const addCooperation = (params:any) => {
  return request.post('/front/invest-manager/insert/assist', params) as Promise<any> 	

}

export const updateInstitution = (params:any) => {
  return request.put?.('/front/invest-institution/update/current', params) as Promise<any> 	

}

// 获取关系列表
export const getRelationList = (params:any) => {
  return request.post('/front/user/search/relationship', params) as Promise<any> 	
}
