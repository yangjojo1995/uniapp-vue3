<template>
  <div>
    
    <div class="list-header">
      <div class="list-header__text">全部点评</div>
      <div class="list-header__number">({{listPagingLazy.total}})</div>
      <div class="list-header__order" :class="{'active': orderBy==='likes'}" @click="setSortField('likes')">按点赞数排序</div>
      <div class="list-header__order--split"></div>
      <div class="list-header__order" :class="{'active': orderBy==='create_time'}"  @click="setSortField('create_time')">按时间倒序</div>
    </div>

    <ac-comment
      v-for="(item,i) in listPagingLazy.list" :key="item.id"
      :hideBorder="i===0"
      :item="item">
    </ac-comment>
    <ym-empty v-if="listPagingLazy.isEmpty" text="暂无数据" ></ym-empty>
    <uni-load-more v-else :status="listPagingLazy.loadStatus"></uni-load-more>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref, onMounted } from 'vue'
import { onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app'
import { acUseService } from '../../lib/app-core'
import { PagingLazy } from '../../lib/paging'

const acService = acUseService()

const props = withDefaults(defineProps<{
  bindId?: string
}>(), {
})

const listPagingLazy = reactive(
  new PagingLazy(async function (page, size) {
    const { total, records } = await acService.comment.getCommentList({ page, size, sortField: orderBy.value, ...!!props.bindId && {bindId: props.bindId}})
    return { total, records }
  })
)
onReachBottom(() => listPagingLazy.next())
onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh()
})

let orderBy: Ref<string> = ref('likes')
function setSortField(order: string){
  orderBy.value = order
  listPagingLazy.refresh()
}

/* function goComment(id: string){
   uni.navigateTo({ url: '/plugins/app-comment/packages/detail/detail?id=' + id })
} */

uni.$on('updateCommentList',function({status, id}){ 
  /* let i = listPagingLazy.list.findIndex(item => { return id === item.id })
  let item = JSON.parse(JSON.stringify(listPagingLazy.list[i]))
  item.likeStatus = status ? 1 : 0
  listPagingLazy.list.splice(i, 1, item) */

  listPagingLazy.refresh()
})

onMounted (() => {
  listPagingLazy.load()
})


</script>
<style lang="scss" scoped>
.ac-card{
  padding-left: 26rpx;
  padding-right: 26rpx;
}
.list-header {
  margin-bottom: 48rpx;
  display: flex;
  align-items: flex-end;

  .list-header__text{
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    font-weight: bold;
    margin-right: 4rpx;
  }
  .list-header__number{
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
    flex-grow: 1;
  }

  .list-header__order{
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;

    &.active{
      color: #00BB3B;
    }

    &--split{
      width: 1rpx;
      height: 22rpx;
      border-right: 2px solid #E2E2E2;
      margin: 0 16rpx;
      transform: translateY(-4rpx);
    }
  }
}
</style>