
import type { UserInfo } from '@/plugins/app-core'
import { useRouter, useService, setToken, setUserInfo } from '@/plugins/app-core'
import { getSubToken, setSubToken } from '@/utils/subToken'
import socket from '@/utils/socketXctm'

function showModal (content: string, options: { [key: string]: any } = {}) {
  return new Promise((resolve, reject) => {
    return uni.showModal({
      title: '提示',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      ...options,
      content: content,
      success: function (resust) {
        return resolve(resust)
      },
    })
  })
}

export default function useLoginByUserInfo () {

  const router = useRouter()
  const service = useService()

  return async function loginByUserInfo (userInfo: UserInfo, back?: number) {

    await setToken(userInfo.token)
    await setUserInfo(userInfo)
  
    let subToken = await getSubToken()
    if (!subToken) {
      subToken = userInfo.personIdentity[0]?.subToken
      if (subToken) await setSubToken(subToken)
    }

    if (subToken) {
      await socket.login(userInfo.token, subToken)

      await service.app.updateLoginTime()
    }
  
    const popup0 = await service.mine.getPopup({ type: '0' })
    if (popup0) {
      const { confirm } = (await showModal(`本次登录与账号中微信绑定的手机号不一致，是否更换绑定为${popup0.bindData}?`, { confirmText: '确定更换' })) as { confirm: boolean }
      await service.mine.emitPopupOperate({ operate: confirm ? 'yes' : 'no', id: popup0.id }) 
      if (confirm) {
        await showModal(`已重新绑定手机号${popup0.bindData},此后可通过手机验证码登录包括PC端、小程序系统。`, { confirmText: '我知道了', showCancel: false })
      } else {
        return
      }
    }

    if (back) {
      uni.navigateBack({
        delta: back
      })
    } else {
      return router.replace('/pages/index')
    }

  }

}
