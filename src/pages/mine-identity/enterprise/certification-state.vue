<template>
  <view class="u-p-x-64 safe">
     <view class="text-center u-m-b-60">
        <image src="../../../assets/certification/wait.png" class="icon"></image>
        <view class="fs-36 text-color-primary u-p-t-44 u-p-b-30 bold">企业认证成功</view>
        <view class="fs-26 text-color-secondary">已完成认证，请登录PC端网站创建项目吧！</view>
        <view class="fs-26 text-color-secondary">www.gdxctm.cn</view>
     </view>  
      <view class="next-btn u-m-t-60 u-m-b-20" @click="copy">复制链接</view>
      <view class="next-btn text-color-primary back" @click="goMine">返回个人中心</view>
  </view>
</template>


<script lang="ts" setup>
const copy = () => {
  uni.setClipboardData({
    data: 'www.gdxctm.cn',
    success: function () {
		uni.showToast({
			title:'复制成功',
			icon:'none'
		})
    }
  })
}
const goMine = () => {
  uni.switchTab({
    url: '/pages/mine'
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