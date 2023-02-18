import { ref, watch } from 'vue'

export function vueSetupModelValueProxy <Props>(props: Props & { modelValue?: any }, emit: (...args: any[]) => any, defaultValue: any) {
  const value = ref(typeof props.modelValue === 'undefined' ? defaultValue : props.modelValue)
  watch(() => props.modelValue, (value) => {
    value.value = value
  })
  watch(() => value.value, (value) => {
    emit('update:modelValue', value)
  })
  return value
}

export default vueSetupModelValueProxy
