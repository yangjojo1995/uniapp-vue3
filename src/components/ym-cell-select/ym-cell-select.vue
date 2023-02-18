<template>
  <picker
    mode="multiSelector"
    :range="props.options"
    :value="rangeValue"
    :disabled="props.disabled"
    @columnchange="columnchange"
    @change="bindPickerChange"
  >
    <ym-cell
      :icon="props.icon"
      :label="props.label"
      :align="props.align"
      :forward="true"
      :padding="props.padding"
      :border="props.border"
    >
      <view>{{ value || props.placeholder }}</view>
    </ym-cell>
  </picker>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue'
  const leftValue = [
    '0',
    '500万',
    '1000万',
    '2000万',
    '3000万',
    '5000万',
    '1亿',
    '2亿',
    '5亿',
    '10亿',
    '20亿',
    '30亿',
    '50亿',
    '100亿',
    '200亿',
  ]
  const rightValue = [
    '500万',
    '1000万',
    '2000万',
    '3000万',
    '5000万',
    '1亿',
    '2亿',
    '5亿',
    '10亿',
    '20亿',
    '30亿',
    '50亿',
    '100亿',
    '200亿',
    '以上',
  ]
  const range: any = reactive([leftValue, rightValue])
  const props = withDefaults(
    defineProps<{
      modelValue?: string
      options: { [key: string]: any }[]
      icon?: string
      label?: string
      placeholder?: string
      align?: 'left' | 'right'
      disabled?: boolean
      padding?: boolean
      border?: boolean
      labelKey?: string
      valueKey?: string
    }>(),
    {
      options: () => {
        return [
          [
            '0',
            '500万',
            '1000万',
            '2000万',
            '3000万',
            '5000万',
            '1亿',
            '2亿',
            '5亿',
            '10亿',
            '20亿',
            '30亿',
            '50亿',
            '100亿',
            '200亿',
          ],
          [
            '500万',
            '1000万',
            '2000万',
            '3000万',
            '5000万',
            '1亿',
            '2亿',
            '5亿',
            '10亿',
            '20亿',
            '30亿',
            '50亿',
            '100亿',
            '200亿',
            '以上',
          ],
        ]
      },
      labelKey: 'label',
      valueKey: 'value',
      placeholder: '请选择',
      disabled: false,
      padding: true,
      border: true,
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', event: any): void
  }>()
  const value = computed({
    get(): string {
      return props.modelValue || ''
    },
    set(value: string) {
      emit('update:modelValue', value)
    },
  })

  const rangeValue: any = reactive([5, 5])

  const columnchange = (e: any) => {
    if (e.detail.column === 0) {
      rangeValue[0] = e.detail.value
      if (e.detail.value > rangeValue[1]) {
        rangeValue[1] = e.detail.value
      }
    } else {
      rangeValue[1] = e.detail.value
      if (rangeValue[0] > e.detail.value) {
        rangeValue[0] = e.detail.value
      }
    }
  }
  const bindPickerChange = () => {
    value.value = leftValue[rangeValue[0]] + '~' + rightValue[rangeValue[1]]
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
