<template>
  <view class="page">
    <view class="header">
      <ym-search-bar
        v-model="search"
        clickable
        clear-button="none"
        cancel-button="none"
        :sticky="true"
        @click="jumpSearch"
      ></ym-search-bar>

      <u-dropdown ref="dropdownRef">
        <u-dropdown-item
          v-model="filterData.industry"
          :title-active="filterData.industry"
          :title="fieldOption?.label || '所属行业'"
          :options="fieldOptions"
        >
        </u-dropdown-item>
        <u-dropdown-item
          v-model="filterData.investRound"
          :title-active="filterData.investRound"
          :title="roundOption?.label || '全部轮次'"
          :options="roundOptions">
        </u-dropdown-item>
        <u-dropdown-item
          v-model="filterData.hasBp"
          :title-active="filterData.hasBp"
          :title="projectOption?.label || '全部项目'"
          :options="projectOptions"
        >
        </u-dropdown-item>
      </u-dropdown>
    </view>
    <ym-project-item
      @item-click="handleClick(item)"
      :projectPool="true"
      v-for="item in listPagingLazy.list"
      :key="item.id"
      :item="item"
    ></ym-project-item>
    <ym-empty
      v-if="listPagingLazy.isEmpty"
      text="暂无数据"
      type="search"
    ></ym-empty>
    <ym-load-more v-else :status="listPagingLazy.loadStatus"></ym-load-more>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import {
  useService,
  useConfig,
  useRouter,
  setToken,
  setUserInfo
} from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import assets from '@/utils/assets'
const router = useRouter()
const service = useService()
const filterData = reactive({
  projectName: '',
  industry: '',
  hasBp: '',
  investRound: '' // 投资轮次
})
const search = ref('')
// 搜索条件
const fieldOptions = reactive([]) as { label: string; value: string }[]
const fieldOption = computed(() =>
  fieldOptions.find((v) => v.value === filterData.industry)
)
const roundOptions = reactive([]) as { label: string, value: string }[]
const roundOption = computed(() => roundOptions.find(v => v.value === filterData.investRound))
const projectOptions = reactive([
  { label: '全部项目', value: '' },
  { label: '有BP', value: '1' },
  { label: '无BP', value: '0' }
])
const projectOption = computed(() =>
  projectOptions.find((v) => v.value === filterData.hasBp)
)

watch(
  () => filterData.industry,
  async () => listPagingLazy.refresh()
)
watch(
  () => filterData.hasBp,
  async () => listPagingLazy.refresh()
)
watch(
  () => filterData.investRound,
  async () => listPagingLazy.refresh()
)
watch(
  () => filterData.projectName,
  async () => listPagingLazy.refresh()
)
// 项目推荐分页
const listPagingLazy = reactive(
  new PagingLazy(async function (page, size) {
    const { total, records } = await service.project.getProjectRecord({
      page,
      size,
      ...filterData
    })
    return { total, records }
  })
)

onLoad(async (query) => {
  search.value = decodeURIComponent(query.search || '')
  listPagingLazy.load()
  const fields = await service.app.getDictionary({ dictCode: 'invest_field' })
  fieldOptions.push(
    { label: '所属行业', value: '' },
    ...fields.map((item) => ({ value: item.itemValue, label: item.itemName }))
  )
  const rounds = await service.app.getDictionary({ dictCode: 'invest_round' })
  roundOptions.push(
    { label: '全部轮次', value: '' },
    ...rounds.map(item => ({ value: item.itemValue, label: item.itemName }))
  )
})

onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  listPagingLazy.next()
})

// 跳转搜索页
const jumpSearch = function (type: string) {
  return router.push({
    path: '/pages/features-page/search',
    query: {
      title: '搜索项目',
      type: 'project',
      path: '/pages/project/list'
    }
  })
}

const handleClick = async (item: any) => {
  await service.project.projectView({ id: item.id })
  router.push({ path: '/pages/project/detail', query: { id: item.id } })
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
</style>
