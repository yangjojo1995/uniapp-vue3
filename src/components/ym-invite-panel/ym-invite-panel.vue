<template>
  <view class="city-selection" :class="{ 'city-selection--border': props.border }">
    <scroll-view class="city-selection__side" scroll-y>
      <view
        v-for="option in selectOptions"
        class="side-option"
        :class="{ 'is-active': hasCheckedSelect(option) }"
        :key="option.id"
        @click="handleCheckedSelect(option)">
        <text>{{ option.name }}</text>
      </view>
    </scroll-view>
    <view class="city-selection__container" :class="{hide: currentIndex ==2}" key="1">
      <template>
        <ym-easytag-select-panel2
          v-model="currentValue"
          :options="dataOptionsManager"
          :checked-options="currents"
          :title="props.title"
          :limit="limitManager"
          :min="props.min"
          :min2="props.min2"
          value-key="id"
          label-key="name"
          image-key="avatar"
          @checked-options="handleCheckedOptions">
        </ym-easytag-select-panel2>
      </template>
    </view>
     <view class="city-selection__container" :class="{hide: currentIndex ==1}" key="2">
       <template >
          <ym-easytag-select-panel2
            v-model="currentOrganizationValue"
            :options="dataOptionsOrganization"
            :checked-options="currentsOrganization"
            :title="props.title2"
            :limit="limitOrganization"
            :min="props.min"
            :min2="props.min2"
            value-key="id"
            label-key="fullName"
            image-key="logo"
            @checked-options="handleCheckedOptionsOrganization">
          </ym-easytag-select-panel2>
       </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useService } from '@/plugins/app-core'
const service = useService()



const props = withDefaults(defineProps<{
  // 双向绑定的值
  managers?: string | string[]
  // 双向绑定的值
  organizations?: string | string[]
  // 标题
  title?: string,
  title2?: string
  // 边框
  border?: boolean
  // 限制选择数量
  limit?: number,
  limit2?: number,
  min?:number,
  min2?:number,
  excludeManager?:Array<string>,
  excludeOrganization?:Array<string>
}>(), {
  title: '投资经理',
  title2: '投资机构',
  border: true,
  options: () => [],
  limit: 10,
  limit2: 3,
  min:3,
  min2:1,
  excludeManager: ()=>[],
  excludeOrganization: () => []
})

const limitManager = computed(() => props.limit - props.excludeManager.length)
const limitOrganization = computed(() => props.limit2 - props.excludeOrganization.length)
const selectOptions = reactive([
  {
  id: 1,
  name: '投资经理'}, {
  id: 2,
  name: '投资机构'},
])
const emit = defineEmits<{
  (e: 'update:managers', value: typeof props['managers']): void
  (e: 'update:organizations', value: typeof props['organizations']): void
  (e: 'checked-managers', value: any): void
  (e: 'checked-organizations', value: any): void
}>()
let  nodesResult:any = reactive([])
let  nodesResult2:any = reactive([])
let  dataOptionsManager:any = reactive([])
let  dataOptionsOrganization:any = reactive([])


onMounted(async () => {
  uni.showLoading({})
  const getManagerList = service.certification.getManagerList({ page:1, size:200, statues: ['assisted'],notIn: props.excludeManager }).then(result1 =>{
    dataOptionsManager.push(...result1.records)
  })

  const getOrganizationList =  service.certification.getOrganizationList({page:1, size:200, statues: ['accept'],notIn: props.excludeOrganization }).then(result2 =>{
    dataOptionsOrganization.push(...result2.records)
  })
  
  Promise.all([getManagerList, getOrganizationList]).then(()=>{
    uni.hideLoading()
  })
})

const currentIndex = ref(1)
const hasCheckedSelect = function (item: any) {
  return currentIndex.value === item.id
}
const handleCheckedSelect = async function (item: any) {
  currentIndex.value = item.id
}


const currentValue = ref(null as null | string | string[])
const currents:any = ref([])
const currentOrganizationValue = ref(null as null | string | string[])
const currentsOrganization:any = ref([])
const handleCheckedOptions = function (options: any) {
  currents.value = options
}
const handleCheckedOptionsOrganization = function (options: any) {
  currentsOrganization.value = options
}


watch(() => currents, function () {
  const managers = currents.value.map((item: any) => ({
    id: item.id,
    name: item.name,
  }))
  emit('checked-managers', managers)
  emit('update:managers', managers.map((item:any) => item.id))
}, { deep: true })

watch(() => currentsOrganization, function () {
  const organizations = currentsOrganization.value.map((item: any) => ({
    id: item.id,
    name: item.shortName,
  }))
  emit('checked-organizations', organizations)
  emit('update:organizations', organizations.map((item:any) => item.id))
}, { deep: true })

watch(() => props.managers, function (value) {
  if (value) {
      if (String(value) === String(currents.value.map((i:any) => i.id))) return
     currentValue.value = value || []
  }
}, { deep: true,immediate:false })

watch(() => props.organizations, function (value) {
  if (value) {
    if (String(value) === String(currentsOrganization.value.map((i:any) => i.id))) return
     currentOrganizationValue.value = value || []
  }
}, { deep: true,immediate:false})

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

.hide {
  display: none !important;
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
