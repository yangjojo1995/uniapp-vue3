<template>
  <view class="alogin-page">
    <view class="alogin-page__container">
      <view class="tabs">
        <text v-for="val in tabs" class="tabs__item" :class="{ 'is-active': tab === val }" @click="setTab(val)">
          <text>{{ val }}</text>
        </text>
      </view>

      <view v-if="tab === '账号密码登录'" class="form">
        <view class="form__item">
          <input class="form__input" type="text" v-model="accountForm.account" :maxlength="100" placeholder="请输入账号、手机号或邮箱地址" />
        </view>
        <view class="form__item">
          <input class="form__input" :password="ifPwd" v-model="accountForm.password" :maxlength="100" placeholder="请输入密码" />
          <view class="icon-btn" @click="togglePwd">
            <image v-show="ifPwd" src="../../assets/mine/hide.png"></image>
            <image v-show="!ifPwd" src="../../assets/mine/show.png"></image> 
          </view>
        </view>
        <view class="form__footer">
          <button class="form__submit" @click="accountFormSubmit">登录</button>
          <view class="form__links">
            <!-- <text>没有账号？先注册</text> -->
            <text @click="toRetrieve()">忘记密码？</text>
          </view>
        </view>
      </view>


      <view v-else-if="tab === '验证码登录'" class="form">
        <view class="form__item">
          <input class="form__input" type="text" v-model="codeForm.account" :maxlength="100" placeholder="请输入手机号或邮箱地址" />
        </view>
        <view class="form__item">
          <input class="form__input" type="number" v-model="codeForm.code" :maxlength="6" placeholder="请输入验证码" />
          <button class="form__input-button" @click="sendCode">
            <text>{{ countdownTimer ? `${countdownTime}s` : '获取验证码' }}</text>
          </button>
        </view>
        <view class="form__footer">
          <button class="form__submit" @click="codeFormSubmit">登录</button>
          <view class="form__agree" @click="agree = !agree">
            <image class="agree-icon" src="../../assets/login/unagree.png" v-if="!agree" >
            </image>
            <image class="agree-icon" src="../../assets/login/agree.png" v-else>
            </image>
            <text>登录即同意乡产投盟</text>
            <text class="link" @click.stop="router.push('/pages/login/agreement')">《用户协议》</text><text class="fs-24 text-color-primary">与</text><text class="link" @click.stop="router.push('/pages/login/privacy')">《隐私政策》</text>
          </view>
        </view>
      </view>

    </view>
    <view class="alogin-page__footer">
      <view class="hr-text">
        <text class="hr-text__inner">微信用户一键登录</text>
      </view>
      <view class="wx-icon" @click="router.back()">
        <uni-icons type="weixin" size="30" color="#666666"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter, useService } from '@/plugins/app-core'
import useLoginByUserInfo from './setup/useLoginByUserInfo'
import { onLoad, onShow } from "@dcloudio/uni-app";
const router = useRouter()
const service = useService()
let from = ref()

const loginByUserInfo = useLoginByUserInfo()

// Tab
const tabs = ref(['账号密码登录', '验证码登录'])
let tab = ref('账号密码登录')
const setTab = (val: any) => {
  tab.value = val
}

// 密码显隐事件
let ifPwd = ref(true)
const togglePwd = (): void => {
  ifPwd.value = !ifPwd.value
}

// 倒计时
let countdownTime = ref(60)
let countdownTimer = ref(0)
const countdownStart = function () {
  if (countdownTimer.value) return
  countdownTimer.value = setInterval(() => {
    if (countdownTime.value > 0) {
      countdownTime.value--
    } else {
      clearInterval(countdownTimer.value)
      countdownTimer.value = 0
      countdownTime.value = 60
    }
  }, 1000)
}

// 账号登录
const accountForm = reactive({
  account: '',
  password: ''
})
const accountFormSubmit = async () => {
  if (!accountForm.account) return uni.showToast({ title: '请输入账号、手机号或邮箱地址', icon: 'none' })
  if (!accountForm.password) return uni.showToast({ title: '请输入密码', icon: 'none' })

  const userInfo = await service.app.loginByAccount({
    account: accountForm.account,
    password: accountForm.password
  })

  await loginByUserInfo(userInfo,from.value ? 2 : undefined)

}

let inviter = ref('')
onLoad((options) => {
  inviter.value = options.inviter || ''
})

// 验证码登录
const codeForm = reactive({
  account: '',
  code: ''
})
const agree = ref(false)
const sendCode = async () => {
  if (countdownTimer.value) return
  if (!codeForm.account) return uni.showToast({ title: '请输入手机号或邮箱地址', icon: 'none' })
  countdownStart()
  await service.app.sendCode({
    account: codeForm.account,
    template: 'login',
  })

}

