<template>
  <view class="u-p-x-64 safe">
     <view class="text-center u-m-b-60">
        <image src="../../assets/certification/fail.png" class="icon"></image>
        <view class="fs-36 text-color-primary u-p-t-44 u-p-b-30 bold">审核不通过</view>
        <view class="fs-26 text-color-secondary">{{stateInfo.reason}}</view>
     </view>  

      <view class="next-btn u-m-t-60 u-m-b-20" @click="back">重新修改</view>
  </view>
</template>


<script lang="ts" setup>
 import {ref,reactive,computed} from 'vue'
import { onLoad,onShow } from "@dcloudio/uni-app";
import { router, useService, useConfig, useRouter, setToken, setUserInfo, serviceKey } from '@/plugins/app-core'
const from = ref('')
const unionId = ref('')
const service = useService()

let stateInfo:any = reactive({})


const getStateOrganization  = async () => {
  const result = await service.certification.getOrganizationId()
  stateInfo = Object.assign(stateInfo, result)
}
const getStateObserver = async () => {
  const result = await service.certification.getObserverId()
  stateInfo = Object.assign(stateInfo, result)
}
const getStateEnterPrise  = async () => {
  const result = await service.certification.getEnterpriseId()
  stateInfo = Object.assign(stateInfo, result)
}
const back = () => {
  if(from.value === 'organization') {
    uni.redirectTo({
      url: '/pages/mine-identity/organization/index?unionId=' + unionId.value
    })
  } else if (from.value === 'enterprise') {
    uni.redirectTo({
      url: '/pages/mine-identity/enterprise/index?unionId=' + unionId.value
    })
  } else {
    uni.redirectTo({
      url: '/pages/mine-identity/observer/index?unionId=' + unionId.value
    })
  }
 
}

onLoad(async (options:any) => {
  from.value = options.from
  unionId.value = options.unionId
  if(from.value === 'organization') {
    await getStateOrganization()
  } else if (from.value === 'enterprise') {
    await getStateEnterPrise()
  } else {
    await getStateObserver()
  }
})
</script>

<style lang="scss" scoped>
.wrap{
  border-radius: 12rpx;
}
.icon{
  width: 160rpx;
  height:160rpx;
  margin: 124rpx auto 0;
}
.theme-color{
  color:#12C287;
  image{
    width:24rpx;
    height:24rpx;
    margin-right: 8rpx;
  }
}
.default-color{
  color:#0076FF;
   image{
    width:24rpx;
    height:24rpx;
    margin-right: 8rpx;
  }
}
.text-center{
  text-align: center;
}
.back{
  background: #FFFFFF;
  border-radius: 50px;
  border: 1rpx solid #E9E9E9;
  box-shadow: none!important;
 
}
</style>