<template>
  <view class="activity">
    <ym-activity-item @item-click="goDetail(item.id)" v-for="item in pagingLazy.list" :key="item.id" :item="item"></ym-activity-item>
    <ym-empty v-if="pagingLazy.isEmpty" text="暂无数据" mode="list"></ym-empty>
    <uni-load-more v-else :status="pagingLazy.loadStatus"></uni-load-more>
  </view>
</template>

<script setup lang="ts">
import { createPagingLazy, onPullDownRefresh, onReachBottom, useService } from '@/utils/commonList'
import { onLoad, onShow } from "@dcloudio/uni-app";
const service = useService()

let {pagingLazy, pullDownRefresh, reachBottom} = createPagingLazy('activity', 'queryActivitiesList')
onPullDownRefresh(pullDownRefresh)
onReachBottom(reachBottom)

const goDetail = async (id: string) => {
  uni.navigateTo({url: `/pages/activity/detail?id=${id}`})
  // 更新阅读人数
  let viewData = await service.activity.getViewOfActivity({id: id})
  if(viewData && (viewData.view >= 0)){
    for(let key in pagingLazy.list){
      if(pagingLazy.list[key].id === id){
        pagingLazy.list[key].view = viewData.view + 1
        break
      }
    }
  }
}
onShow(async(options) => {
  pagingLazy.load()
})

uni.$on('updateDate',function({scene}){ 
  pagingLazy.refresh()
})
</script>

<style lang="scss" scoped>

</style>
