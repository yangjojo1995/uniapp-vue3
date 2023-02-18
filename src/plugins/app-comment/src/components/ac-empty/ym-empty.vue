<template>
  <view class="no-data-wrap">
    <image :src="icon" class="build-image no-data"/>
    <view class="fs-24 text-color-secondary">{{title}}</view>
  </view>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'

const images = import.meta.globEager('./images/*.png')

const props = withDefaults(defineProps<{
  // 标题
  title?: string,
  type?: string

}>(), {
  type: 'data', // activity data dev message search dev
  title: '暂无数据'
})

const icon = computed(() => {
  return images[`./images/empty-${props.type}.png`]?.default || ''
})

</script>

<style lang="scss" scoped>
.no-data-wrap{
  height:100%;
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  .no-content{
    width:140rpx;
    height:140rpx;
    margin-bottom:20rpx;
  }
}

.build-image {
  display: block;
  width: 360rpx;
  height: 331rpx;
  margin: 87rpx auto 60rpx;
}
</style>