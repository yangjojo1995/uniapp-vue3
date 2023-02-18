<template>
  <ym-cell
    :icon="props.icon"
    :label="props.label"
    :align="props.align"
    :padding="props.padding"
    :forward="true"
    :border="props.border"
    @click="handleClick">
    <text>{{ loaction ? loaction.address : placeholder }}</text>
  </ym-cell>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Loaction {
  address: string
}

const props = withDefaults(defineProps<{
  modelValue?: Loaction
  icon?: string
  label?: string
  placeholder?: string
  align?: 'left' | 'right'
  disabled?: boolean,
  padding?: boolean,
  border?: boolean
}>(), {
  placeholder: '请选择',
  disabled: false,
  padding: true,
  border: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const loaction = computed({
  get (): Loaction | undefined {
    return props.modelValue
  },
  set (value: Loaction | undefined) {
    emit('update:modelValue', value)
  }
})

const handleClick = (event: any) => {
  uni.authorize({
    scope: 'scope.userLocation',
    success: () => {
      uni.chooseLocation({
        success: async (res) => {
          emit('update:modelValue', res)       
        }
      })
    },
    fail: () => {
      uni.showModal({
        title: '授权提示',
        content: '需要同意小程序使用地理定位',
        success: () => {
          uni.openSetting({})
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>

.cell-content-input {
  display: block;
  font-size: 28rpx;
  font-weight: 400;
  width: 100%;
  color: #333333;
  &:focus {
    outline: none;
    text-align: left;
  }
}
</style>
