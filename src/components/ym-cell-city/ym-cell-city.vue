<template>
  <ym-cell
    :icon="props.icon"
    :label="props.label"
    :align="props.align"
    :padding="props.padding"
    :forward="true"
    :border="props.border"
    @click="handleClick">

    <template v-if="list.length">
      <view v-if="inline" class="inline">
        {{listStr}}
      </view>

      <view v-else v-for="item,index in list" class="tag" :key="index">
        {{ item.cityIdStr || item.city }}
      </view>
    </template>
    
    <view v-if="!list.length">{{ placeholder }}</view>
  </ym-cell>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Item {
  cityName: string
}
type List = Item[]

const props = withDefaults(defineProps<{
  modelValue?: List
  icon?: string
  label?: string
  placeholder?: string
  align?: 'left' | 'right'
  disabled?: boolean,
  padding?: boolean,
  border?: boolean,
  limit?: number,
  inline?: boolean
}>(), {
  modelValue: () => [] as List,
  placeholder: '请选择',
  disabled: false,
  padding: true,
  border: true,
  limit: 5,
  inline: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const list = computed({
  get (): List {
    return props.modelValue
  },
  set (value: List) {
    emit('update:modelValue', value)
  }
})

const listStr = computed(() => {
  return props.modelValue.map((item)=>{
    return item.cityIdStr || item.city
  }).join('、')
})

const handleClick = (event: any) => {
  let arr =  list.value&&list.value.map((item:any) => item.cityId) || []
  uni.$once('features-page/region-city-selection:confirm',  (data) => {
    list.value = data
  })
  uni.navigateTo({
    url: '/pages/features-page/region-city-selection?limit='+props.limit+'&value=' + arr.join(',')
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

.inline{
  flex-shrink: 0;
  flex-grow: 0;
  width: 360rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
