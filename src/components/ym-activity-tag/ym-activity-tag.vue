<template>
  <view class="activity-tag">
    <view class="activity-group-img-tag blue" v-if="status==='progress'" :style="{transform: 'translateY(' + y +'rpx)'}">
      <image :src="progressImg"></image><text>进行中</text>
    </view>

    <view class="activity-group-img-tag red" v-if="status==='end'" :style="{transform: 'translateY(' + y +'rpx)'}">
      <image :src="endImg"></image><text>已结束</text>
    </view>

    <view class="activity-group-img-tag red" v-if="status==='down'" :style="{transform: 'translateY(' + y +'rpx)'}">
      <image :src="endImg"></image><text>已下架</text>
    </view>

    <view class="activity-group-img-tag green" v-if="status==='apply'" :style="{transform: 'translateY(' + y +'rpx)'}">
      <image :src="applyImg"></image><text>报名中</text>
    </view>
    <view class="activity-group-img-tag orange" v-if="status==='pre-publish'" :style="{transform: 'translateY(' + y +'rpx)'}">
      <image :src="applyImg"></image><text>预发布</text>
    </view>


  </view>
</template>

<script setup lang="ts">
import progressImg from '@/assets/activity/progress.png'
import endImg from '@/assets/activity/end.png'
import applyImg from '@/assets/activity/apply.png'

const props = withDefaults( defineProps<{
  status?: string,
  y?: number
}>(),{
  y: 0
})

</script>

<style lang="scss" scoped>
.activity-tag{
  position: relative;
}
.activity-group-img-tag{
  width: 130rpx;
  height: 50rpx;
  border-radius: 100px 0px 0px 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  bottom: 32rpx;
  position: absolute;

  &.blue{
    background: #0F6AFF;
    color: #FFFFFF;
  }

  &.red{
    background: #FF5744;
    color: #FFFFFF;
  }

  &.green{
    background: #00CF74;
    color: #FFFFFF;
  }
  &.orange{
    background: orange;
    color: #FFFFFF;
  }

  image {
    width: 24rpx;
    height: 26rpx;
    object-fit: contain;
  }

  text {
    font-size: 24rpx;
    transform: scale(0.9);
    font-weight: 400;
  }
}
</style>
