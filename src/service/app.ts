import type { UserInfo } from '@/plugins/app-core/authentication'
import { request, uploadFile as uploadFileRequest , uploadSignatureFile as uploadSignatureRequest} from '@/utils/request'
import sha256 from '@/utils/sha256'

/** 获取微信登录 FlagId */
export const getWeixinFlagId = (params: { code: string }): Promise<string> => {
  return request.get('/front/wechat/auth-code', { params }) as Promise<string>
}

/** 微信登录 */
export const loginByWeixin = (params: { encryptedData: string, iv: string, flagId: string, inviter: string }) => {
  return request.post('/front/wechat/login', params) as Promise<UserInfo>
}

/** 账号登录 */
export const loginByAccount = (params: { account: string, password: string }) => {
  return request.post('/front/password/login', { ...params, password: sha256(params.password) }) as Promise<UserInfo>
}

/** 登录后刷新登录状态，调用此接口以便后端进行登录时间排序 */
export const updateLoginTime = () => {
  return request.get('/front/save/login-time') as Promise<any>
}

/** 短信登录 */
export const loginByCode = (params: { account: string, password: string, inviter: string }) => {
  return request.post('/front/code/login', params) as Promise<UserInfo>
}

/** 发送验证码 */
export const sendCode = (params: { account: string, template: 'login' | 'register' | 'bind-mobile' | 'bind-email' | 'reset-pwd' | 'retrieve-pwd', check?: any }) => {
  return request.get('/front/code/get-code', { params }) as Promise<boolean>
}

/** 忘记密码 */
export const retrievePwd = (params: { account: string, password: string, code: string }) => {
  return request.post('/front/retrieve-pwd', { ...params, password: sha256(params.password) }) as Promise<boolean>
}

/** 退出登录 */
export const logout = () => {
  return request.get('/front/logout') as Promise<boolean>
}

/** 获取当前登录信息 */
export const getUserInfo = () => {
  return request.get('/front/info/latest-token') as Promise<UserInfo>
}

/** 检查 SubToken */
export const checkSubToken = (params: { subToken: string }) => {
  return request.get('/front/check-sub', { params }) as Promise<UserInfo>
}

/** 文件上传 */
export const uploadFile = (params: { filePath: string }) => {
  return uploadFileRequest(params)
}

/** 签名上传 */
export const uploadSignatureFile = (params: { filePath: string }) => {
  return uploadSignatureRequest(params)
}

/** 根据级别查询行政区域列表 */
export const getRegion = (params: { level: number }) => {
  return request.get('/public/region/list/level', { params }) as Promise<{ id: string, name: string, parentId: string, level: number }[]>
}


// 获取投资领域字典以及轮次字典 dictCode=invest_round  投资领域dictCode=invest_field
export const getDictionary= (params: { dictCode: 'invest_round' | 'invest_field' }) => {
  return request.get('/front/dict-item/list', { params }) as Promise<{ id: string, itemValue: string, itemName: string }[]>
}

// 拉取所有token
export const getAllToken = ()=> { 
  return request.get('/front/info/latest-token') as Promise<any>
}

// 首页获取最新三条公告
export const latestThree = ()=> { 
  return request.get('/front/announcement/list/latest-three') as Promise<any>
}

/** 根据级别查询行政区域列表 */
export const aboutInfo = (params: { title: string }) => {
  return request.get('/front/content/info-by-type', { params }) as Promise<{ id: string, name: string, parentId: string, level: number }[]>
}

/* 数据看板 */
export const getStatistics = ()=> { 
  return request.get('/front/statistics/index') as Promise<any>
}