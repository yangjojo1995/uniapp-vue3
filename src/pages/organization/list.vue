<template>
  <!-- 该页为投资机构搜索结果页，显示其他页的投资机构搜索结果 -->
  <view class="page">
    <ym-search-bar v-model="search" clickable clearButton="none" :sticky="true" @click="router.back()"></ym-search-bar>

    <orgList class="page-list" :listPagingLazy="listPagingLazy"></orgList>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { useService, useConfig, useRouter, getUserInfo } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import orgList from './components/list.vue'
const router = useRouter()
const service = useService()

const search = ref('')

const filterData = reactive({
  statues: ["accept"],
  sortField: 'update_time',
  asc: false
})

// 分页
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.organization.getOrganizationRecords({ page, size, name: search.value, ...filterData  })
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

</script>

<style lang="scss" scoped>
.page-list {
  margin-top: 20rpx;
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
