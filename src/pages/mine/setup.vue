<template>
  <view class="u-p-t-20">
    <view class="action-list u-p-x-32 bg-white">
      <view
        class="action-item flex ai-center jc-between u-p-y-25 fs-28"
        @tap="goIdentity"
      >
        <image src="../../assets/setting/s1.png" class="action-icon"></image>
        <view class="action-text flex-1 text-color-primary">实名认证</view>
        <view class="action-value text-color-third u-p-r-30">{{
          userInfo.realName ? '已实名' : '去设置'
        }}</view>
        <image src="../../assets/mine/arrow.png" class="arrow"></image>
      </view>
      <view class="action-item flex ai-center jc-between u-p-y-25 fs-28">
        <image src="../../assets/setting/s2.png" class="action-icon"></image>
        <view class="action-text flex-1 text-color-primary">账号</view>
        <view
          class="action-value text-color-third u-p-r-30"
          @click="goChangeAccount"
          >{{ userInfo.account || '去设置' }}</view
        >
        <image src="../../assets/mine/arrow.png" class="arrow"></image>
      </view>
      <view class="action-item flex ai-center jc-between u-p-y-25 fs-28">
        <image src="../../assets/setting/s3.png" class="action-icon"></image>
        <view class="action-text flex-1 text-color-primary">绑定手机号</view>
        <view
          class="action-value text-color-third u-p-r-30"
          @click="goChangeMobile"
          >{{ userInfo.mobile || '去设置' }}</view
        >
        <image src="../../assets/mine/arrow.png" class="arrow"></image>
      </view>
      <view class="action-item flex ai-center jc-between u-p-y-25 fs-28">
        <image src="../../assets/setting/s4.png" class="action-icon"></image>
        <view class="action-text flex-1 text-color-primary">绑定邮箱</view>
        <view
          class="action-value text-color-third u-p-r-30"
          @click="goChangeEmail"
          >{{ userInfo.email || '去设置' }}</view
        >
        <image src="../../assets/mine/arrow.png" class="arrow"></image>
      </view>
      <view class="action-item flex ai-center jc-between u-p-y-25 fs-28">
        <image src="../../assets/setting/wei.png" class="action-icon"></image>
        <view class="action-text flex-1 text-color-primary">绑定微信</view>
        <view
          class="action-value text-color-third u-p-r-30"
          @click="updateOpenId"
          >{{ userInfo.openId ? '已绑定' : '去设置' }}</view
        >
        <image src="../../assets/mine/arrow.png" class="arrow"></image>
      </view>
      <view class="action-item flex ai-center jc-between u-p-y-25 fs-28">
        <image src="../../assets/setting/s5.png" class="action-icon"></image>
        <view class="action-text flex-1 text-color-primary">设置密码</view>
        <view
          class="action-value text-color-third u-p-r-30"
          @click="goChangePassword"
          >去设置</view
        >
        <image src="../../assets/mine/arrow.png" class="arrow"></image>
      </view>
    </view>

    <view
      class="u-m-t-20 flex ai-center jc-center fs-28 bg-white u-p-y-42"
      @tap="goCertification"
    >
      <image src="../../assets/setting/s6.png" class="action-icon u-m-r-22" />
      <text class="theme-color">身份认证</text>
    </view>
    <view
      class="u-m-t-20 flex ai-center jc-center fs-28 bg-white u-p-y-42"
      @tap="goLoginout"
    >
      <image src="../../assets/setting/s7.png" class="action-icon u-m-r-22" />
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { onShow } from '@dcloudio/uni-app'
  import { useService, setToken, setUserInfo } from '@/plugins/app-core'
  import socket from '@/utils/socketXctm'
  const service = useService()

  let userInfo: any = reactive({})
  const getDetail = async () => {
    const result = await service.user.getCurrentUserInfo()
    console.log(result)
    Object.assign(userInfo, result)
  }
  const goIdentity = () => {
    if (userInfo.idCard) {
      uni.navigateTo({
        url: '/pages/mine/identity/person-info',
      })
    } else {
      uni.navigateTo({
        url: '/pages/mine/identity/person',
      })
    }
  }
  const goCertification = () => {
    uni.navigateTo({
      url: '/pages/mine/certification',
    })
  }

  const goChangeAccount = () => {
    if (!userInfo.account) {
      uni.navigateTo({
        url: './change/account',
      })
    }
  }

  const goChangePassword = () => {
    let mobile = userInfo.mobile
    let pwd = userInfo.password
    // 用户有手机，无旧密码 -> 直接设置密码
    // 用户有手机，存在旧密码 -> 默认进入验证码设置密码页（可否切换到验证码更换）
    // 用户没有手机，存在旧密码 -> 默认进入密码设置密码页
    let statu = '0'
    if (mobile && pwd !== '1') {
      statu = '0'
    } else if (mobile && pwd === '1') {
      statu = '1'
    } else if (!mobile && pwd === '1') {
      statu = '2'
    }
    uni.navigateTo({
      url: './change/password?statu=' + statu,
    })
  }

  const goChangeMobile = () => {
    if (userInfo.mobile) {
      uni.navigateTo({
        url: './bind/bind-history',
      })
    } else {
      uni.navigateTo({
        url: './bind/bind-new',
      })
    }
  }

  const goChangeEmail = () => {
    if (userInfo.email) {
      uni.navigateTo({
        url: './email/bind-history',
      })
    } else {
      uni.navigateTo({
        url: './email/bind-new',
      })
    }
  }

  const goLoginout = () => {
    uni.showModal({
      title: '提示',
      content: '确认要退出吗？',
      showCancel: true,
      success: async (res) => {
        if (res.confirm) {
          await service.mine.logout()
          await socket.logout()
          await setToken(null)
          await setUserInfo(null)
          uni.switchTab({ url: `/pages/index` })
        }
      },
    })
  }

  const updateOpenId = () => {
    if (userInfo.openId) {
      uni.showModal({
        title: '解绑微信',
        content: '解除绑定后，将不可以使用此微信登录账号，确定解绑吗？',
        showCancel: true,
        confirmText: '确定',
        success: async (res) => {
          if (res.confirm) {
            uni.login({
              async success(event) {
                await service.mine.unbindOpenId()
                uni.showToast({ title: '解绑成功', icon: 'success' })
                await getDetail()
              },
            })
          }
        },
      })
    } else {
      uni.showModal({
        title: '提示',
        content: '是否绑定当前微信',
        showCancel: true,
        confirmText: '确定',
        success: async (res) => {
          if (res.confirm) {
            uni.login({
              async success(event) {
                await service.mine.updateOpenId({ code: event.code })
                uni.showToast({ title: '绑定成功', icon: 'success' })
                await getDetail()
              },
            })
          }
        },
      })
    }
  }

  onShow(() => {
    getDetail()
  })
</script>

<style lang="scss" scoped>
  .action-list {
    .action-text {
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 30rpx;
      flex-grow: 1;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    .action-value {
      max-width: 560rpx;
      word-break: break-all;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    .action-item {
      border-bottom: 1rpx solid #ece7e3;
      padding: 40rpx 0;
      &:last-child {
        border-bottom: 1rpx solid transparent;
      }
    }
  }
  .action-icon {
    max-width: 42rpx;
    min-width: 42rpx;
    height: 42rpx;
  }
  .theme-color {
    color: $--ym-color-primary;
  }
</style>
