<template>
  <view class="bg-white collsage" :class="nopadding ? '' : 'u-m-p'">
    <view class="flex collsage-title"  @click="toggleShow">
      <view
      class="text-color-primary fs-26 bold flex-1"
      :class="smTitle ? 'sm-title' : ''"
      v-if="title"
      >{{ title }}</view>
      <view
        class="toggle">
        <image
          class="arrow-down"
          :class="expandDefault ? 'up' : ''"
          src="../../assets/mine/arrow-down.png"
        />
      </view>
    </view>

    <view :class="expandDefault ? 'autoheight' : 'maxheight'">
      <view class="introduce-desc text-color-secondary fs-24">
        <view v-html="contentHtml"></view>
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps<{
    title?: String
    content?: any
    showExpand?: {type:'Boolean', default: true}
    nopadding?: Boolean
    smTitle?: Boolean
  }>()
const contentHtml = computed(() =>
  props.content ? props.content.replace(/\n/g, '<br/>') : ''
)
const expandDefault = ref(true)
const toggleShow = () => {
  expandDefault.value = !expandDefault.value
}
</script>

<style lang="scss" scoped>
  .collsage {
    padding-top: 26rpx;
    border-radius: 12rpx;
  }
  .collsage-title{
    padding: 23rpx;
    background: #E5F6EA;
    border-radius: 12rpx;
  }
  .u-m-p {
    margin-bottom: 20rpx;
    margin-top: 25rpx;
  }
  .arrow-down {
    width: 22rpx;
    height: 22rpx;
    margin-left: 10rpx;
  }
  .introduce-desc {
    padding: 10rpx 23rpx 0;
    line-height: 40rpx;
    word-break: break-all;
    text-align: justify;
  }
  .expand {
    border-top: 1rpx solid #f2f2f2;
  }
  .bold {
    font-weight: bold;
  }
  .up {
    transform: rotate(180deg);
    transition: 0.2s;
  }
  .maxheight {
    max-height: 0;
    height: 0;
    transition: 0.2s;
    overflow: hidden;
  }
  .autoheight{
    transition: 0.2s;
  }
  .sm-title {
    font-size: 28rpx;
  }
  .toggle {
    // padding-top: 16rpx;
  }
</style>
