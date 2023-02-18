<template>
  <ym-cell
    :icon="props.icon"
    :label="props.label"
    :align="props.align"
    :padding="props.padding"
    :border="props.border">
    <textarea v-model="value" class="cell-content-textarea" :disabled="props.disabled" :placeholder="placeholder" :maxlength="50" :border="false" />
  </ym-cell>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  icon?: string
  label?: string
  placeholder?: string
  align?: 'top' | 'left'
  disabled?: boolean,
  padding?: boolean,
  border?: boolean
}>(), {
  placeholder: '请输入',
  disabled: false,
  padding: true,
  border: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const value = computed({
  get(): string {
    return props.modelValue || ''
  },
  set(value: string) {
    emit('update:modelValue', value)
  }
})
</script>

<style lang="scss" scoped>

.cell-content-textarea {
  display: block;
  font-size: 28rpx;
  font-weight: 400;
  width: 100%;
  color: #333333;
  padding: 20rpx 0;
  line-height: 1.4;
  &:focus {
    outline: none;
    text-align: left;
  }
}


</style>
