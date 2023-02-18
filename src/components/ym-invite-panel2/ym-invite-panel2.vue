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
    <view class="city-selection__container" :class="{hide: currentIndex ==2||currentIndex ==3}" key="1">
      <template>
        <ym-easytag-select-panel2
          v-model="currentValue"
          :options="managerOptions"
          :checked-options="currents"
          title="投资经理"
          :limit="managerOptions.length"
          :min="props.min"
          :min2="props.min2"
          value-key="rid"
          label-key="name"
          image-key="logo"
          :showMarks="false"
          @checked-options="handleCheckedOptions">
        </ym-easytag-select-panel2>
      </template>
    </view>
     <view class="city-selection__container" :class="{hide: currentIndex ==1||currentIndex ==3}" key="2">
       <template >
          <ym-easytag-select-panel2
            v-model="currentOrganizationValue"
            :options="organizationOptions"
            :checked-options="currentsOrganization"
            title="投资机构"
            :limit="organizationOptions.length"
            :min="props.min"
            :min2="props.min2"
            value-key="rid"
            label-key="name"
            image-key="logo"
            :showMarks="false"
            @checked-options="handleCheckedOptionsOrganization">
          </ym-easytag-select-panel2>
       </template>
    </view>
     <view class="city-selection__container" :class="{hide: currentIndex ==1||currentIndex ==2}" key="3">
       <template >
          <ym-easytag-select-panel2
            v-model="currentsGuideValue"
            :options="guideOptions"
            :checked-options="currentsGuide"
            title="指导单位"
            :limit="guideOptions.length"
            :min="props.min"
            :min2="props.min2"
            value-key="rid"
            label-key="name"
            image-key="logo"
            :showMarks="false"
            @checked-options="handleCheckedOptionsGuide">
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
  guide?: string | string[]
  // 标题
  projectId: string,
  title?: string,
  title2?: string
  // 边框
  border?: boolean
  min?:number,
  min2?:number,
 
}>(), {
  title: '投资经理',
  title2: '投资机构',
  border: true,
  options: () => [],
  min:0,
  min2:0,
})

const selectOptions = reactive([
  {id: 1, name: '投资经理'},
  {id: 2, name: '投资机构'},
  {id: 3, name: '指导单位'},
])
const emit = defineEmits<{
  (e: 'update:managers', value: typeof props['managers']): void
  (e: 'update:organizations', value: typeof props['organizations']): void
  (e: 'update:guide', value: typeof props['guide']): void
  (e: 'checked-managers', value: any): void
  (e: 'checked-organizations', value: any): void
  (e: 'checked-guide', value: any): void
}>()

// 投资经理
const managerOptions: any = reactive([])

// 投资机构
const organizationOptions: any = reactive([])
// 指导单位
const guideOptions: any = reactive([])


onMounted(async () => {
  uni.showLoading({})
  const getManagerList = service.project.getAssistMemberList({ roleType: '1', filterByProjectId: props.projectId, enable:0, name: '' }).then(res=>{
    console.log(res)
    Object.assign(managerOptions,res)
  })

  const getOrganizationList = service.project.getAssistMemberList({ roleType: '2', filterByProjectId: props.projectId, enable:0, name: '' }).then(res=>{
    Object.assign(organizationOptions,res)
  })

  const getGuideList = service.project.getAssistMemberList({ roleType: '4', filterByProjectId: props.projectId, enable:0, name: '' }).then(res=>{
    Object.assign(guideOptions,res)
  })
  
  Promise.all([getManagerList, getOrganizationList, getGuideList]).then(()=>{
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
const currentsGuideValue = ref(null as null | string | string[])
const currentsGuide:any = ref([])
const handleCheckedOptions = function (options: any) {
  currents.value = options
}
const handleCheckedOptionsOrganization = function (options: any) {
  currentsOrganization.value = options
}

const handleCheckedOptionsGuide = function (options: any) {
  currentsGuide.value = options
}


watch(() => currents, function () {
  const managers = currents.value.map((item: any) => ({
    id: item.rid,
    name: item.name,
  }))
  emit('checked-managers', managers)
  emit('update:managers', managers.map((item:any) => item.id))
}, { deep: true })

watch(() => currentsOrganization, function () {
  const organizations = currentsOrganization.value.map((item: any) => ({
    id: item.rid,
    name: item.name,
  }))
  emit('checked-organizations', organizations)
  emit('update:organizations', organizations.map((item:any) => item.id))
}, { deep: true })

watch(() => currentsGuide, function () {
  const guide = currentsGuide.value.map((item: any) => ({
    id: item.rid,
    name: item.name,
  }))
  emit('checked-guide', guide)
  emit('update:guide', guide.map((item:any) => item.id))
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

watch(() => props.guide, function (value) {
  if (value) {
    if (String(value) === String(currentsGuide.value.map((i:any) => i.id))) return
     currentsGuideValue.value = value || []
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
