<template>
  <view class="list">

    <view v-for="(item,index) in pagingLazy.list" :key="item.id">
      <view class="timebox">
        <view class="timebox__inner" v-if="chatHistoryItemShowTime(item, index)">{{ fromNowLocal(item.createTime) }}</view>
      </view>
      <view class="card" @click="handleClick(item)">
        <view class="card__container">
          <view class="card-title">{{ item.title }}</view>
          <view class="card-content">{{ item.contentWord }}</view>
        </view>
        <view class="card__footer">
          <view class="card-link">
            <text>查看详情</text>
            <uni-icons color="#333333" size="28rpx" type="forward" />
          </view>
        </view>
      </view>
    </view>
    
    <ym-empty v-if="pagingLazy.isEmpty" text="暂无数据" type="search"></ym-empty>
    <ym-load-more v-else :status="pagingLazy.loadStatus"></ym-load-more>

  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { onLoad, onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app";
import { PagingLazy } from '@/utils/paging'
import { useService, useRouter } from '@/plugins/app-core'
import { fromNowLocal } from '@/utils/dayjs'

const service = useService()

const filterData = reactive({})
const pagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.message.searchAnnouncement({ page, size, ...filterData })
  return { total, records }
}))

// 上拉加载
onLoad(() => pagingLazy.load())
onReachBottom(() => pagingLazy.next())

// 下拉刷新
onPullDownRefresh(async () => {
  await pagingLazy.refresh()
  uni.stopPullDownRefresh()
})

const handleClick = (item: any) => {
  uni.navigateTo({url: `/pages/announcement/detail?id=${item.id}`})
}
const chatHistoryItemShowTime = (item: any, index: number) => {
  if (index <= 0) return true
  return fromNowLocal(item.createTime) !== fromNowLocal(pagingLazy.list[index - 1].createTime)
}
</script>

<style lang="scss" scoped>
@mixin text-line ($line-height, $line: 1) {
  max-height: ($line-height * $line);
  line-height: $line-height;

  display: -webkit-box;
  -webkit-line-clamp: $line;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  white-space: pre-wrap;
}

.timebox {
  text-align: center;
  margin: 22rpx auto 20rpx;
  &__inner {
    display: inline-block;
    // width: 280rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 24rpx;
    padding: 8rpx 22rpx;
    border-radius: 24rpx;
    background-color: #D8D9E2;
    text-align: center;
  }
}

.card {
  width: 686rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  margin: 0 auto 20rpx;
  &__container {
    padding: 30rpx;
  }
  &__footer {
    position: relative;
    padding: 20rpx 30rpx;
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 30rpx;
      right: 30rpx;
      margin: auto;
      height: 0;
      border-top: 1rpx solid #F2F2F2;
    }
  }

  .card-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    line-height: 28rpx;
    margin-bottom: 16rpx;
    @include text-line(40rpx, 2)
  }
  .card-content {
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
    @include text-line(40rpx, 2)
  }
  .card-link {
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;
    line-height: 28rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
