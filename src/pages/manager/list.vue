<template>
  <view class="page">
    <ym-search-bar v-model="search" clickable clearButton="none" :sticky="true" @click="router.back()"></ym-search-bar>

    <managerList class="page-list" :listPagingLazy="listPagingLazy"></managerList>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { useService, useConfig, useRouter, getUserInfo } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import managerList from './components/list.vue'
import assets from '@/utils/assets'
const router = useRouter()
const service = useService()

const search = ref('')

const filterData = reactive({
  statues: ["assisted"],
  sortField: 'update_time',
  asc: false
})
// 项目推荐分页
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records } = await service.manager.getManagerRecords({ page, size, name: search.value, ...filterData })
  for (const item of records) {
    item.focusAreas = (item.focusAreasStr || []).map((item: any) => item.cityIdStr).join('、')
    item.investFields = (item.investFieldsStr || []).map((item: any) => item.itemName).join('、')
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

.field-container {
  width: 100%;
}

.list-item-title {
    $line: 1;
    $line-height: 40rpx;

    font-size: 26rpx;
    font-weight: 400;
    max-height: ($line-height * $line);

    display: flex;
    align-items: center;

    margin-bottom: 8rpx;
    text {
      display: -webkit-box;
      -webkit-line-clamp: $line;
      -webkit-box-orient: vertical;
      line-height: $line-height;
      overflow: hidden;
      word-break: break-word;
      white-space: pre-wrap;
      max-width: 80%;
    }
    &:last-child {
      margin-bottom: 0;
    }
    image {
      width: 119rpx;
      height: 32rpx;
      margin-left: 10rpx;
    }
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
</style>
