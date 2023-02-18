<template>
  <view class="u-p-x-64 safe">
     <view class="text-center u-m-b-60">
        <image src="../../assets/mine/success.png" class="icon"></image>
        <view class="fs-36 text-color-primary u-p-t-44 u-p-b-30 bold">发送申请成功</view>
        <view v-if="type==='bp'" class="fs-26 text-color-secondary">已发送申请查看BP申请，请等待项目发布方审核授权</view>
        <view v-else class="fs-26 text-color-secondary">已发送申请查看财务状况申请，请等待项目发布方审核授权</view>
     </view>
      <view class="next-btn u-m-t-60 u-m-b-20" @click="goApplyList">点击查看申请列表</view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@/utils/commonUse'
import { ref } from 'vue'
const id = ref('')
const type = ref('bp')

const goApplyList = () => {
  uni.redirectTo({
    url: '/pages/application/list'
  })
}
onLoad((options:any) => {
  id.value = options.id || ''
  type.value = options.type || 'bp'
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
