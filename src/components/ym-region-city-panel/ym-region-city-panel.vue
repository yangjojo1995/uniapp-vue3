<template>
  <view class="city-selection" :class="{ 'city-selection--border': props.border }">
    <scroll-view class="city-selection__side" scroll-y>
      <view
        v-for="option in provinceOptions"
        class="side-option"
        :class="{ 'is-active': hasCheckedProvince(option) }"
        :key="option.id"
        @click="handleSelectProvince(option)">
        <text>{{ option.name }}</text>
      </view>
    </scroll-view>
    <view class="city-selection__container">
      <ym-easytag-select-panel
        v-model="currentCitysValue"
        :options="cityOptions"
        :checked-options="currentCitys"
        :title="props.title"
        :limit="props.limit"
        value-key="id"
        label-key="name">
      </ym-easytag-select-panel>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useService } from '@/plugins/app-core'
const service = useService()

interface Node {
  id: string,
  name: string,
  parentId?: string,
  parentName?: string,
  children?: Node[]
}

interface City {
  cityId: string,
  cityName: string,
  provinceId: string,
  provinceName: string
}

const props = withDefaults(defineProps<{
  // 双向绑定的值
  modelValue?: string | string[]
  // 标题
  title?: string
  // 边框
  border?: boolean
  // 限制选择数量
  limit?: number
}>(), {
  title: '城市',
  border: true,
  options: () => [],
  limit: 1
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props['modelValue']): void
  (e: 'checked-citys', value: City[]): void
}>()

const nodes: Node[] = reactive([])
onMounted(async () => {
  const nodesResult = await service.app.getRegion({ level: 1 })
  const nodesResult2 = await service.app.getRegion({ level: 2 })
  nodes.splice(0, nodes.length, ...nodesResult)
  for (const item of nodes) {
    item.children = nodesResult2.filter((i: Node) => {
      const pass = i.parentId === item.id
      if (pass) i.parentName = item.name
      return pass
    })
  }
  handleSelectProvince(nodes[0])
})

const provinceOptions = computed((): Node[] => nodes || [])
const currentProvince = ref(null as Node | null)
const hasCheckedProvince = function (item: Node) {
  return currentProvince.value?.id === item.id
}
const handleSelectProvince = function (item: Node) {
  currentProvince.value = item
}


const cityAllOptions = computed((): Node[] => {
  const options = []
  for (const item of provinceOptions.value) {
    if (item.children) options.push(...item.children)
  }
  return options
})

const cityOptions = computed((): Node[] => currentProvince.value?.children || [])
const currentCitysValue = ref(null as null | string | string[])
const currentCitys = computed((): Node[] => {
  const ids = Array.isArray(currentCitysValue.value) ? currentCitysValue.value : (currentCitysValue.value ? [currentCitysValue.value] : [])
  return ids.map(id => cityAllOptions.value.find(i => i.id === id)).filter(Boolean) as Node[]
})

watch(() => currentCitys, function () {
  const citys = currentCitys.value.map((item: Node) => ({
    cityId: item.id,
    cityName: item.name,
    provinceId: item.parentId || '',
    provinceName: item.parentName || ''
  }))
  
  emit('checked-citys', citys)
  emit('update:modelValue', citys.map(item => item.cityId))
}, { deep: true })

watch(() => props.modelValue, function (value) {
  if (String(value) === String(currentCitys.value.map(i => i.id))) return
  currentCitysValue.value = value || null
}, { deep: true })

</script>

<style lang="scss" scoped>
.city-selection {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #ffffff;
  box-sizing: border-box;
  &__side {
    display: block;
    flex: 0 0 180rpx;
    width: 180rpx;
    height: 100%;
    overflow-y: auto;
    border-right: 2rpx solid #ECE7E3;
  }
  &__container {
    display: block;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
}

.city-selection--border {
  border: 2rpx solid #ECE7E3;
}

.side-option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 98rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
  text-align: center;
  font-size: 28rpx;
  color: #666666;
  transition: color 0.3s;
  &::before {
    content: '';
    opacity: 0;
    position: absolute;
    left: 0;
    top: 32rpx;
    bottom: 32rpx;
    z-index: 1;
    width: 8rpx;
    margin: auto;
    background-color: #ffffff;
    border-radius: 4rpx;
    transition: background-color 0.3s, opacity 0.3s;
  }


  span {
    display: block;
    font-size: 24rpx;
    color: #333333;
    text-align: center;
    line-height: 30rpx;
  }

  &.is-active {
    color: #333333;
    &::before {
      opacity: 1;
      background: $--ym-bg-primary;
    }
  }
}

</style>
