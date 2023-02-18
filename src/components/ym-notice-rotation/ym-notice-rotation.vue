<template>
  <view class="notice-rotation">
    <view v-if="icon" class="notice-rotation__icon">
      <image class="notice-rotation-icon" :src="icon" mode="aspectFit" />
    </view>
    <view class="notice-rotation__content">
      <swiper class="swiper" :autoplay="true" :interval="props.interval" :duration="props.duration" :circular="true" :vertical="true">
        <swiper-item v-for="item in list" :key="item.title" class="swiper-item">
          <view class="notice-bar" @click="emit('item-click', item, $event)">
            <text class="notice-bar__text">{{ item.title }}</text>
            <view class="ym-arrow-box">
              <view class="ym-arrow-icon"></view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
  icon?: string
  interval?: number
  duration?: number
  list?: { title?: string }[]
}>(), {
  interval: 3000,
  duration: 200,
  list: () => []
})

const emit = defineEmits<{
  (e: 'item-click', item: typeof props['list'][0], event: Event): void
}>()

</script>

<style lang="scss" scoped>
.notice-rotation {
  display: flex;
  align-items: flex-start;
  min-height: 70rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 22rpx 24rpx;
  &__icon {
    flex: 0 0 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70rpx;
    height: 70rpx;
    font-size: 30rpx;
    margin-right: 16rpx;
  }
  &__content {
    flex: 1 1 100%;
    display: flex;
    align-items: center;
    min-height: 70rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
  }
}

.notice-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  &__text {
    flex: 1 1 100%;
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
    line-height: 32rpx;
    line-height: 70rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__arrow {
    flex: 0 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70rpx;
    height: 70rpx;
  }
}

.swiper {
  width: 100%;
  height: 70rpx;
  overflow: hidden;
}

.notice-rotation-icon {
  width: 100%;
  height: 100%;
}

</style>
