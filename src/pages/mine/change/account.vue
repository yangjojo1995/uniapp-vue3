<template>

  <view class="content">
    <view class="form">

      <view class="form-group">
        <view class="form-group-label label-required">请输入账号</view>
        <view class="form-group-input">
          <input placeholder="请设置您的账号" @change="checkAccount" :maxlength="20" v-model="inputAccount" />
        </view>
        <view v-if="openCheck && !accountAccord" class="form-group-error">请输入正确的账号</view>
         <view class="form-group-description">4~20个字母、数字、下划线或减号并以字母开头</view>
      </view>
    </view>

    <view class="next-btn" @tap="handleSubmit">保存</view>

  </view>
</template>

<script setup lang="ts">
import { ref, refType, useService, operateConfirm } from '@/utils/commonUse'
import { isAccount } from '@/utils/regex'
const service = useService()

// 校验表单信息
let inputAccount: refType<string> = ref('')
let openCheck: refType<boolean> = ref(false) // 是否开启表单校验
let accountAccord: refType<boolean> = ref(false) // 密码校验是否通过

const checkAccount = (e: any): void => {
  accountAccord.value = isAccount(e.detail.value)
}
const handleSubmit = () => {
  openCheck.value = true
  if (!accountAccord.value) return
  operateConfirm('设置账号', async () => {
    return await service.mine.updateAccount({ account: inputAccount.value })
  })
}

</script>

<style lang="scss" scoped>
.content{
  background: #fff;
  padding: 64rpx;
  margin-top: 20rpx;
}
.form{
  .form-group{
    margin-bottom: 8rpx;
    overflow: hidden;
    height: 280rpx;

    .form-group-label{
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
      margin: 16rpx 0;
    }

    .form-group-input{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #F2F2F2;
      padding: 8rpx 0 4rpx;

      input{
        font-size: 12px;
      }
    }

    .form-group-error{
      color: #FF4536;
      font-size: 24rpx;
      margin: 12rpx 0;
    }

    .form-group-description{
      color: #999;
      font-size: 22rpx;
      margin: 12rpx 0;
    }
  }
}
</style>
