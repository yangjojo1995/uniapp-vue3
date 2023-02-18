<template>
  <view class="list-card" >
    <view class="list-item" :class="classData" @click="handleClick">
      <view class="list-item__thumb">
        <image class="list-item-thumb-image" v-if="icon" :src="icon"></image>
        <image class="list-item-thumb-image" v-else :src="thumb ? assets(thumb) : projectDefaultImg" mode="aspectFit" :lazy-load="true"></image>
      </view>
      <view class="list-item__content list-item-content">
        <view class="list-item-content__name">
          <view class="list-item-content-name">
            <div class="name-text">{{ name }} </div>
            <view class="name-left">
              <slot name="name-left"></slot> 
            </view>
          </view>
          <slot name="name-right"></slot>
        </view>
        <slot name="content">
          <view v-if="content" class="list-item-content__content">{{ content }}</view>
        </slot>
      </view>
      <view class="list-item__right">
        <view class="ym-arrow-icon"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import projectDefaultImg from '@/assets/mine/project-default.png'
import assets from '@/utils/assets'
const props = withDefaults(defineProps<{
  icon?: string
  thumb?: string
  name?: string
  content?: string
  contentLines?: number
  clickable?: boolean
}>(), {
  clickable: true,
})

const classData = computed(() => {
  return {
    'list-item--clickable': props.clickable,
    [`list-item--content-lines-${props.contentLines}`]: props.contentLines,
  }
})

const emit = defineEmits<{
  /** 点击事件 */
  (e: 'click', event: Event): void
}>()

const handleClick = function (event: Event) {
  emit('click', event)
}
</script>

<style lang="scss" scoped>
  .list-card{
    width: 702rpx;
    background: #FFFFFF;
    border-radius: 12px;
    margin: 20rpx 24rpx;
  }

  .list-item {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24rpx;
    background: #ffffff;
    &::after {
      content: '';
      position: absolute;
      left: 32rpx;
      right: 32rpx;
      bottom: 0;
      height: 1rpx;
      background-color: #f2f2f2;
      z-index: 1;
    }
    :last-child > &:last-child::after {
      display: none;
    }

    .list-item__thumb {
      flex-grow: 0;
      flex-shrink: 0;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 24rpx;
    }

    &__content {
      flex: 1 1 auto;
      width: 100%;
    }
  }

  .list-item-content {
    align-self: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex: 1 1 auto;
    width: 100%;
    &__name {
      width: 100%;
      margin-bottom: 4rpx;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      word-break: break-all;
      white-space: pre-wrap;
    }

    &__note,
    &__content {
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      line-height: 36rpx;
      word-break: break-all;
      white-space: pre-wrap;
      margin-bottom: 4rpx;
    }
  }

  .list-item__right{
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    padding: 8rpx 0;
  }

  .list-item-content-name {
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    line-height: 42rpx;
    margin-bottom: 4rpx;
    display: flex;
    justify-content: flex-start;

    .name-text{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .name-left{
      flex-shrink: 0;
      flex-grow: 0;
      padding-left: 32rpx;
    }
  }

  .list-item-thumb-image {
    display: block;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
  }

  .list-item--clickable {
    cursor: pointer;
    &:active {
      background-color: #f1f1f1;
    }
  }


  .list-item--tag-info {
    .list-item-content__tag {
      display: inline-block;
      background: #f7f7f7;
      border: none;
      border-radius: 4rpx;
      font-size: 20rpx;
      font-weight: 400;
      color: #666666;
      line-height: 20rpx;
      padding: 6rpx 16rpx;
      margin-bottom: 10rpx;
      margin-right: 10rpx;
      word-break: break-word;
    }
  }

  @for $i from 1 through 5 {
    .list-item--note-lines-#{$i} .list-item-note__content,
    .list-item--content-lines-#{$i} .list-item-content__content {
      height: #{$i * 36rpx}rpx;
      line-height: #{$i * 36rpx}rpx;
      display: -webkit-box;
      -webkit-line-clamp: #{$i};
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-word;
      white-space: pre-wrap;
    }
  }
</style>
