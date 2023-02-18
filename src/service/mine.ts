import type { UserInfo } from '@/plugins/app-core/authentication'
import { request, uploadFile as uploadFileRequest } from '@/utils/request'
import sha256 from '@/utils/sha256'

/** ************** 项目 begin *********************/

// 我的项目-列表项
export interface projectItem {
  id: string, // 项目ID
  status?: string, // 状态名
  image?: string, // 项目图片
  projectName?: string, // 项目名称
  updateTime?: number, // 最后编辑时间
  userType?: string, // 用户类型  institution 投资机构 ,manager 投资经理 , enterprise 企业 , observer 观察
  publisher?: string, // 项目发布人
}

// 我的项目-列表项
export interface projectList {
  total: number;
  records: Array<projectItem>
}

// 我的项目-详情
export interface projectDetail {
  projectBase: projectItem, // 项目基本信息
  projectProduct: object, // 项目产品信息
  projectCompany: object, // 企业信息
  projectMembers: object [] // 团队成员
}

// 获取项目列表
export const queryProjectList = (params: {page: number, size: number}) => {
  return request.post('/front/project/search', params) as Promise<projectList>
}

// 根据id获取项目详情
export const getProjectDetail = (params: {id?: string, bpId?:string}) => {
  return request.get('/front/project/info', { params }) as Promise<projectDetail>
}

// 修改项目状态，如果要停止项目，则 status 传 ‘stop’ 字符串
export const updateProjectStatus = (params: {id: string, status: string}) => {
  return request.put('/front/project/update/status', params) as Promise<string>
}

// 删除项目
export const deleteProjectStatus = (params: {id: string}) => {
  return request.delete('/front/project/delete', { params }) as Promise<string>
}

// 根据项目ID获取项目公司最近三年的财务数据
export const getProjectFinance = (params: {projectCompanyId?: string}) => {
  return request.get('/front/project/list/finance', { params }) as Promise<any>
}

// 判断项目是否有变更待审核状态的审核
export const getProjectChangeCheck = (params: {projectId?: string}) => {
  return request.get('/front/project/audit/exist/change-check', { params }) as Promise<any>
}

/** **************** 项目 end ***********************/

/** ************** 确权 begin *********************/

// 协助确权列表 status： 授权状态 assisting(确权中) assisted(已确权) revoke(已撤销) invalid(已失效)
export const queryAssistAuthenticList = (params: {page: number, size: number, name: string, status: string}) => {
  return request.post('/front/assist/target/current', params) as Promise<any>
}

// 获取确权状态
export const getAssistStatus = (params: {assistId: string}) => {
  return request.get('/front/assist/status', { params }) as Promise<any>
}

// 协助确权详情
export const getAssistAuthenticInfo = (params: {assistId: string}) => {
  return request.get('/front/assist/info', { params }) as Promise<any>
}

// 同意帮助确权
export const agreeAssist = (params: {assistId: string}) => {
  return request.get('/front/assist/agree', { params }) as Promise<any>
}

// bp确权专用，同意帮助确权
export const bpAssist = (params: {bindId: string}) => {
  return request.get('/front/assist/bp-agree', { params }) as Promise<any>
}

// 根据项目ID获取BP确权记录
export const bpAssistRecord = (params: {id?: string, bpId?: string}) => {
  return request.get('/front/project/list/bp-assist-record', { params }) as Promise<any>
}

/** **************** 确权 end ***********************/

/** ************** 用户 begin *********************/

// 企业身份列表项
export interface enterpriseItem {
  name: string, // 身份名称
  icon: string, // 图标
  subToken: string, // 身份token
  defaultRoleType: number, // 默认角色类型1投资经理 2投资机构 3企业 4指导单位
  defaultRoleTypeName: string, // 默认角色名
  representativeId: string, // ID
  signatureUrl: string, // 签名
  confirm: number, // 确认状态 1已确认，0未确认，需要去认证确认
  deleted: number // 禁用状态,0正常1禁用
}

export interface userInterface {
  id: string, // 用户id
  userName: string, // 用户名
  account?: string | null, // 账号
  accountRole?: string | null,
  mobile?: string | null, // 手机
  email?: string | null, // 邮箱
}

// 获取用户当前信息
export const getCurrentUser = () => {
  return request.get('/front/user/get/current') as Promise<userInterface>
}

// 拉取所有token
export const getAllToken = () => {
  return request.get('/front/info/latest-token') as Promise<any>
}

// 设置账号
export const updateAccount = (params: {account: string}) => {
  return request.post('/front/user/set-account', params) as Promise<any>
}

// 设置邮箱、更改邮箱
export const setEmail = (params: {flagId?: string, code: string, email: string }) => {
  return request.post('/front/user/newemail', params) as Promise<any>
}

/** 校验邮箱验证码 */
export const checkEmailCode = (params: { code: number }) => {
  return request.get('/front/user/check-email', { params }) as Promise<any>
}

// 绑定微信
export const updateOpenId = (params: {code: string}) => {
  return request.post('front/user/set-openId', params) as Promise<any>
}

// 解绑微信
export const unbindOpenId = () => {
  return request.delete('front/user/unbind/wx') as Promise<any>
}

// 发送验证码
export const sendCode = (params: {template: string}) => {
  return request.get('/front/user/get-code', { params }) as Promise<boolean>
}

// 设置密码
export const setPassword = (params: { code: string, password: string }) => {
  return request.post('/front/user/set-password', { ...params, password: sha256(params.password) }) as Promise<any>
}

// 根据旧密码修改密码
export const updatePassword = (params: {oldPasswd?: string, newPasswd: string}) => {
  return request.put('/front/user/update/password', { ...params.oldPasswd && { oldPasswd: sha256(params.oldPasswd) }, newPasswd: sha256(params.newPasswd) }) as Promise<any>
}

// 获取弹窗 0手机号换绑 1项目确认(String)
export const getPopup = (params: { type: '0' | '1' }) => {
  return request.get('/front/popup/last', { params }) as Promise<any>
}

// 发送弹窗事件
export const emitPopupOperate = (params: { operate: 'yes' | 'no', id: string }) => {
  return request.post('/front/popup/operate', { ...params }) as Promise<any>
}

// 邀请列表
export const invitedList = (params: any) => {
  return request.post('front/user/search/invited', { ...params }) as Promise<any>
}
// 用户推荐人
export const userInviter = () => {
  return request.get('front/user/inviter') as Promise<any>
}

// 退出登录
export const logout = () => {
  return request.get('/front/logout', {}) as Promise<any>
}

/** ************** 用户 end *********************/

// 获取一个唯一的ID
export const createId = () => {
  return request.get('/public/get/unique-id') as Promise<string>
}

// 获取用户签名
export const getSignatureList = (params: {page?: number, size?: number}) => {
  return request.post('/front/user/search/signature', params) as Promise<any>
}
