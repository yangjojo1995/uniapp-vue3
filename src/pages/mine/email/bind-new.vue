<template>
  <view class="content">
    <view class="form">
      <view class="form-group">
        <view class="form-group-label">验证新邮箱</view>
        <view class="form-group-input">
          <input  placeholder="请输入邮箱地址" :maxlength="100" v-model="email" />
        </view>

        <view class="form-group-input mb-5">
          <input placeholder="请输入邮箱验证码" :maxlength="6" v-model="code" style="width: 400rpx"/>
          <view v-if="codeDown" class="code-btn white-btn">{{ codeDown }}</view>
          <view v-else class="code-btn plain-btn" @click="handleSendCode">获取邮箱验证码</view>
        </view>

      </view>
    </view>
    <view class="next-btn" @click="handleSubmit">提交</view>
  </view>
</template>

<script setup lang="ts">
  import { ref, reactive, refType, onLoad, useService, requireCheck, operateConfirm, errorCatch } from '@/utils/commonUse'
  import { userInterface } from '@/service/mine'
  import { isEmail } from '@/utils/regex'
  const service = useService()

  // 用户信息，用于显示验证码提示信息
  let userInfo: userInterface = reactive({ id: '', userName: '' })
  onLoad(async (props) => {
    const result: userInterface = await service.user.getCurrentUserInfo()
    Object.assign(userInfo, result)
    if (props.flagId) {
      flagId.value = props.flagId
    }
  })

  // 验证码发送及倒计时
  let codeDown: refType<number> = ref(0)
  const handleSendCode = async (): Promise<void> => {
    console.log(email.value)
    console.log(isEmail(email.value))
    if(requireCheck('请输入邮箱', email.value)) return
    if(requireCheck('请输入正确的邮箱地址', isEmail(email.value))) return

    let res: boolean = await service.app.sendCode({account: email.value, template: 'bind-email' })
    if (errorCatch(res)) return
    let num: number = 60
    countDown()
    function countDown(): void {
      codeDown.value = num
      num--
      codeDown.value > 0 && setTimeout(countDown, 1000)
    } 
  }

  // 校验表单信息
  let code: refType<string> = ref('')
  let email: refType<string> = ref('')
  let flagId: refType<string> = ref('')
  const handleSubmit = async () => {
    console.log(isEmail(email.value))
    if(requireCheck('请输入正确的邮箱地址', isEmail(email.value))) return
    if(requireCheck('请输入验证码', code.value)) return
    let params = {
      ...!!flagId.value && {flagId: flagId.value},
      code: code.value,
      email: email.value
    }
    operateConfirm('绑定邮箱', async () => {
      return await service.mine.setEmail(params)
    }, () => {
      uni.navigateTo({ url: `./bind-success`})
    })
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
