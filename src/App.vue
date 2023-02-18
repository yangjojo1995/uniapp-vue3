<script setup lang="ts">
  import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
  import socket from '@/utils/socketXctm'
  import service from '@/service'
  import { getToken } from '@/plugins/app-core'
  import { getSubToken } from '@/utils/subToken'
  import router from '@/plugins/app-core/router'
  import config from '@/config'
  
  // 定义更新方法
  function versionUpdate() {
    // 判断应用的 getUpdateManager 是否在当前版本可用
    if (uni.canIUse('getUpdateManager')) {
      const updateManager = uni.getUpdateManager()
      // 向小程序后台请求完新版本信息
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          //小程序有新版本，静默下载新版本，新版本下载完成
          updateManager.onUpdateReady(function () {
            //模态弹窗（确认、取消）
            uni.showModal({
              title: '更新提示',
              content: '小程序已发布新版本，是否重启？',
              success: function (res) {
                //用户点击确定
                if (res.confirm) {
                  //当新版本下载完成，调用该方法会强制当前小程序应用上新版本并重启
                  updateManager.applyUpdate()
                } //用户点击取消
                else if (res.cancel) {
                  //强制用户更新，弹出第二次弹窗
                  uni.showModal({
                    title: '提示',
                    content: '小程序已发布新版本，是否重启',
                    showCancel: false, //隐藏取消按钮
                    success: function (res) {
                      //第二次提示后，强制更新
                      if (res.confirm) {
                        // 当新版本下载完成，调用该方法会强制当前小程序应用上新版本并重启
                        updateManager.applyUpdate()
                      }
                    },
                  })
                }
              },
            })
          })
          // 当新版本下载失败
          updateManager.onUpdateFailed(function () {
            uni.showModal({
              title: '提示',
              content: '请您删除当前小程序，重新打开小程序',
            })
          })
        }
      })
    } else {
      // 提示用户在最新版本的客户端上体验
      uni.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，可能无法使用该功能，请升级到最新版本后重试。',
      })
    }
  }

  // Socket
  async function connectSocket() {
    const token = await getToken()
    if (!token) return
    const subToken = await getSubToken()
    if (!subToken) return

    await socket.login(token, subToken)
  }

  async function onKeyboardHeightChange () {
    if (uni.canIUse('onKeyboardHeightChange')) {
      uni.onKeyboardHeightChange((result) => {
        uni.$emit('keyboardHeightChange', result)
      })
    }
  }

  // 查询消息未读/已读状态
  async function getReadFlag(token: string|null) {
    if(!token){
      token = await getToken()
    }
    const subToken = await getSubToken()
    uni.request({
      url: config.API_BASE_URL + '/front/message/un-read',
      method: 'GET',
      header: {
        'Dreamkey-Token': token,
        'Sub-Token': subToken
      },
      success: function(e: any){
        if(e.data?.data){
          uni.showTabBarRedDot({ index: 2 })
        }else{
          uni.hideTabBarRedDot({ index: 2 })
        }
      },
      fail: (error) => {
        console.error('getReadFlag fail: ' + error.errMsg)
      }
    })
  }

  onLaunch(() => {
    versionUpdate()
    connectSocket()
    onKeyboardHeightChange()

    setInterval(async () => {
      const token = await getToken()
      if (token) {
        const pages = getCurrentPages()
        const page = pages[pages.length - 1]
        if (page && page.route) {
          const result = router.routeLocationNormalized('/' + page.route.replace(/^\//, ''))
          if (result?.meta.isTab){
            getReadFlag(token)
          }
          /* const result = router.routeLocationNormalized('/' + page.route.replace(/^\//, ''))
          if (result?.meta.isTab) {
            const unRead = await service.message.getUnRead()
            if (unRead) {
              uni.showTabBarRedDot({ index: 2 })
            } else {
              uni.hideTabBarRedDot({ index: 2 })
            }
          } */
        }
      }
    }, 5000)
  })
  onShow((options) => {
    const statusBar =uni.getSystemInfoSync().statusBarHeight
    // 胶囊按钮新消息
    const menButton = uni.getMenuButtonBoundingClientRect()
    uni.setStorageSync('statusBar',statusBar)
    uni.setStorageSync('menButton', JSON.stringify(menButton))

    uni.$emit('updateDate', {scene : options.scene})
    console.log('App show')
    console.log(options.scene)
  })
  onHide(() => {
    console.log('App Hide')
  })
</script>
<style lang="scss">
  // @import "uview-ui/index.scss";
  // @;

/* uni 分段器 样式修改 */
::v-deep.segmented-control--text.segmented-control{
  height: 84rpx;
  .segmented-control__item{
    view{
      position: relative;
      .segmented-control__text.segmented-control__item--text{
        border: none;
        &::after{
          content: '';
          width: 50rpx;
          height: 8rpx;
          background: #1FBE49;
          border-radius: 4rpx;
          position: absolute;
          left:0;
          right:0;
          left: 0;
          bottom: -16rpx;
          margin: auto;
        }
      }
      
    }
  }
}  
</style>
