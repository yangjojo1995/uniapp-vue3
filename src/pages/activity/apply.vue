<template>
<view class="u-p-x-32 u-p-t-20 u-p-b-80">
  <view class="content u-p-x-32 bg-white u-p-b-80">
    <view class="text-color-primary fs-32 bold text-center u-p-t-40 word-break">{{activityName}}报名表</view>
    <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold  input-label label-required">姓名</view>
      <view class="u-p-y-24">
        <input placeholder="请输入姓名" class="fs-24" :maxlength="25" v-model="participantName"
          @change="getValue($event, participantName)" />
      </view>
    </view>
    <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold input-label label-required">手机号</view>
      <view class="u-p-y-24">
        <input type="number" placeholder="请输入手机号" class="fs-24" :maxlength="11" v-model="mobile"
          @change="getValue($event, mobile)" />
      </view>
    </view>
     <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold input-label label-required">报名人数（人）</view>
      <view class="u-p-y-24">
        <input type="number" placeholder="请输入报名人数" class="fs-24" :maxlength="5" v-model="participantNum"
          @change="getValue($event, participantNum)" />
      </view>
    </view>
     <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold input-label label-required">机构类型</view>
      <view class="u-p-y-24 flex">
        <picker class="flex-1"  mode="selector" @change="getNature($event)" :range="natureList" range-key="itemName">
          <view class="flex ai-center jc-between">
            <view class="action-value u-p-r-30 fs-24" :class="institutionType? 'text-color-primary': 'text-color-third'">{{institutionType?institutionTypeName:'请选择'}}</view>
            <image src="../../assets/mine/arrow-down.png" class="arrow-down"></image>
          </view>
        </picker>
      </view>
    </view>
     <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold input-label">所在的企业/机构名称</view>
      <view class="u-p-y-24">
        <input placeholder="请输入所在的企业/机构名称" class="fs-24" :maxlength="50" v-model="institutionName"
          @change="getValue($event, institutionName)" />
      </view>
    </view>
     <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold input-label label-required">在企业/机构所任职位</view>
      <view class="u-p-y-24">
        <input  placeholder="请输入你的职位" class="fs-24" :maxlength="15" v-model="position"
          @change="getValue($event, position)" />
      </view>
    </view>
    <view class="next-btn u-m-t-40" @tap="check">提交报名</view>
  </view>
  </view>
</template>

<script setup lang="ts">

import { ref, reactive, computed } from 'vue'
import { onPullDownRefresh, onReachBottom, onLoad } from "@dcloudio/uni-app";
import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
import { isPhone } from '@/utils/regex';

// 变量控制重复点击
let isSubmit = false
const participantName = ref('')
const mobile = ref('')
const position = ref('')
const participantNum = ref('')
const institutionType = ref('')
const institutionName = ref('')
const activityId = ref('')
const activityName = ref('')
const natureList:any = reactive([])
const institutionTypeName = ref('')
const service = useService()



const getValue = (e: any, propKey: any) => {
  propKey = e
}
const getNature = (e:any) => {
  institutionType.value = natureList[e.detail.value].itemValue
  institutionTypeName.value = natureList[e.detail.value].itemName
}

const check = async () => {
  if (participantName.value === ''  ||participantName.value === null || participantName.value === undefined) {
    uni.showToast({
      icon: 'none',
      title: '请输入姓名'
    })
    return
  }
  if (mobile.value === ''  ||mobile.value === null || mobile.value === undefined) {
    uni.showToast({
      icon: 'none',
      title: '请输入11位手机号'
    })
    return
  } else {
    if (!isPhone(mobile.value)) {
     uni.showToast({
        icon: 'none',
        title: '请输入合法的11位手机号'
      })
      return
    }
  }
   if (participantNum.value === '' ||participantNum.value === null || participantNum.value === undefined) {
    uni.showToast({
      icon: 'none',
      title: '请输入报名人数'
    })
    return
  }
   if (institutionType.value === '' || institutionType.value === null || institutionType.value === undefined) {
    uni.showToast({
      icon: 'none',
      title: '请选择机构类型'
    })
    return
  }
   if (position.value === '' ||position.value === null || position.value === undefined) {
    uni.showToast({
      icon: 'none',
      title: '请输入职位'
    })
    return
  }
 
  if (isSubmit) {
    return false
  }
  isSubmit = true
  uni.showLoading({})
  try {
    const result = await service.active.applyActive({ 
      participantName: participantName.value, 
      mobile: mobile.value ,
      position: position.value ,
      participantNum: participantNum.value ,
      institutionType: institutionType.value ,
      institutionName: institutionName.value ,
      activityId:activityId.value
    })
    setTimeout(() => {
      isSubmit = false
      uni.hideLoading()
      uni.navigateBack({
        delta:1
      })
    }, 500)
  } catch (error) {
    isSubmit = false
  }

}

const getDictionary = async (code:any) => {
  const result = await service.app.getDictionary({dictCode: code})
  natureList.push(...result)
}
onLoad(options => {
  activityId.value = options.activityId || ''
  activityName.value = options.activityName || ''
  getDictionary('activity_institution_type')
})


</script>

<style lang="scss" scoped>
.content {
  border-radius: 12rpx;
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
.action-value{
  max-width: 520rpx;
  min-width: 520rpx;
  word-break: break-all;
  font-family: PingFangSC-Regular, PingFang SC;
}
.arrow-down{
  width: 24rpx;
  height:24rpx;
  min-width: 24rpx;
}
</style>
