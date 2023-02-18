<template>
  <view class="drafts">
    <ym-activity-item v-for="item in pagingLazy.list" :key="item.id" :item="item">
      <template #buttons>
        <view class="footer-box">
          <view class="footer-btn flex-center red" name="footer-btn" @click="handleDelete(item.id)">
            <image style="width: 28rpx;" src="../../../assets/activity/delete.png"></image>
            <text>删除</text>
          </view>
          <view class="footer-hr"></view>
          <view class="footer-btn flex-center black" name="footer-btn" @click="goDraftDetail(item.id)">
            <image style="width: 30rpx;" src="../../../assets/activity/edit.png"></image>
            <text>编辑</text>
          </view>
        </view>
      </template>      
    </ym-activity-item>
    <ym-empty v-if="pagingLazy.isEmpty" text="暂无数据" mode="list"></ym-empty>
    <uni-load-more v-else :status="pagingLazy.loadStatus"></uni-load-more>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { PagingLazy } from '@/utils/paging'
import { ref, reactive } from 'vue'
import { useService} from '@/plugins/app-core'
import { operateConfirm } from '@/utils/toast'
const service = useService()

const pagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records } = await service.activity.queryDraftActivities({ page, size})
  return { total, records }
}))

onLoad(async (query) => {
  pagingLazy.load()
})

onPullDownRefresh(async () => {
  await pagingLazy.refresh()
  uni.stopPullDownRefresh();
})

onReachBottom(() => {
  pagingLazy.next()
})


const goDraftDetail = (id: string): void => {
  uni.navigateTo({ url: `./form-view?id=${id}` })
}

const handleDelete = (id: string): void => {
  operateConfirm('删除', async () => {
    return await service.activity.deleteDraft({id: id})
  }, function () {
    pagingLazy.refresh()
  })
}

</script>

<style lang="scss" scoped>

.footer-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  
  .footer-hr{
    border-left: 1px solid #C6C6C6;
    height: 20rpx;
  }

  .footer-btn{
    width: 49%;

    image{
      object-fit: contain;
      margin-right: 12rpx;
      height: 30rpx;
    }
    text {
      font-size: 28rpx;
      font-weight: 400;
    }
  }
}

.black {
  color: #333333;
  background: #fff;
}

.red {
  color: #FF4435;
  background: #fff;
}
</style>
