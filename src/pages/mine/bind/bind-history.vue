<template>
  <view class="content">
    <view class="form">
      <view class="form-group">
        <view class="form-group-label">安全验证</view>
        <view>
          <text class="text-color-third fs-26 introduce flex-1 flex"
            >为了保证你的账号安全，需先验证你的身份，验证成功后可以进行下一步操作。</text
          >
        </view>
      </view>
      <view class="form-group">
        <view class="form-group-text">
          <text>{{ userInfo.mobile }}</text>
          <view v-if="codeDown" class="code-btn white-btn">{{ codeDown }}</view>
          <view v-else class="code-btn plain-btn" @click="handleSendCode"
            >获取手机验证码</view
          >
        </view>
        <view class="form-group-description" v-if="showMeg">
          <view v-if="userInfo.mobile"
            >已发送至手机号{{ userInfo.mobile }}</view
          >
        </view>
        <view class="form-group-code-text">
          <u-code-input
            v-model="code"
            hairline
            @finish="codeFinish"
            maxlength="6"
          ></u-code-input>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  refType,
  onLoad,
  useService,
  errorCatch
} from '@/utils/commonUse'
import { userInterface } from '@/service/mine'
// import { isPwd } from '@/utils/regex'
const service = useService()

// 用户信息，用于显示验证码提示信息
const userInfo: userInterface = reactive({ id: '', userName: '' })
onLoad(async (props) => {
  const result: userInterface = await service.user.getCurrentUserInfo()
  Object.assign(userInfo, result)
})

// 密码显隐事件
// const ifPwd: refType<boolean> = ref(true)
// const togglePwd = (): void => {
//   ifPwd.value = !ifPwd.value
// }

// 验证码发送及倒计时
const showMeg: refType<boolean> = ref(false)
const codeDown: refType<number> = ref(0)
const handleSendCode = async (): Promise<void> => {
  showMeg.value = true
  const res: boolean = await service.mine.sendCode({ template: 'bind-mobile' })
  if (errorCatch(res)) return
  let num: number = 60
  countDown()
  function countDown (): void {
    codeDown.value = num
    num--
    codeDown.value > 0 && setTimeout(countDown, 1000)
  }
}

// 验证码
const code: refType<string> = ref('')

// 输入验证码
const isSubmit = ref(false)
const codeFinish = async (e: number) => {
  if (isSubmit.value) return
  isSubmit.value = true
  try {
    const result = await service.user.checkPhone({
      code: e
    })
    uni.navigateTo({
      url: `./bind-new?flagId=${result}`
    })
  } catch (error) {
    isSubmit.value = false
  }
}
</script>

<style lang="scss" scoped>
  .content {
    background: #fff;
    padding: 64rpx;
    margin-top: 20rpx;
  }
  .form {
    .form-group {
      overflow: hidden;
      margin-bottom: 90rpx;

      .form-group-label {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        margin: 16rpx 0;
        margin-bottom: 24rpx;
      }
      .form-group-text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8rpx 0 4rpx;
        input {
          width: 100%;
          font-size: 12px;
        }
      }
      .form-group-code-text {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8rpx 0 4rpx;
        margin-top: 96rpx;
      }
      .form-group-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #f2f2f2;
        padding: 8rpx 0 4rpx;

        input {
          width: 100%;
          font-size: 12px;
        }
      }

      .form-group-error {
        color: #ff4536;
        font-size: 24rpx;
        margin: 12rpx 0;
      }

      .form-group-description {
        color: #999;
        font-size: 22rpx;
        margin: 12rpx 0;
      }
    }
  }

  .code-btn {
    border-radius: 32px;
    width: 232rpx;
    height: 64rpx;
    font-size: 24rpx;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plain-btn{
    background: #EBF8EE;
    color: #00BA75;
    border-radius: 44rpx;
  }

  .white-btn {
    background: #fff;
    border: 2rpx solid #999;
    color: #999;
  }

  .next-btn {
    margin-top: 64rpx;
  }
</style>
