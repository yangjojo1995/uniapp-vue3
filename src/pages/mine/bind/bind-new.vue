<template>
  <view class="content">
    <view class="form">
      <view class="form-group">
        <view class="form-group-label">验证新手机号</view>
        <view class="form-group-input">
          <input
            placeholder="请输入手机号码"
            :maxlength="11"
            @change="checkPhone"
            v-model="phone"
          />
        </view>
        <view v-if="openCheck && !phoneAccord" class="form-group-error"
          >请输入正确的手机号码</view
        >
        <view class="form-group-input mb-5">
          <input
            placeholder="请输入手机验证码"
            :maxlength="6"
            v-model="code"
            style="width: 400rpx"
          />
          <view v-if="codeDown" class="code-btn white-btn">{{ codeDown }}</view>
          <view v-else class="code-btn green-btn" @click="handleSendCode"
            >获取验证码</view
          >
        </view>
        <view class="form-group-error" v-if="openCheck && code == ''"
          >请输入验证码</view
        >
        <view class="form-group-description" v-if="showMeg">
          <view>已发送至手机号{{ phone }}</view>
        </view>
      </view>
    </view>
    <view class="next-btn" @click="check">完成</view>
  </view>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  refType,
  onLoad,
  useService,
  // operateConfirm,
  errorCatch
} from '@/utils/commonUse'
import { userInterface } from '@/service/mine'
import { isPhone } from '@/utils/regex'
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
  if (!phone.value) return
  if (!isPhone(phone.value)) {
    uni.showToast({ icon: 'none', title: '请输入合法11位手机号' })
    return
  }
  const res: boolean = await service.app.sendCode({ account: phone.value, template: 'bind-mobile' })
  if (errorCatch(res)) return
  let num: number = 60
  countDown()
  function countDown (): void {
    codeDown.value = num
    num--
    codeDown.value > 0 && setTimeout(countDown, 1000)
  }
}

// 校验表单信息
const code: refType<string> = ref('')
const phone: refType<string> = ref('')
const flagId: refType<string> = ref('')
const openCheck: refType<boolean> = ref(false) // 是否开启表单校验
const phoneAccord: refType<boolean> = ref(false) // 密码校验是否通过
const checkPhone = (e: any): void => {
  phoneAccord.value = isPhone(e.detail.value)
}
const check = async () => {
  openCheck.value = true
  if (!isPhone(phone.value)) {
    uni.showToast({ icon: 'none', title: '请输入合法11位手机号' })
    return
  }
  if (!code.value) return
  if (!phoneAccord.value) return
  let params = {}
  if (flagId.value) {
    params = {
      flagId: flagId.value,
      code: code.value,
      phone: phone.value
    }
  } else {
    params = {
      code: code.value,
      phone: phone.value
    }
  }
  await service.user.newPhone(params)
  uni.navigateTo({
    url: './bind-success'
  })
}
onLoad(async (options) => {
  if (options.flagId) {
    flagId.value = options.flagId
  }
})
</script>

<style lang="scss" scoped>
  .content {
    background: #fff;
    padding: 64rpx;
    margin-top: 20rpx;
  }
  .form {
    .form-group {
      margin-bottom: 8rpx;
      overflow: hidden;

      .form-group-label {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        margin: 16rpx 0;
        margin-bottom: 80rpx;
      }

      .form-group-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #f2f2f2;
        padding: 8rpx 0 4rpx;
        margin-bottom: 40rpx;
        input {
          width: 100%;
          font-size: 12px;
        }
      }
      .mb-5 {
        margin-bottom: 10rpx;
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

  .icon-btn {
    width: 64rpx;
    height: 64rpx;
    text-align: right;

    image {
      width: 48rpx;
      object-fit: cover;
      height: 32rpx;
    }
  }

  .code-btn {
    border-radius: 32px;
    width: 180rpx;
    height: 64rpx;
    font-size: 28rpx;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .green-btn {
    background: $--ym-bg-primary;
    border: 2rpx solid transparent;
    color: #fff;
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
