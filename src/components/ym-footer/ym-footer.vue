<template>
  <view class="footer-btn-wrap flex-center">
    <view class="footer-btn-inner flex-center">
      <slot></slot>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.footer-btn-wrap{
  position: fixed;
  bottom:0;
  left:0;
  z-index: 999;
  height: auto;
  box-shadow: 0 -2px 12px #ddd;

  ::v-deep.footer-btn-inner{
    padding: 20rpx 32rpx;
    width: 100%;
  }

}

</style>
