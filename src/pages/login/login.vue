<template>
  <view class="login-page">
    <view class="login-page__header">
      <view class="login-page-logo">
        <!-- <view class="login-page-logo__icon"></view>
        <view class="login-page-logo__text">{{ config.TITLE }}</view> -->
        <image class="login-page-logo__image" src="@/assets/login/logo.png" mode="aspectFit"></image>
      </view>
      <!-- <view class="login-page-tip">
        <span>欢迎使用{{ config.TITLE }}</span>
      </view> -->
    </view>
    <view class="login-page__content">
      <image class="login-page-content-image" :src="config.ADMIN_ASSETS_URL + 'content.png'" alt="" srcset="" />
    </view>
    <view class="login-page__button">
      <ym-button class="button" type="primary" open-type="getPhoneNumber" @getphonenumber="submitLogin">
        <image class="icon-weixin" src="@/assets/login/icon-weixin.png" />
        <span>微信用户一键登录</span>
      </ym-button>

      <ym-button class="button account-btn" type="info" plain @click="router.push('/pages/login/login-account?from='+from+'&inviter='+inviter)">账号登录/注册</ym-button>
    </view>
    <view class="agreement-box">
      <view class="agree-box" @click="agreement = !agreement">
        <image class="agree-icon" src="../../assets/login/unagree.png" v-if="!agreement" >
        </image>
        <image class="agree-icon" src="../../assets/login/agree.png" v-else>
        </image>
        <text>登录即同意乡产投盟</text>
        <text class="link" @click.stop="router.push('/pages/login/agreement')">《用户协议》</text> <text class="fs-24 text-color-primary">与</text><text class="link" @click.stop="router.push('/pages/login/privacy')">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useConfig, useRouter, useService } from '@/plugins/app-core'
import useLoginByUserInfo from './setup/useLoginByUserInfo'
import { onLoad, onShow } from "@dcloudio/uni-app";
const config = useConfig()
const router = useRouter()
const service = useService()
const loginByUserInfo = useLoginByUserInfo()

// 获取 flagId
const flagId = ref('')
const getFlagId = async () => {
  const loginResult = await (uni.login({ provider: 'weixin' }) as unknown as Promise<{ code: string }>)
  const code = loginResult.code
  flagId.value = await service.app.getWeixinFlagId({ code })
}
onMounted(getFlagId)

const getFlagIdTimer = setInterval(getFlagId, 1000 * 60 * 10)
onUnmounted(() => clearInterval(getFlagIdTimer))

const agreement:Ref<boolean> = ref(false)

let inviter = ref('')
onLoad((options) => {
  inviter.value = options.inviter || ''
})

// 执行登录
async function requestLogin(event: any){
  if (!flagId.value) return
  const { encryptedData, iv } = event.detail
  const userInfo = await service.app.loginByWeixin({
    flagId: flagId.value,
    encryptedData,
    iv,
    inviter: inviter.value || ''
  })
  await loginByUserInfo(userInfo, from.value ? 1 : undefined)
}

// 点击登录按钮
const submitLogin = async function (event: any) {
  const { encryptedData, iv } = event.detail
  if (encryptedData == null || iv == null) return uni.showToast({ icon: 'none', title: '需要允许获取用户手机号授权' })
  if (!agreement.value){
    uni.showModal({
      title: '用户协议与隐私政策',
      content: `同意以下协议：乡产投盟《用户协议》与《隐私政策》，未注册的手机号将自动完成账号注册。`,
      confirmText: '同意',
      cancelText: '不同意',
      showCancel: true,
      success: async (res) => {
        if (res.confirm) {
          //agreement.value = true
          requestLogin(event)
        }else{
          return uni.showToast({ title: '请同意用户协议与隐私政策', icon: 'none' })
        }
      }
    })
  }else{
    requestLogin(event)
  }
}

let from = ref()
onLoad((options) => {
  from.value = options.from || ''
})

</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: #ffffff;
  &__header {
    padding-top: 140rpx;
    width: 566rpx;
    margin: 0 auto;
  }
  &__content {
    width: 550rpx;
    margin: 0 auto;
  }
  &__button {
    width: 550rpx;
    margin: 0 auto;
  }
}

.login-page-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  &__icon {
    flex: 0 0 89rpx;
    width: 89rpx;
    height: 89rpx;
    border-radius: 50%;
    background: #00BA75;
    margin-right: 20rpx;
  }
  &__text {
    font-size: 60rpx;
    font-weight: 600;
    color: #333333;
  }
  &__image {
    display: block;
    width: 556rpx;
    height:96rpx;
    margin: 0 auto;
  }
}

.login-page-tip {
  margin-top: 34rpx;
  font-size: 26rpx;
  font-weight: 400;
  color: #666666;
  line-height: 37rpx;
  letter-spacing: 18rpx;
  text-align: center;
}

.login-page-content-image {
  display: block;
  width: 550rpx;
  height: 647rpx;
  margin: 0 auto;
}

.button {
  display: block;
  margin-bottom: 14rpx;
  .icon-weixin {
    display: inline-block;
    width: 42rpx;
    height: 35rpx;
    margin-right: 12rpx;
  }
}
.account-btn{
  ::v-deep.button.ym-button--info{
    color:#333333 !important;
  }
}

.agreement-box {
  margin-top: 40rpx;
  text-align: center;
}

.agree-box {
  display: flex;
  justify-content: center;
  align-items: center;

  text {
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
    line-height: 24rpx;
    margin-left: 10rpx;
  }
}

.link {
  color: #00BA75 !important;
}
.agree-icon{
  width:28rpx;
  height:28rpx;
  min-width: 28rpx;
}

</style>
