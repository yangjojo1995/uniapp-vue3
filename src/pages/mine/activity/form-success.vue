<template>
  <view class="u-p-x-64 safe">
     <view class="text-center u-m-b-60">
        <image src="../../../assets/activity/success.png" class="icon"></image>
        <view class="fs-36 text-color-primary u-p-t-44 u-p-b-30 bold">提交成功</view>
        <view class="fs-26 text-color-secondary"> </view>
     </view>  
      <view class="next-btn u-m-t-60 u-m-b-20" @click="goHomePage">返回首页</view>
      <view class="next-btn text-color-primary back" @click="goManage">返回活动管理</view>
  </view>
</template>

<script lang="ts" setup>
const goHomePage = () => {
  uni.switchTab({
    url: '/pages/index'
  })
}
const goManage = () => {
  uni.reLaunch({
    url: './activity-manage'
  })
}
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