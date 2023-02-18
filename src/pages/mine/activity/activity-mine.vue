<template>
  <view class="activity">
    <ym-activity-item @item-click="goActivityDetail(item.id)" v-for="item in pagingLazy.list" :key="item.id" :item="item"></ym-activity-item>
    <ym-empty v-if="pagingLazy.isEmpty" text="暂无数据" mode="list"></ym-empty>
    <uni-load-more v-else :status="pagingLazy.loadStatus"></uni-load-more>
  </view>
</template>

<script setup lang="ts">
import { createPagingLazy, onPullDownRefresh, onReachBottom } from '@/utils/commonList'

const {pagingLazy, pullDownRefresh, reachBottom} = createPagingLazy('activity', 'participateList')
onPullDownRefresh(pullDownRefresh)
onReachBottom(reachBottom)

const goActivityDetail = (id: string):void => {
  uni.navigateTo({url: `/pages/activity/detail?id=${id}`})
}
</script>


<style lang="scss" scoped>
.activity{
  background: #F7F7F7;
  padding-bottom: 146rpx;
}
</style>
