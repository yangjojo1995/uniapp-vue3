<template>
  <view class="content u-p-x-64 bg-white">
    <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold  input-label label-required">真实姓名</view>
      <view class="u-p-y-24">
        <input placeholder="请输入真实姓名" class="fs-24" :maxlength="25" v-model="realName"
          @change="getValue($event, realName)" />
      </view>
    </view>
    <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold input-label label-required">身份证号</view>
      <view class="u-p-y-24">
        <input type="idcard" placeholder="请输入身份证号" class="fs-24" :maxlength="18" v-model="idCard"
          @change="getValue($event, idCard)" />
      </view>
    </view>
    <view class="fs-24 text-color-secondary u-p-t-24 u-p-b-60">
      <view class="flex ai-center agree" @tap="agree">
        <u-icon name="checkmark-circle-fill" :color="agreeFlag == false ? '#999' : '#01BA76'" size="18"></u-icon>
        <view class="u-m-l-8 text-color-third">同意将实名信息用于平台投资经理身份认证</view>
      </view>
    </view>
    <view class="next-btn" @tap="check">开始认证</view>
  </view>
</template>

<script setup lang="ts">

import { ref, reactive, computed } from 'vue'
import { onPullDownRefresh, onReachBottom, onLoad } from "@dcloudio/uni-app";
import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'

// 变量控制重复点击
let isSubmit = false
const realName = ref('')
const idCard = ref('')
const agreeFlag = ref(false)
const service = useService()
const from = ref('')
const unionId = ref('')


const getValue = (e: any, propKey: any) => {
  propKey = e
}
const agree = () => {
  agreeFlag.value = !agreeFlag.value
}
const check = async () => {
  if (realName.value === '') {
    uni.showToast({
      icon: 'none',
      title: '请输入真实姓名'
    })
    return
  }
  if (idCard.value === '') {
    uni.showToast({
      icon: 'none',
      title: '请输入18位身份证号'
    })
    return
  }
  if (!agreeFlag.value) {
    uni.showToast({
      icon: 'none',
      title: '请同意平台使用实名信息'
    })
    return
  }
  if (isSubmit) {
    return false
  }
  isSubmit = true
  uni.showLoading({})
  try {
    const result = await service.identity.realNameCheck({ idCard: idCard.value, realName: realName.value })
    setTimeout(() => {
      isSubmit = false
      uni.hideLoading()
      if (from.value) {
        uni.redirectTo({
          url: '/pages/mine-identity/manager/index?unionId=' + unionId.value
        })
      } else {
        uni.redirectTo({
          url: '/pages/mine/identity/person-info?idCard=' + idCard.value + '&realName=' + realName.value
        })
      }
    }, 500)
  } catch (error) {
    isSubmit = false
  }

}
onLoad(options => {
  from.value = options.from || ''
  unionId.value = options.unionId || ''
})


</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
}

.border {
  border-bottom: 1rpx solid #F2F2F2;
}

.label-required {
  position: relative;
  display: inline-block;

  &:after {
    content: '*';
    color: #FF4536;
    position: absolute;
    right: -20rpx;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
