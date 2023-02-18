<template>
  <!-- 项目推荐 -->
  <ym-group title="推荐投资机构" header-right-text="查看更多" :container-padding="containerPadding" @header-right-click="router.push({ path: '/pages/organization/list-more' })">
    <ym-list-item
      v-for="(item, index) in pagingLazy.list"
      :key="index"
      :thumb="assets(item.logo)"
      :thumbWidth="80"
      :thumbHeight="80"
      :name="item.shortName"
      :note="item.introduction"
      :note-lines="2"
      :clickable="true"
      :thumb-lazy-load="true"
      thumb-type="avatar"
      thumb-mode="aspectFit"
      @click="handlePagingLazyClick(item)">
      <template #content>
        <view class="list-item-content" v-if="item.location?.city"><!-- 所属地区： -->{{ item.location?.city }}</view>
        <view class="list-item-content" v-if="item.investFields">投资领域：{{ item.investFields }}</view>
      </template>
    </ym-list-item>
    <ym-empty v-if="pagingLazy.isEmpty" text="暂无数据" type="search"></ym-empty>
    <ym-load-more v-else :status="pagingLazy.loadStatus"></ym-load-more>
  </ym-group>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { useService, useRouter } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import assets from '@/utils/assets'

const router = useRouter()
const service = useService()

const containerPadding = 0

const filterData = reactive({
  // sortField: 'update_time',
  // asc: false
})

// 推荐分页
const pagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.home.getRecommendOrganizationRecord({ page, size, ...filterData })
  for (const item of records) {
    item.investFields = (item.investFieldsStr || []).map((item: any) => item.itemName).join('、')
    item.investRounds = (item.investRoundsStr || []).map((item: any) => item.itemName).join('、')
  }
  return { total, records }
}))

// 推荐项点击事件
const handlePagingLazyClick = function (item: any) {
  router.push({ path: '/pages/organization/detail', query: { id: item.id } })
}

// 上拉加载
pagingLazy.load()
onReachBottom(() => pagingLazy.next())

// 下拉刷新
onPullDownRefresh(async () => {
  await pagingLazy.refresh()
  uni.stopPullDownRefresh();
})
</script>

<style lang="scss" scoped>
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
}
</style>
