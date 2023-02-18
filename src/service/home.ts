
import { request } from '@/utils/request'

/** 【小程序】推荐项目 */
export const getRecommendProjectRecord = (params: { page: number, size: number }) => {
  return request.post('/front/project/recommend', params) as Promise<{ total: number, records: any[] }>
}

/** 【小程序】推荐投资机构 */
export const getRecommendOrganizationRecord = (params: { page: number, size: number }) => {
  return request.post('/front/invest-institution/recommend', params) as Promise<{ total: number, records: any[] }>
}

// 获取类型下最新弹窗
//@param type 弹窗类型,：0手机号换绑 1项目确认
export const checkPopupMsg = (params: {type: string}) => {
  return request.get('/front/popup/last', {params}) as Promise<any>
}

// 执行弹窗操作
export const popupOperate = (params: { id: string, operate: string }) => {
  return request.post('/front/popup/operate', params) as Promise<any>
}

// 首页轮播图
export const bannerList = () => {
  return request.get('/front/banner/list', {}) as Promise<any>
}