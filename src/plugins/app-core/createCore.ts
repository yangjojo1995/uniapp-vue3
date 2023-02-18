import type { App } from '@vue/runtime-core'

import { configKey } from './useConfig'
import { serviceKey } from './useService'
import { routerKey } from './useRouter'
import { getToken, setToken, getUserInfo, setUserInfo } from './authentication'
import { navigateBack } from './navigate'
import router from './router'
import shareIcon from '../../assets/index/share.png'

export interface CoreOptions {
  readonly config: Record<string, any>,
  readonly service: Record<string, Record<string, Function>>
}

export interface ComponentCustomProperties {
  readonly $config: CoreOptions['config'],
  readonly $service: CoreOptions['service'],
  readonly $router: typeof router,
  readonly $getToken: typeof getToken,
  readonly $setToken: typeof setToken,
  readonly $getUserInfo: typeof getUserInfo,
  readonly $setUserInfo: typeof setUserInfo
}

export default function (options: CoreOptions) {
    
  function install (app: App & { router?: typeof router }) {
    app.config.globalProperties.$config = options.config
    app.config.globalProperties.$service = options.service
    app.provide(configKey, options.config)
    app.provide(serviceKey, options.service)

    // #if H5
    setTimeout(() => app.provide(routerKey, <typeof router>app.router), 0)
    // #endif

    // #ifndef H5
    app.config.globalProperties.$router = router
    app.provide(routerKey, router)
    // #endif

    app.config.globalProperties.$getToken = getToken
    app.config.globalProperties.$setToken = setToken
    app.config.globalProperties.$getUserInfo = getUserInfo
    app.config.globalProperties.$setUserInfo = setUserInfo

    // 分享
    // #ifndef H5 || APP-PLUS
    let shareOptions = {}
    app.mixin({
      onLoad () {
        uni.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        })
      },
      onShareAppMessage () {
        if ((this.mpType || this.$mpType) === 'page') {
          shareOptions = this.shareOptions || {}
        }
        return {
          title: options.config.TITLE || '标题',
          path: '/pages/index',
          imageUrl: shareIcon,
          ...shareOptions
        }
      },
      onShareTimeline () {
        if ((this.mpType || this.$mpType) === 'page') {
          shareOptions = this.shareOptions || {}
        }
        return {
          title: options.config.TITLE || '标题',
          path: '/pages/index',
          imageUrl: shareIcon,
          ...this.shareOptions
        }
      }
    })
    // #endif

    uni.navigateBack = navigateBack
  }

  return { install }
}