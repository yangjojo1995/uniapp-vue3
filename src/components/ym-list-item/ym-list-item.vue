<template>
  <view class="list-item" :class="classData" @click="handleClick">
    <view class="list-item__thumb" v-if="noThumb" :style="{width: imgWidth, height: imgHeight}">
      <image class="list-item-thumb-image" :src="thumb ? thumb : projectDefaultImg" :mode="thumbMode" :lazy-load="thumbLazyLoad"></image>
    </view>
    <view class="list-item__content list-item-content">
      <slot name="name">
        <view class="list-item-content__name">
          <text class="list-item-content-name">{{ name }}</text>
          <slot name="name-right"></slot>
        </view>
      </slot>
      <slot name="note">
        <view v-if="note" class="list-item-content__note">
          <text>{{ note }}</text>
        </view>
      </slot>
      <slot name="tag">
        <view v-if="tag || tags" class="list-item-content__tags">
          <text v-if="tag" class="list-item-content__tag">{{ tag }}</text>
          <text v-for="tag in tags" :key="tag" class="list-item-content__tag">{{
            tag
          }}</text>
        </view>
      </slot>
      <slot name="content">
        <view v-if="content" class="list-item-content__content">{{
          content
        }}</view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import projectDefaultImg from '@/assets/mine/project-default.png'

const props = withDefaults(defineProps<{
  thumb?: string
  name: string
  note?: string
  tag?: string
  tags?: string[]
  content?: string

  thumbType?: 'default' | 'avatar'
  thumbMode?: 'aspectFill' | 'aspectFit' | 'widthFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'
  thumbLazyLoad?: boolean
  thumbWidth?: number
  thumbHeight?: number
  contentLines?: number
  noteLines?: number
  tagType?: 'default' | 'info'
  clickable?: boolean
  noThumb?: boolean
  interval?: boolean
}>(), {
  thumbMode: 'aspectFit',
  thumbLazyLoad: true,
  clickable: false,
  noThumb: true,
  interval: false// 间隔样式
})

const emit = defineEmits<{
  /** 点击事件 */
  (e: 'click', event: Event): void
}>()

const classData = computed(() => {
  return {
    'list-item--clickable': props.clickable,
    'list-item--interval': props.interval,
    [`list-item--thumb-${props.thumbType}`]: props.thumbType,
    [`list-item--note-lines-${props.noteLines}`]: props.noteLines,
    [`list-item--content-lines-${props.contentLines}`]: props.contentLines,
    [`list-item--tag-${props.tagType}`]: props.tagType
  }
})

const imgWidth = computed(() => {
  if(props.thumbWidth){
    return props.thumbWidth + 'rpx'
  }else{
    if(props.thumbType === 'default'){
      return '168rpx;'
    }else{
      return '126rpx;'
    }
  }
})

const imgHeight = computed(() => {
  if(props.thumbHeight){
    return props.thumbHeight + 'rpx'
  }else{
    if(props.thumbType === 'default'){
      return '96rpx;'
    }else{
      return '126rpx;'
    }
  }
})

const handleClick = function (event: Event) {
  emit('click', event)
}
</script>

<style lang="scss" scoped>

  .list-item {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24rpx 32rpx;
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
    &.list-item--thumb-avatar {
      .list-item__thumb {
        flex-grow: 0;
        flex-shrink: 0;
        width: 126rpx;
        height: 126rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 24rpx;
      }
    }
    &.list-item--thumb-default {
      .list-item__thumb {
        flex-grow: 0;
        flex-shrink: 0;
        width: 168rpx;
        height: 94.5rpx;
        border-radius: 8rpx;
        overflow: hidden;
        margin-right: 24rpx;
      }
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
    &__tag {
      display: inline;
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      line-height: 40rpx;
      margin-bottom: 10rpx;
      margin-right: 10rpx;
      padding-right: 10rpx;
      border-right: 2rpx solid #c6c6c6;
      &:last-child {
        border-right: none;
        padding-right: 0;
      }
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

  .list-item-content-name {
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    line-height: 42rpx;
    margin-bottom: 4rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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

  .list-item--interval {
    margin: 24rpx 30rpx 0;
    border-radius: 12rpx;
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
