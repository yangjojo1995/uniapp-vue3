import type { UserInfo } from '@/plugins/app-core'
import { getUserInfo, setUserInfo } from '@/plugins/app-core'
import socket from '@/utils/socketXctm'
import service from '@/service'

/** 获取个人身份 */
export async function getPersonIdentity (userInfo?: UserInfo | null): Promise<UserInfo['personIdentity'][0] | null> {
  
  // 获取用户信息
  userInfo = userInfo || (await getUserInfo())
  if (!userInfo) return null
  
  // 获取存储的 subToken
  const subToken: string | null = uni.getStorageSync(`${userInfo.userId}_subToken`) || null
  if (!subToken) return null

  // 获取个人身份
  return userInfo.personIdentity.find(item => item.deleted === 0 && item.subToken === subToken) || null
}

/** 获取企业身份 */
export async function getEnterpriseIdentity (userInfo?: UserInfo | null): Promise<UserInfo['enterpriseIdentities'][0] | null> {

  // 获取用户信息
  userInfo = userInfo || (await getUserInfo())
  if (!userInfo) return null

  // 获取存储的 subToken
  const subToken: string | null = uni.getStorageSync(`${userInfo.userId}_subToken`) || null
  if (!subToken) return null

  // 获取企业身份
  return userInfo.enterpriseIdentities.find(item => item.deleted === 0 && item.subToken === subToken) || null
}

/** 获取身份 */
export async function getIdentity (userInfo?: UserInfo | null): Promise<UserInfo['personIdentity'][0] | UserInfo['enterpriseIdentities'][0] | null> {
  // 获取用户信息
  userInfo = userInfo || (await getUserInfo())
  if (!userInfo) return null

  // 获取身份
  return await getPersonIdentity(userInfo) || await getEnterpriseIdentity(userInfo)
}

/** 获取 SubToken */
export async function getSubToken (userInfo?: UserInfo | null): Promise<string | null> {

  // 获取用户信息身份
  userInfo = userInfo || (await getUserInfo())
  const person = await getPersonIdentity(userInfo)
  const enterprise = await getEnterpriseIdentity(userInfo)
  const identity = enterprise || person

  // 不存在身份，则清除 SubToken
  if (!identity) {
    setSubToken(null)
    return null
  }

  // 获取 SubToken
  return identity.subToken || null
}

/** 设置 SubToken */
export async function setSubToken (subToken: string | null) {

  // 判断是否登录
  let userInfo = await getUserInfo()
  if (!userInfo) return

  // 如果 subToken 为空，则清除缓存
  if (!subToken) return uni.removeStorageSync(`${userInfo.userId}_subToken`)

  // 更新 userInfo，保证最新的用户信息
  userInfo = await service.app.getUserInfo()
  await setUserInfo(userInfo)
  if (!userInfo) return

  // 判断用户信息中是否存在该身份
  const pass = userInfo.personIdentity.some(item => item.deleted === 0 && item.subToken === subToken) || userInfo.enterpriseIdentities.some(item => item.deleted === 0 && item.subToken === subToken)
  if (!pass) return

  await socket.logout()

  // 存储 subToken
  uni.setStorageSync(`${userInfo.userId}_subToken`, subToken)

  // socket 重连
  if (subToken) {
    await socket.login(userInfo.token, subToken)
  }

}
