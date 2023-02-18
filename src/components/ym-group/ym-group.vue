<template>
  <view class="group word-break" :class="classData" :style="{'background-color': transparent ? 'transparent':'#ffffff'}">
    <view v-if="title || $slots.title" class="group__header group-header" >
      <view class="group-header__inner">
        <slot name="title">
          <text>{{ title }}</text>
        </slot>
      </view>
      <view v-if="headerRightText" class="group-header__right"
            :class="{more: headerRightText && headerRightText==='查看更多'}"
            @click="emit('header-right-click', $event)">
            {{ headerRightText }}
            <view v-if="headerRightText && headerRightText==='查看更多'" class="ym-arrow-box">
              <view class="ym-arrow-icon"></view>
            </view>
      </view>
    </view>
    <view v-if="$slots.default" class="group__container" :style="containerStype">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  title?: string
  type?: 'default' | 'info'
  transparent?: boolean;
  headerRightText?: string,
  containerPadding?: number
}>(), {
  transparent: false
})

const emit = defineEmits<{
  (e: 'header-right-click', event: any): void
}>()

const classData = computed(() => {
  return {
    [`group--type-${props.type}`]: props.type
  }
})

const containerStype = computed(() => {
  if (typeof props.containerPadding === 'undefined') return {}
  return {
    padding: `${props.containerPadding}rpx`
  }
})
</script>

<style lang="scss" scoped>
.group {
  box-sizing: border-box;
  &__header {
    padding: 24rpx 32rpx;
    // &:last-child {
    //   padding-bottom: 24rpx;
    // }
  }
  &__container {
    padding: 24rpx 32rpx;
  }
}

.group-header {
  display: flex;
  align-items: center;
  &::before {
    content: '';
    flex: 0 0 8rpx;
    display: block;
    width: 8rpx;
    height: 35rpx;
    background: $--ym-color-primary;
    border-radius: 4rpx;
    margin-right: 12rpx;
  }
  &__inner {
    flex: 2 1 50%;
    width: 50%;
    display: flex;
    font-size: 36rpx;
    font-weight: 600;
    color: #333333;
    line-height: 36rpx;
  }
  &__right {
    flex: 1 1 1rpx;
    width: 1rpx;
    text-align: right;
    font-size: 24rpx;
    font-weight: 400;
    color: #999;
    line-height: 32rpx;
    &.more{
    flex: 1 1 42rpx;
    display: flex;
    align-items: center;
    margin-right: -12rpx;
     }
  }
}

.group--type-info {
  margin-bottom: 20rpx;

  .group__header {
    padding: 32rpx 32rpx 0;
    &:last-child {
      padding-bottom: 32rpx;
    }
  }
  .group__container {
    padding: 32rpx 32rpx;
  }

  .group-header {
    &__inner {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
      line-height: 40rpx;
    }
    &::before {
      display: none;
    }
  }
}
</style>
