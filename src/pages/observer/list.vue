<template>
  <view class="page">
    <ym-search-bar v-model="search" clickable clearButton="none" :sticky="true" @click="router.back()"></ym-search-bar>

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

// 项目推荐分页
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.observer.getObserverRecords({ page, size, name: search.value, ...filterData })
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
  router.push({ path: '/pages/observer/detail', query: { id: item.id } })
}

</script>

<style lang="scss" scoped>
.page-list {
  margin-top: 20rpx;
}
</style>
