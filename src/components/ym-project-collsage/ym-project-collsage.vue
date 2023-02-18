<template>
  <view class="bg-white collsage" :class="nopadding ? '' : 'u-m-p'">
    <view
      class="text-color-primary fs-32 bold u-p-b-20"
      :class="smTitle ? 'sm-title' : ''"
      v-if="title"
      >{{ title }}</view
    >
    <view
      class="introduce-desc text-color-secondary fs-24"
      v-html="contentHtml"
      :class="expandDefault ? '' : 'maxheight'"
    ></view>
    <view
      class="fs-26 text-color-primary flex ai-center jc-end toggle"
      v-if="showExpand && content && content.length > 200"
    >
      <view @click="toggleShow">{{
        expandDefault ? '收起信息' : '展开完整信息'
      }}</view>
      <image
        class="arrow-down"
        :class="expandDefault ? 'up' : ''"
        src="../../assets/mine/arrow-down.png"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps<{
    title?: String
    content: any
    showExpand: Boolean
    nopadding: Boolean
    smTitle: Boolean
  }>()
const contentHtml = computed(() =>
  props.content ? props.content.replace(/\n/g, '<br/>') : ''
)
const expandDefault = ref(false)
const toggleShow = () => {
  expandDefault.value = !expandDefault.value
}
</script>

<style lang="scss" scoped>
  .collsage {
    padding-top: 26rpx;
    border-radius: 12rpx;
  }
  .u-m-p {
    margin-left: 24rpx;
    margin-right: 24rpx;
    padding-left: 24rpx;
    padding-right: 24rpx;
    padding-bottom: 26rpx;
    margin-bottom: 20rpx;
  }
  .arrow-down {
    width: 22rpx;
    height: 22rpx;
    margin-left: 10rpx;
  }
  .introduce-desc {
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
    max-height: 200rpx;
    overflow: hidden;
  }
  .sm-title {
    font-size: 28rpx;
  }
  .toggle {
    padding-top: 16rpx;
  }
</style>
