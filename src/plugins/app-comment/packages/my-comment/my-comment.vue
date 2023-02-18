<template>
  <div class="ac-mylist">
    <div class="ac-mylist-top">
      <div class="ac-mylist-top__tab">
        <uni-segmented-control
        :current="currentTab"
        :values="['点评', '点赞']"
        @clickItem="onClickItem"
        styleType="text"
        activeColor="#12C287"
        ></uni-segmented-control>
      </div>
      <div class="ac-mylist-top__search" @click="jumpSearch()"><img class="ac-mylist-top__search-icon" src="../../src/assets/img/search.png" alt=""></div>
    </div>

    <template v-if="currentTab===0">
      <div class="ac-mylist-card">
        <ac-comment
          v-for="(item,i) in commentListLazy.list" :key="item.id"
          :hideBorder="i===0"
          type="myComment"
          :item="item">
        </ac-comment>
      </div>
      <ym-empty v-if="commentListLazy.isEmpty" text="暂无数据" ></ym-empty>
      <uni-load-more v-else :status="commentListLazy.loadStatus"></uni-load-more>
    </template>
   
    <template v-if="currentTab===1">
      <div class="ac-mylist-card">
        <ac-comment
          v-for="(item,i) in praiseListLazy.list" :key="item.id"
          :hideBorder="i===0"
          :item="item"
          type="myPraise">
          </ac-comment>
      </div>
      <ym-empty v-if="praiseListLazy.isEmpty" text="暂无数据" ></ym-empty>
      <uni-load-more v-else :status="praiseListLazy.loadStatus"></uni-load-more>
    </template>
    
    

    
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onShow, onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app'
import { acUseService, useRouter } from '../../src/lib/app-core'
import { PagingLazy } from '../../src/lib/paging'

const acService = acUseService()
const router = useRouter()

const currentTab = ref(0) // 0 点评列表, 1 点赞列表
// 切换tab
const onClickItem = function (e: any) {
  currentTab.value = e.currentIndex
  if(currentTab.value === 0){
    commentListLazy.refresh()
  }
  if(currentTab.value === 1){
    praiseListLazy.refresh()
  }
}

let filterData = reactive({keyword: ''})
// 我的点评列表分页
const commentListLazy = reactive(
  new PagingLazy(async function(page, size) {
    const {total, records} = await acService.createComment.myCommentList({
      page,
      size,
      ...filterData
    })
    return {total,records}
  })
)
// 我的点赞列表分页
const praiseListLazy = reactive(
  new PagingLazy(async function(page, size) {
    const {total, records} = await acService.createComment.myPraiseList({
      page,
      size,
      ...filterData
    })
    return {total,records}
  })
)

onLoad(async(query)=>{
  if(query.currentTab){
    currentTab.value = Number(query.currentTab)
  }
  filterData.keyword = decodeURI(query.search || '')
  if(currentTab.value === 0){
    commentListLazy.load()
  }
  if(currentTab.value === 1){
    praiseListLazy.load()
  }
})

onPullDownRefresh(async () => {
  if(currentTab.value === 0){
    await commentListLazy.refresh()
  }
  if(currentTab.value === 1){
    await praiseListLazy.refresh()
  }
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  if(currentTab.value === 0){
    commentListLazy.next()
  }
  if(currentTab.value === 1){
    praiseListLazy.next()
  }
})

// 跳转搜索页
const jumpSearch = function () {
  let title = '搜索点评内容'
  if(currentTab.value === 1){
    title = '搜索点赞内容'
  }
  return router.push({
    path: '/plugins/app-comment/packages/search/search',
    query: {
      title: title,
      type: 'project',
      path: '/plugins/app-comment/packages/search-result/search-result?currentTab=' + currentTab.value
    }
  })
}


</script>

<style lang="scss">
.ac-mylist{
  margin-bottom: 80rpx;
}
.ac-mylist-top{
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 10;
  display: flex;
  height: 78rpx;
  padding: 0 56rpx;
  justify-content: space-between;
  background: #FFFFFF;
  &__tab{
    width: 200rpx;
    height: 29rpx;
  }
  &__search{
    width: 28rpx;
  }
  &__search-icon{
      margin-top: 22rpx;
      width: 28rpx;
      height: 29rpx;
    }
}

.ac-mylist-card{
  margin: 20rpx 24rpx 80rpx;
  padding: 32rpx 24rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
}
</style>