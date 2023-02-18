<template>
	<view>
    <view class="ym-tag" :class="[type ? 'ym-tag--' + type : '']">
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  type?: 'primary' | 'info' | 'warning' | 'purple' | 'blue' | 'yellow'
}>(), {
  type: 'primary'
})

const emit = defineEmits<{
  /** 点击事件 */
  (e: 'click', event: Event): void
}>()

</script>

<style scoped lang="scss">
.ym-tag{
  min-width: 80rpx;
  max-width: 160rpx;
  width: fit-content;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 8rpx;
  height: 36rpx;
  border-radius: 36rpx;
  font-size: 22rpx;
  font-weight: 400;
  line-height: 36rpx;
  text-align: center;

  &.ym-tag--primary{
    color: $--ym-color-primary;
    background: rgba($color: $--ym-color-primary, $alpha: 0.1);
    border: 1px solid rgba($color: $--ym-color-primary, $alpha: 0.3);
  }

  &.ym-tag--info{
    color: $--ym-color-info;
    background: rgba($color: $--ym-color-info, $alpha: 0.1);
    border: 1px solid rgba($color: $--ym-color-info, $alpha: 0.3);
  }

  &.ym-tag--warning{
    color: $--ym-color-warning;
    background: rgba($color: $--ym-color-warning, $alpha: 0.1);
    border: 1px solid rgba($color: $--ym-color-warning, $alpha: 0.3);
  }

  &.ym-tag--purple{
    color: $--ym-color-purple;
    background: rgba($color: $--ym-color-purple, $alpha: 0.1);
    border: 1px solid rgba($color: $--ym-color-purple, $alpha: 0.3);
  }

  &.ym-tag--blue{
    color: $--ym-color-blue;
    background: rgba($color: $--ym-color-blue, $alpha: 0.1);
    border: 1px solid rgba($color: $--ym-color-blue, $alpha: 0.3);
  }

  &.ym-tag--yellow{
    color: $--ym-color-yellow;
    background: rgba($color: $--ym-color-yellow, $alpha: 0.1);
    border: 1px solid rgba($color: $--ym-color-yellow, $alpha: 0.3);
  }
}
</style>
