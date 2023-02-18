<template>
  <view class="page">
    <view class="header">
      <ym-search-bar clickable clear-button="none" @click="jumpSearch" cancel-button="none"></ym-search-bar>
      <u-dropdown ref="dropdownRef">
        <u-dropdown-item v-model="filterData.belongCity" :title-active="filterData.belongCity" :title="filterData.cityName || '所属地区'">
          <view class="region-city-panel">
            <div class="region-city-panel__inner">
              <ym-region-city-panel @checked-citys="handleCheckedCitys"></ym-region-city-panel>
            </div>
          </view>
        </u-dropdown-item>
         <u-dropdown-item v-model="filterData.belongIndustry" :title-active="filterData.belongIndustry" :title="fieldOption?.label || '所属行业'" :options="fieldOptions">
        </u-dropdown-item>
      </u-dropdown>
    </view>

    <companyList class="page-list" :listPagingLazy="listPagingLazy"></companyList>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue"
import { onLoad, onReady, onPullDownRefresh, onReachBottom, onShow } from "@dcloudio/uni-app"
import { useService, useConfig, useRouter, getUserInfo } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import companyList from './components/list.vue'
const router = useRouter()
const service = useService()

const filterData = reactive({
  statues: ["accept"],
  name:'',
  cityName: '', // 
  belongProvince: '', // 省
  belongCity: '', // 市
  belongIndustry: '', // 所属行业
  sortField: 'update_time',
  asc: false
})
watch(() => filterData.belongIndustry, async () => listPagingLazy.refresh())
watch(() => filterData.belongCity, async () => listPagingLazy.refresh())
watch(() => filterData.name, async () => listPagingLazy.refresh())

// 分页
const factor = Math.trunc(Math.random() * 32)
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records } = await service.company.enterpriseList({ page, size, factor, ...filterData })
  for (const item of records) {
    item.focusAreas = (item.focusAreasStr || []).map((item: any) => item.cityIdStr).join('、')
    item.investFields = (item.investFieldsStr || []).map((item: any) => item.itemName).join('、')
  }
  return { total, records }
}))

onLoad(() => listPagingLazy.load())
onReachBottom(() => listPagingLazy.next())
onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh();
})

// 搜索条件
const fieldOptions = reactive([]) as { label: string, value: string }[]
const fieldOption = computed(() => fieldOptions.find(v => v.value === filterData.belongIndustry))
onLoad(async (query) => {
  const fields = await service.app.getDictionary({ dictCode: 'invest_field' })
  fieldOptions.push(
    { label: '所属行业', value: '' },
    ...fields.map(item => ({ value: item.itemValue, label: item.itemName }))
  )
})

const dropdownRef = ref()
const handleCheckedCitys = function (citys: any[]) {
  dropdownRef.value && dropdownRef.value.close()
  if (!citys || !citys[0]) {
    filterData.belongProvince = ''
    filterData.belongCity = ''
    filterData.cityName = ''
    return
  }
  if (filterData.belongCity === citys[0].cityId) return
  filterData.belongProvince = citys[0].provinceId
  filterData.belongCity = citys[0].cityId
  filterData.cityName = citys[0].cityName
}

// 跳转搜索页
const jumpSearch = function (type: string) {
  return router.push({
    path: '/pages/company/search',
    query: {
      title: '搜索企业',
      type: 'enterprise',
      path: '/pages/company/list'
    }
  })
}


</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background-color: #ffffff;
}

.page-list {
  margin-top: 20rpx;
}

.list-item-content {
  $line: 1;
  $line-height: 40rpx;

  font-size: 26rpx;
  font-weight: 400;
  color: #666666;
  max-height: ($line-height * $line);
  line-height: $line-height;
  display: -webkit-box;
  -webkit-line-clamp: $line;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  white-space: pre-wrap;
  margin-bottom: 8rpx;
  &:last-child {
    margin-bottom: 0;
  }
}

.credibility {
  white-space: nowrap;
  font-size: 24rpx;
  font-weight: 400;
  color: #666666;
  line-height: 42rpx;
  letter-spacing: 1rpx;

  text {
    margin-left: 6rpx;
  }
}

.text-primary {
  color: #00C682;
}

.region-city-panel {
  width: 100%;
  background-color: #ffffff;

  &__inner {
    flex: 0 0 auto;
    height: 60vh;
    // height: calc(100vh - 300rpx);
  }

  &__btns {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
