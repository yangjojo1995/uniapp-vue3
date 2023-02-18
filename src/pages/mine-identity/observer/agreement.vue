<template>
  <view class="page">
    <view class="agreement">
      <!-- <view class="agreement__title">《XXXX协议》</view> -->
      <view class="agreement__content" v-html="agreement"></view>
    </view>

    <view class="page-footer">
      <view class="page-footer-fixed">
        <button class="button" @click="toPage">签名</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import { useService } from '@/plugins/app-core'
const service = useService()

let agreement = ref('')
let unionId = ref('')

onLoad(async (props) => {
  unionId.value = props.unionId || ''
  const result = await service.commitment.get({ type: 4 })
  agreement.value = result.content
})

const toPage = function () {
  uni.redirectTo({
    url: '/pages/mine/signature/signature?unionId=' + unionId.value + '&from=observer'
  })
}
</script>

<style lang="scss">
.page {
  padding-top: 20rpx;
}

.agreement {
  padding: 30rpx;
  background-color: #fff;
  &__title {
    font-size: 40rpx;
    font-weight: 500;
    color: #333333;
    line-height: 40rpx;
    text-align: center;
    margin-bottom: 32rpx;
  }
  &__content {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 42rpx;
  }
}

.page-footer {
  $height: 146rpx;

  position: relative;
  width: 100%;
  height: $height;
  background: #FFFFFF;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  &-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: $height;
    background: #FFFFFF;
    z-index: 9999;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.button {
  max-width: 550rpx;
  display: block;
  width: 100%;
  height: 82rpx;
  background: $--ym-bg-primary;
  border-radius: 82rpx;
  border: none;
  padding: 0 34rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 82rpx;

  &::after {
    display: none;
  }

  &.button-hover {
    opacity: 0.8;
  }
}
</style>