const codeFormSubmit = async () => {
  if (!codeForm.account) return uni.showToast({ title: '请输入手机号或邮箱地址', icon: 'none' })
  if (!codeForm.code) return uni.showToast({ title: '请输入验证码', icon: 'none' })
  if (!agree.value) {
    uni.showModal({
      title: '用户协议与隐私政策',
      content: `同意以下协议：乡产投盟《用户协议》与《隐私政策》，未注册的手机号将自动完成账号注册。`,
      showCancel: true,
      confirmText: '同意',
      cancelText: '不同意',
      success: async (res) => {
        if (res.confirm) {
          agree.value = true
          codeLogin()
        }else{
          return uni.showToast({ title: '请同意用户协议与隐私政策', icon: 'none' })
        }
      }
    })
  }else{
    codeLogin()
  } 
}

async function codeLogin(){
  const userInfo = await service.app.loginByCode({
    account: codeForm.account,
    password: codeForm.code,
    inviter: inviter.value
  })
  await loginByUserInfo(userInfo,from.value ? 2 : undefined)
}

onLoad((options) => {
  console.log(options)
  from.value = options.from || ''
})

const toRetrieve = () => {
  router.push('/pages/login/retrieve')
}
</script>

<style lang="scss">
.alogin-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: #ffffff;

  &__container {
    flex: 1;
    display: block;
    width: 100%;
    height: 100%;
    max-width: 550rpx;
    max-height: 800rpx;
  }

  &__footer {
    flex: 0 0 184rpx;
    display: block;
    width: 100%;
    height: 184rpx;
    max-width: 550rpx;
  }
}

.tabs {
  display: block;
  width: 100%;
  margin-bottom: 80rpx;

  &__item {
    font-size: 32rpx;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 40rpx;
    padding-right: 40rpx;
    border-right: 2rpx solid #EEEEEE;
    margin-right: 40rpx;

    &:last-child {
      padding-right: 0;
      border-right: none;
      margin-right: 0;
    }

    &.is-active {
      color: #333333;
      font-size: 40rpx;
      font-weight: 500;
    }
  }
}

.form {
  &__item {
    width: 100%;
    height: 100%;
    margin-bottom: 40rpx;
    box-sizing: border-box;
    border-bottom: 2rpx solid #EEEEEE;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__input {
    display: block;
    width: 100%;
    height: 40rpx;
    line-height: 40rpx;
    padding: 18rpx 0;
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;

    &::-webkit-input-placeholder,
    &::-moz-placeholder,
    &:-ms-input-placeholder {
      color: #B2B2B2;
    }
  }

  &__input-button {
    flex: 0 0 auto;
    display: block;
    height: 52rpx;
    background: #EBF8EE;
    border-radius: 44rpx;
    border: none;
    padding: 0 34rpx;
    text-align: center;
    font-size: 24rpx;
    font-weight: 400;
    color: #00BA75;
    line-height: 52rpx;
    min-width: 120rpx;

    &::after {
      display: none;
    }

    &.button-hover {
      opacity: 0.8;
    }
  }

  &__footer {
    margin-top: 100rpx;
  }

  &__submit {
    display: block;
    width: 100%;
    height: 82rpx;
    background: $--ym-bg-primary;
    border-radius: 82rpx;
    border: none;
    padding: 0 34rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 400;
    color: #ffffff;
    line-height: 82rpx;
    margin-bottom: 40rpx;

    &::after {
      display: none;
    }

    &.button-hover {
      opacity: 0.8;
    }
  }

  &__links {
    display: flex;
    // justify-content: space-between;
    justify-content: center;

    text {
      font-size: 24rpx;
      font-weight: 400;
      color: #333333;
      line-height: 24rpx;
    }
  }

  &__agree {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    text {
      font-size: 20rpx;
      font-weight: 400;
      color: #333333;
      line-height: 24rpx;
      margin-left: 10rpx;
    }
  }
}

.button-hover {
  opacity: 0.8;
}

.hr-text {
  position: relative;
  height: 40rpx;
  text-align: center;
  margin-bottom: 54rpx;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -1rpx;
    display: block;
    width: 100%;
    height: 2rpx;
    background: #B8B8B8;
  }

  &__inner {
    position: relative;
    z-index: 1;
    display: inline-block;
    background: #ffffff;
    font-size: 28rpx;
    font-weight: 400;
    color: #B8B8B8;
    line-height: 40rpx;
    text-align: center;
    padding: 0 20rpx;
  }
}

.link {
  color: #00BA75 !important;
}

.wx-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 90rpx;
  height: 90rpx;
  background: #FFFFFF;
  border: 2rpx solid #EEEEEE;
  border-radius: 50%;
}

.icon-btn {
  width: 64rpx;
  height: 64rpx;
  text-align: right;
  line-height: 64rpx;
  
  image{
    width: 42rpx;
    object-fit: cover;
    height: 28rpx;
  }
}
.agree-icon{
  width:28rpx;
  height:28rpx;
  min-width: 28rpx;
}
</style>