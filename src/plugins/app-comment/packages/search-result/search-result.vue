<template>
  <div class="ac-mylist-r">
    <div class="ac-mylist-r-top">
      <div class="ac-mylist-r-top__search">
        <ym-search-bar
          v-model="filterData.keyword"
          clickable
          clearButton="none"
          :sticky="true"
          @click="router.back()">
          </ym-search-bar>
      </div>
      <div class="ac-mylist-r-top__tab">
        <uni-segmented-control
        :current="currentTab"
        :values="['点评', '点赞']"
        @clickItem="onClickItem"
        styleType="text"
        activeColor="#12C287"
        ></uni-segmented-control>
      </div>
     
    </div>

    <div v-if="currentTab===0" class="ac-mylist-r-card">
      <ac-comment
        v-for="(item,i) in commentListLazy.list" :key="item.id"
        :hideBorder="i===0"
        type="myComment"
        :item="item">
      </ac-comment>
      <ym-empty v-if="commentListLazy.isEmpty" text="暂无数据" ></ym-empty>
      <uni-load-more v-else :status="commentListLazy.loadStatus"></uni-load-more>
    </div>

    <div v-if="currentTab===1" class="ac-mylist-r-card">
      <ac-comment
        v-for="(item,i) in praiseListLazy.list" :key="item.id"
        :hideBorder="i===0"
        :item="item"
        type="myPraise">
        </ac-comment>
      <ym-empty v-if="praiseListLazy.isEmpty" text="暂无数据" ></ym-empty>
      <uni-load-more v-else :status="praiseListLazy.loadStatus"></uni-load-more>
    </div>
    

    
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



</script>

<style lang="scss">
.ac-mylist-r{
  margin-bottom: 80rpx;
}
.ac-mylist-r-top{
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 10;
  // height: 78rpx;
  
  justify-content: space-between;
  background: #FFFFFF;
  &__tab{
    padding: 0 56rpx;
    // height: 29rpx;
  }
  &__search{
  }
  &__search-icon{
      margin-top: 22rpx;
      width: 28rpx;
      height: 29rpx;
    }
}

.ac-mylist-r-card{
  margin: 20rpx 24rpx 80rpx;
  padding: 32rpx 24rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
}
</style>