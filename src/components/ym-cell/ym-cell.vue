<template>
  <view class="cell" :class="classData" @click="handleClick">
    <view v-if="props.label" class="cell__label" :style="labelStyleData">
      <slot name="label">{{ props.label }}</slot>
      <text v-if="required" class="required"> * </text>
    </view>
    <view class="cell__content word-break">
      <slot>{{ props.content }}</slot>
    </view>
    <view v-if="props.forward" class="cell__forward">
      <image src="../../assets/mine/arrow.png" class="arrow"></image>
    </view>
  </view>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'

const cellGroup = inject('cellGroup') as any

const props = withDefaults(defineProps<{
  icon?: string
  label?: string
  content?: string
  placeholder?: string
  align?: 'top' | 'left' | 'right'
  to?: string,
  forward?: boolean
  labelWidth?: string
  padding?: boolean,
  border?: boolean,
  required?:boolean
}>(), {
  padding: true,
  border: true,
  required:false
})

const emit = defineEmits<{
  (e: 'click', event: any): void
}>()


let index = ref(0)
const classData = computed(() => {
  return {
    [`cell--align-${props.align}`]: props.align,
    'cell--forward': props.forward,
    'cell--no-border': !props.border,
    'cell--no-padding': !props.padding,
    'required':props.required
  }
})

const labelStyleData = computed(() => {
  const labelWidth = props?.labelWidth || cellGroup?.props?.labelWidth
  if (!labelWidth) return
  return {
    width: labelWidth,
    flex: `0 0 ${labelWidth}`
  }
})

const handleClick = (event: any) => {
  if (props.to) {
    return uni.navigateTo({ url: props.to })
  }
  emit('click', event)
}

</script>

<style lang="scss" scoped>
.cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 124rpx;
  background-color: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
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
  &__icon {
    flex: 0 0 32px;
    width: 32rpx;
    height: 32rpx;
    margin-right: 32rpx;
    background: #F7F7F7;
  }
  &__label {
    flex: 0 0 240rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;
    line-height: 32rpx;
  }
  &__content {
    flex: 0 1 auto;
    width: 100%;
    font-size: 28rpx;
    font-weight: 400;
    color: #999999;
    line-height: 32rpx;
  }
  &__forward {
    flex: 0 0 24rpx;
    width: 24rpx;
    height: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 16rpx;
  }
  .required{
    color:red;
    font-size:28rpx;
  }
}

.cell {
  &--align-right {
    .cell__content {
      text-align: right;
    }
  }

  &--align-top {
    display: block;
    .cell__label {
      text-align: left;
      padding: 48rpx 0;
      border-bottom: 1px solid #ECE7E3;
    }
    .cell__content {
      text-align: left;
    }
  }

  &--forward {
    cursor: pointer;
  }

  &--no-border {
    &::after {
      display: none;
    }
  }
  
  &--no-padding {
    padding: 0;
    &::after {
      left: 30rpx;
      right: 30rpx;
    }
  }
}

/* 2000-09-21 变更：要求全部表单的必填型号转为label的右侧且紧贴文字
.required{
  position: relative;
  &:before{
    content: '*';
    width:10rpx;
    height:36rpx;
    position: absolute;
    top:50%;
    left:-20rpx;
    line-height: 36rpx;
    transform: translateY(-50%);
    text-align: center;
    color:red;
    font-size:28rpx;
  }
} */

</style>
