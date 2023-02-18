<template>
  <ym-cell
    :icon="props.icon"
    :label="props.label"
    :align="props.align"
    :required="required"
    :forward="true"
    :padding="props.padding"
    :border="props.border" @click="goUpdate">
    <text>{{value || '去设置'}}</text>
  </ym-cell>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  icon?: string
  label?: string
  placeholder?: string
  align?: 'left' | 'right'
  disabled?: boolean,
  padding?: boolean,
  border?: boolean,
  maxlength?:number|string,
  ruleType?: 'text' | 'email' | 'phone'| 'tel'| 'telOrphone',
  url?: string,
  required?: boolean
}>(), {
  placeholder: '请输入',
  disabled: false,
  padding: true,
  border: true,
  ruleType: 'text',
  url: '/pages/features-page/inputUpdate',
  maxlength: 50,
  align: 'right',
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const value = computed({
  get (): string {
    return props.modelValue || ''
  },
  set (value: string) {
    emit('update:modelValue', value)
  }
})

const goUpdate = () => {
  uni.$once('features-page:updateInput', async (value) => {
    console.log(value)
    emit('update:modelValue', value)
  })
  uni.navigateTo({
    url: `${props.url}?label=${props.label}&value=${props.modelValue || ''}&maxlength=${props.maxlength}&ruleType=${props.ruleType}&required=${props.required ? props.required : ''}`
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
