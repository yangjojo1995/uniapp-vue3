<template>
  <view>
    <image src="../../../assets/mine/success.png" class="success-icon" />
    <view class="success-text">绑定成功</view>
    <view class="next-btn" @click="gohome">返回首页</view>
  </view>
</template>

<script setup lang="ts">
  const gohome = ()=> {
    uni.switchTab({ url: `/pages/index` })
  }
</script>

<style lang="scss" scoped>
  .success-icon {
    width: 160rpx;
    height: 160rpx;
    display: block;
    margin: 180rpx auto 40rpx;
  }
  .success-text {
    font-size: 36rpx;
    text-align: center;
    font-weight: bold;
  }
  .next-btn {
    margin-top: 110rpx;
  }
</style>
