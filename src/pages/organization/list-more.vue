<template>
  <!-- 该页为投资机构页，从首页-查看更多 进入，能够进行搜索和筛选投资机构 -->
  <view class="page">
    
    <view class="header">
      <ym-search-bar clickable clear-button="none" cancel-button="none" @click="jumpSearch"></ym-search-bar>
      <u-dropdown ref="dropdownRef">
        <u-dropdown-item v-model="filterData.investField" :title-active="filterData.investField" :title="fieldOption?.label || '全部领域'" :options="fieldOptions">
        </u-dropdown-item>
        <u-dropdown-item v-model="filterData.city" :title-active="filterData.city" :title="filterData.cityName || '全部地区'">
          <view class="region-city-panel">
            <div class="region-city-panel__inner">
              <ym-region-city-panel @checked-citys="handleCheckedCitys"></ym-region-city-panel>
            </div>
          </view>
        </u-dropdown-item>
        <u-dropdown-item v-model="filterData.investRound" :title-active="filterData.investRound" :title="roundOption?.label || '全部轮次'" :options="roundOptions">
        </u-dropdown-item>
      </u-dropdown>
    </view>

    <orgList class="page-list" :listPagingLazy="listPagingLazy"></orgList>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { useService, useConfig, useRouter, getUserInfo } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import orgList from './components/list.vue'
const router = useRouter()
const service = useService()

const search = ref('')

const filterData = reactive({
  statues: ["accept"],
  investField: '', // 投资领域
  province: '', // 省
  city: '', // 市
  cityName: '',
  investRound: '', // 投资轮次
  sortField: 'update_time',
  asc: false
})
watch(() => filterData.investField, async () => listPagingLazy.refresh())
watch(() => filterData.city, async () => listPagingLazy.refresh())
watch(() => filterData.investRound, async () => listPagingLazy.refresh())

// 分页
const factor = Math.trunc(Math.random() * 32)
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.organization.getOrganizationRecords({ page, size, name: search.value, factor, ...filterData  })
  for (const item of records) {
    item.investFields = (item.investFieldsStr || []).map((item: any) => item.itemName).join('、')
    item.investRounds = (item.investRoundsStr || []).map((item: any) => item.itemName).join('、')
  }
  return { total, records }
}))

onLoad(async (query) => {
  search.value = decodeURIComponent(query.search || '')
  listPagingLazy.load()
})

onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh();
})

onReachBottom(() => {
  listPagingLazy.next()
})

// 搜索条件
const fieldOptions = reactive([]) as { label: string, value: string }[]
const fieldOption = computed(() => fieldOptions.find(v => v.value === filterData.investField))
const roundOptions = reactive([]) as { label: string, value: string }[]
const roundOption = computed(() => roundOptions.find(v => v.value === filterData.investRound))
onLoad(async (query) => {
  const fields = await service.app.getDictionary({ dictCode: 'invest_field' })
  fieldOptions.push(
    { label: '全部领域', value: '' },
    ...fields.map(item => ({ value: item.itemValue, label: item.itemName }))
  )
  const rounds = await service.app.getDictionary({ dictCode: 'invest_round' })
  roundOptions.push(
    { label: '全部轮次', value: '' },
    ...rounds.map(item => ({ value: item.itemValue, label: item.itemName }))
  )
})

const dropdownRef = ref()
const handleCheckedCitys = function (citys: any[]) {
  dropdownRef.value && dropdownRef.value.close()
  if (!citys || !citys[0]) {
    filterData.province = ''
    filterData.city = ''
    filterData.cityName = ''
    return
  }
  if (filterData.city === citys[0].cityId) return
  filterData.province = citys[0].provinceId
  filterData.city = citys[0].cityId
  filterData.cityName = citys[0].cityName
}

const userInfo = ref()
onLoad(async () => {
  userInfo.value = await getUserInfo()
})

const handleClick = function (item: any) {
  if (!userInfo.value) {
    return uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) router.push('/pages/login/login')
      }
    })
  }
  router.push({ path: '/pages/organization/detail', query: { id: item.id } })
}

const jumpSearch = function (type: string) {
  return router.push({
    path: '/pages/features-page/search',
    query: {
      title: '搜索投资机构',
      type: 'institution',
      path: '/pages/organization/list'
    }
  })
}

</script>

<style lang="scss" scoped>
.page-list {
  margin-top: 20rpx;
}

.header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background-color: #ffffff;
}

.fullname {
  color: #333333 !important;
}


.list-item-content {
  $line: 2;
  $line-height: 40rpx;

  font-size: 26rpx;
  font-weight: 400;
  color: #666666;
  max-height: ($line-height * $line);
  line-height: $line-height;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  white-space: pre-wrap;
  margin-bottom: 8rpx;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
