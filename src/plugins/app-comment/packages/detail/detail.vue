<template>
  <div class="detail" v-if="detail && detail.id">
    <div class="ac-card"  >
      <ac-comment type="detail" :item="detail" @updateLike="updateLike"></ac-comment>
    </div>
    
    <div class="ac-card">
      <div class="person__title">
        <span class="person__title__text">点赞信息</span>
        <span class="person__title__number">({{listPagingLazy.total}})</span>
      </div>
      <ac-person-item v-for="(item,i) in listPagingLazy.list" :key="item.id"
        :item="item" :hideBorder="i===0">
      </ac-person-item>
      <ym-empty v-if="listPagingLazy.isEmpty" text="暂无数据" ></ym-empty>
      <uni-load-more v-else :status="listPagingLazy.loadStatus"></uni-load-more>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, reactive } from 'vue'
import { onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app'
import { acUseService } from '../../src/lib/app-core'
import { PagingLazy } from '../../src/lib/paging'

const acService = acUseService()

let commentId: Ref<string> = ref('')
let detail: Ref<CommentDetail> = ref()

const listPagingLazy = reactive(
  new PagingLazy(async function (page, size) {
    const { total, records } = await acService.comment.getLikeList({ page, size, commentId: commentId.value, sortField:'create_time', asc: false})
    return { total, records }
  })
)
onReachBottom(() => listPagingLazy.next())
onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh()
})

onLoad(async (options) => {
  if( typeof(options.id) !== 'string') return
  commentId.value =  options.id
  acService.comment.getCommentDetail({ id: options.id}).then((res: CommentDetail) => {
    // 此处使用异步，以便和列表同时加载
    detail.value = res
  })
  listPagingLazy.load()
})

// 更新点赞数据
function updateLike(status: boolean, id: string) {
  uni.$emit('updateCommentList',{status, id})
  listPagingLazy.refresh()
}

</script>

<style lang="scss" scoped>
.ac-card{
  padding-bottom: 0;
}
.person__title {
  margin-bottom: 20rpx;

  .person__title__text{
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    margin-right: 4rpx;
  }
  .person__title__number{
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
  }
}
</style>