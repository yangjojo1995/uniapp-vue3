<template>
  <ym-cell
    :icon="props.icon"
    :label="props.label"
    :align="props.align"
    :padding="props.padding"
    :forward="true"
    :border="props.border"
    :required="props.required"
    @click="handleClick">
    <text :class="props.modelValue && props.modelValue.length>0? 'text-color-primary': ''" v-if="props.create">{{ getLabel(props.modelValue) || '请选择' }}</text>
    <text v-else>{{ getLabel(props.modelValue) || '去设置' }}</text>
  </ym-cell>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useService } from '@/plugins/app-core'

const service = useService()


const props = withDefaults(defineProps<{
  modelValue?:  string
  icon?: string
  label?: string
  placeholder?: string
  align?: 'left' | 'right'
  disabled?: boolean,
  padding?: boolean,
  border?: boolean,
  required?: boolean,
  create?:boolean
}>(), {
  create:false,
  modelValue: '',
  placeholder: '请选择',
  disabled: false,
  padding: true,
  border: true,
  required: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const list = ref(props.modelValue)

watch(() =>props.modelValue, (value) => {
  list.value = value || ''
})

const handleClick = (event: any) => {
  uni.$once('features-page/select-industry:industry', (data) => {
    list.value = data || ''
    emit('update:modelValue', list.value)
  })
  uni.navigateTo({
    url: '/pages/features-page/select-industry?value='+  list.value + '&required='+props.required
  })
}

// ====================================


let options:any = reactive([])

const getDictionaryFileds = async (code:any) => {
  const result = await service.app.getDictionary({dictCode: code})
  result.forEach((key:any) => {
    key.value = key.itemValue 
    key.label = key.itemName
  })
  options.push(...result)
}

const getLabel = (value:any) => {
  if (typeof(value) === 'string') {
    const option = options.find((key:any) =>key.itemValue === value)
    return option!= undefined  ? option.itemName : ''
  } else {
    if (value!=null) {
        const option = options.find((key:any) =>key.itemValue === value[0])
        return option!= undefined  ? option.itemName : ''
    }
    return ''
  }
   
}

onMounted(() => {
  getDictionaryFileds('industry_type')
})
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

.tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 156rpx;
  min-height: 80rpx;
  background: #F7F7F7;
  border-radius: 12rpx;
  font-size: 22rpx;
  font-weight: 400;
  margin: 10rpx;
  color: #333333;
  text-align: center;
  user-select: none;
  opacity: 1;
  background: #E7F8F2;
  color: #333333;
}
.fileds-wrap{
  position: fixed;
  top:0;
  left:0;
  bottom:0;
  right:0;
  z-index: 999;
  background-color: rgba(0,0,0,0.4);
}
.footer-btn-wrap{
  position:absolute;z-index: 999;bottom:0;left:0
}
</style>
