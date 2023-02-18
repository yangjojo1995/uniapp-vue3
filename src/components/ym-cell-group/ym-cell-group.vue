<template>
  <view class="cell-group" :class="classData">
    <view v-if="title" class="cell-group__title">{{ title }}</view>
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

const props = withDefaults(defineProps<{
  title?: string,
  labelWidth?: string
}>(), {
})

const classData = computed(() => {
  return {}
})

const cellList: any[] = []
const mountCell = function (cell: any) {
  return cellList.push(cell)
}
const unmountCell = function (cell: any) {
  cellList.splice(cellList.indexOf(cell), 1)
}
const isLastCell = function (cell: any) {
  return cellList[cellList.length - 1] === cell
}

provide('cellGroup', { props, cellList, mountCell, unmountCell, isLastCell })

</script>

<style lang="scss" scoped>
.cell-group {
  background-color: #fff;
  margin-bottom: 20rpx;
  &__title {
    position: relative;
    font-size: 36rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 36rpx;
    padding: 42rpx 30rpx;
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 8rpx;
      height: 35rpx;
      background: #12C287;
      border-radius: 4rpx;
      margin: auto 0;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 30rpx;
      right: 30rpx;
      height: 1px;
      margin: auto;
      background-color: #ECE7E3;
    }
  }
}
</style>
