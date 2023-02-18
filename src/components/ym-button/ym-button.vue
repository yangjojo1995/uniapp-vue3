<template>
  <button
    class="button"
    type="button"
    :loading="loading"
    :disabled="buttonDisabled"
    :class="[
      type ? 'ym-button--' + type : '',
      {
        'is-round': round,
        'is-loading': loading,
        'is-disabled': buttonDisabled
      }
    ]"
    :open-type="openType"
    :plain="plain"
    @click="emit('click', $event)"
    @getphonenumber="emit('getphonenumber', $event)">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults( defineProps<{
  type?: 'primary' | 'default' | 'warn'
  openType?: string
  plain?: boolean
  round?: boolean
  loading?: boolean
  disabled?: boolean
}>(),{
  type: 'primary',
  round: true,
  loading: false,
  disabled: false
})

const buttonDisabled = computed(() => {
  return props.disabled || props.loading
})

const emit = defineEmits<{
  /** 点击事件 */
  (e: 'click', event: Event): void
  /** getphonenumber 事件 */
  (e: 'getphonenumber', event: Event): void
}>()

</script>

<style lang="scss" scoped> 

.button {
  min-width: 200rpx;
  height: 82rpx;
  font-size: 32rpx;
  font-weight: 500;
  line-height: 40rpx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-width: 2rpx;
  border-color: transparent;

  &::before{
    margin-right: 16rpx;
  }
  
  &.is-round{
    border-radius: 320rpx;
  }

  &:active {
    opacity: 0.6;
  }

  &.is-disabled{
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.ym-button--primary{
    color: #FFFFFF;
    background: $--ym-bg-primary;
    
    &[plain] {
      background: none;
      color: $--ym-color-primary;
      border-color: $--ym-color-primary;
    }
  }

  &.ym-button--info{
    color: #FFFFFF;
    background: $--ym-bg-info;

    &[plain] {
      background: none;
      color: $--ym-color-info;
      border-color: $--ym-bg-info;
    }
  }

  &.ym-button--warning{
    color: #FFFFFF;
    background: $--ym-bg-warning;

    &[plain] {
      background: none;
      color: $--ym-color-warning;
      border-color: $--ym-bg-warning;
    }
  }

  &.ym-button--purple{
    color: #FFFFFF;
    background: $--ym-color-purple;

    &[plain] {
      background: none;
      color: $--ym-color-purple;
      border-color: $--ym-bg-purple;
    }
  }
}
</style>
