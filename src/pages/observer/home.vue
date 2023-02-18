<template>
  <view class="page">
    <ym-search-bar v-model="search" clickable clear-button="none" cancel-button="none"  :sticky="true" @click="jumpSearch"></ym-search-bar>

    <obsList class="page-list" :listPagingLazy="listPagingLazy"></obsList>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { useService, useConfig, useRouter, getUserInfo } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import obsList from './components/list.vue'
const router = useRouter()
const service = useService()

const search = ref('')

const filterData = reactive({
  statues: ["accept"],
  sortField: 'update_time',
  asc: false
})

const factor = Math.trunc(Math.random() * 32)
// 项目推荐分页
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.observer.getObserverRecords({ page, size, factor, ...filterData })
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

// 跳转搜索页
const jumpSearch = function (type: string) {
  return router.push({
    path: '/pages/features-page/search',
    query: {
      title: '搜索指导单位',
      type: 'observer',
      path: '/pages/observer/list'
    }
  })
}

</script>

<style lang="scss" scoped>
.page-list {
  margin-top: 20rpx;
}
</style>
