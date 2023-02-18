import { request } from '@/utils/request'

// 活动，列表项
export interface activityItem {
  id: string, 
  beginTime: number,   //活动开始时间	 
  endTime: number,  //活动结束时间
  address: string,  //地址 
  title: string,  //活动标题 
  image: string,  //活动封面图 
  status: string,  //状态
  applyNum: number,  //报名次数 
  signInNum: number  //签到次数 
}

// 活动列表
export interface activitiesList { 
  total: number; 
  records: Array<activityItem>
}

/** 活动列表 **/
export const queryActivitiesList = (params: {page: number, size: number}) => {
  return request.post('/front/activity/search', {page:params.page, size:params.size,statusList: ['apply','progress','end']}) as Promise<activitiesList>
}

/* 活动详情 */
export const getActivity = (params: {id: string}) => {
  return request.get('/front/activity/info/current-user', {params}) as Promise<any>
}

/* 参与活动总数 */
export const participateCount = () => {
  return request.get('/front/activity/count/participate-in') as Promise<any>
}
/* 参与活动列表 */
export const participateList = (params: {page: number, size: number}) => {
  return request.post('/front/activity/search/participate-in', params) as Promise<activitiesList>
}

/* 参与活动管理 */
export const queryMyActivities = (params: {page: number, size: number}) => {
  return request.post('/front/activity/search/self', params) as Promise<activitiesList>
}

/* 我的草稿列表 */
export const queryDraftActivities = (params: {page: number, size: number}) => {
  return request.post('/front/activity/search/draft', params) as Promise<activitiesList>
}

/* 草稿详情 */
export const getDraftDetail = (params: { id: string }) => {
  return request.get('/front/activity/info/draft', { params }) as Promise<any>
}

/* 创建活动、保存草稿、编辑活动 */
export const createActivity = (params: activityItem) => {
  return request.post('/front/activity/create', params) as Promise<any>
}

/* 发布活动 */
export const commitDraft = (params: { id: string }) => {
  return request.get('/front/activity/commit', { params }) as Promise<any>
}

/* 删除草稿 */
export const deleteDraft = (params: {id: string}) => {
  return request.delete?.('/front/activity/delete/draft', {params}) as Promise<any>
}

/* 修改活动状态，如要停止，传入end */
export const updateActivityStatus = (params: {id: string, status: string, reason:string}) => {
  return request.put('/front/activity/update/status', params) as Promise<string>
}

/** 【小程序】报名记录 */
export const activityApply = (params: { page: number, size: number, [key: string]: any }) => {
  return request.post('/front/activity-apply/search', params) as Promise<{ total: number, records: any[] }>
}
/** 【小程序】签到记录 */
export const activitySignIn = (params: { page: number, size: number, [key: string]: any }) => {
  return request.post('/front/activity-sign-in/search', params) as Promise<{ total: number, records: any[] }>
}
/** 【小程序】报名详情 */
export const getApplyInfo = (params: { id: string }) => {
  return request.get('/front/activity-apply/info', { params }) as Promise<Record<string, any>>
}

/** 【小程序】签到详情 */
export const getSignInfo = (params: { id: string }) => {
  return request.get('/front/activity-sign-in/info', { params }) as Promise<Record<string, any>>
}

/** 【小程序】获取当前账户的投资经理信息 */
export const getCurrentManagerInfo = () => {
  return request.get('/front/invest-manager/info/current') as Promise<Record<string, any>>
}

/** 【小程序】更新当前账户的投资经理信息 */
export const updateManagerInfo = (params:any) => {
  return request.put('/front/invest-manager/update/current', params) as Promise<Record<string, any>>
}

// 活动浏览数
export const addActivityViewNumber = (params:{id:string}) => {
  return request.get('/front/activity/view', {params}) as Promise<Record<string, any>>
}

// 列表页获取浏览次数
export const getViewOfActivity = (params:{id:string}) => {
  return request.get('/front/activity/get-view', {params}) as Promise<Record<string, any>>
}

// 参与活动管理 -活动详情
export const getActivityInfo = (params:{id:string}) => {
  return request.get('/front/activity/info', {params}) as Promise<Record<string, any>>
}


/* 修改活动信息 */
export const updateActivity = (params:any) => {
  return request.put('/front/activity/update', params) as Promise<string>
}

// 再次确定修改内同

export const submitActivity = (params:{id:string}) => {
  return request.get('/front/activity/submit', {params}) as Promise<string>
}