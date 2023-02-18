<template>
  <!-- 顶部栏 -->
  <view :style="{paddingTop: paddingTop, background: background, boxShadow: boxShadow }" class="navigation__top" >
    <view class="header"  :style="{'height': headerHeight+'px', 'line-height': headerHeight+'px' }">
      <view class="header-title">{{title}}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  placeholder?: boolean,
  alpha?: number
}>(), {
  title: '首页',
  placeholder: false,
  alpha: 0
})

let statusBar = ref(uni.getStorageSync('statusBar'))
let menButton = ref(JSON.parse(uni.getStorageSync('menButton')))
let paddingTop = ref(statusBar.value+ 'px')

const background = computed(() => {
  return `rgba(255, 255, 255, ${(props.alpha/100)})`
})

const boxShadow = computed(() => {
  return `0 0 16rpx 0 rgb(210 210 210 / ${(props.alpha/100)})`
})

const headerHeight = computed(() => {
  return menButton.value.height + (menButton.value.top - statusBar.value) * 2
})

</script>
<style scoped>

.navigation__top{
  width: 100%;
  z-index: 10000;
  position: sticky;
  box-shadow: 0 -1px #FFFFFF;
  top: 0;
}
.header {
  position: relative;
  display: flex;
  text-align: center;
  font-size: 32rpx;
  align-items:  center;
}
.leftArrow {
  position: absolute;
  width: 60rpx;
  height: 48rpx;
  line-height: 48rpx;
}
.header-title {
  flex: 1;
}
</style>