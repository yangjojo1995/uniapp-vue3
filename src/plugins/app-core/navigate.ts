import { wrap } from '@/utils'
import router from './router'

export const navigateBack = wrap(uni.navigateBack, function (navigateBack, options) {
  const pages = getCurrentPages()
  if (pages.length > 1) return navigateBack(options)
  const homePath = router.getHomeRouteRecordRaw().path
  return uni.reLaunch({ url: '/' + homePath.replace(/^\//, '') })
})

export default navigateBack