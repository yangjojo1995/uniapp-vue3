import { defineComponent } from 'vue'

export interface UserInfo {
  /** 用户 Id */
  userId: string
  /** 用户 Token */
  token: string
  /** 登录手机号 */
  phone: string
  /** 登录邮箱 */
  email: string
  /** 个人用户身份 */
  personIdentity: Array<{
    /** 身份名称 */
    name: string
    /** 身份 Id */
    representativeId: string
    /** 默认角色类型：1投资经理 2投资机构 3企业 4指导单位 */
    defaultRoleType: 1 | 2 | 3 | 4
    /** 默认角色名称 */
    defaultRoleTypeName: string
    /** 禁用 */
    deleted: 0 | 1
    /** 身份token */
    subToken: string
  }>
  /** 企业用户身份 */
  enterpriseIdentities: Array<{
    /** 身份名称 */
    name: string
    /** 身份 Id */
    representativeId: string
    /** 默认角色类型：1投资经理 2投资机构 3企业 4指导单位 */
    defaultRoleType: 1 | 2 | 3 | 4
    /** 默认角色名称 */
    defaultRoleTypeName: string
    /** 禁用 */
    deleted: 0 | 1
    /** 身份token */
    subToken: string
    /** 默认企业子账号角色：0 管理员 1办事员 */
    defaultSecondaryRoleType: 0 | 1
    /** 默认企业子账号角色：0 管理员 1办事员 */
    defaultSecondaryRoleTypeName:  string
  }>
  /** 当前可访问资源 */
  clientResources: Array<{
    id: string
    resourceName: string
    resourceType: number
    url: string
    parentId: string
    deleted: number
    createTime: number
    updateTime: number
  }>
}

export async function getToken (): Promise<string | null> {
  return new Promise((resolve, reject) => {
    return uni.getStorage({
      key: 'token',
      success: (res) => resolve(res.data),
      fail: (error) => resolve(null)
    })
  })
}

export async function setToken (token: string | null): Promise<void> {
  return new Promise((resolve, reject) => {
    return uni.setStorage({
      key: 'token',
      data: token,
      success: (res) => resolve(res.data),
      fail: (error) => reject(new Error(error.errMsg))
    })
  })
}

export async function getUserInfo (): Promise<UserInfo | null> {
  return new Promise((resolve, reject) => {
    return uni.getStorage({
      key: 'userInfo',
      success: (res) => resolve(res.data),
      fail: (error) => resolve(null)
    })
  })
}

export async function setUserInfo (userInfo: UserInfo | null): Promise<void> {
  return new Promise((resolve, reject) => {
    return uni.setStorage({
      key: 'userInfo',
      data: userInfo,
      success: (res) => resolve(res.data),
      fail: (error) => reject(new Error(error.errMsg))
    })
  })
}
