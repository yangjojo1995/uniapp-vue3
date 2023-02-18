<template>
  <view> 
    <view class="flex ai-center jc-center u-p-y-16 fs-24 text-color-secondary theme-color">
        <view class="copy-text">下载商业计划书请登录PC端</view>
        <view class="copy-btn" @click="copy">复制链接</view>
    </view>
    <ym-project-item
      :collectProject="true"
      @item-click="goDetail(item.projectId)"
      @more-click="showAction(item)"
      v-for="item in pagingLazy.list"
      :key="item.id"
      :item="item"
    ></ym-project-item>
    <ym-empty
      v-if="pagingLazy.isEmpty"
      text="暂无数据"
      type="search"
    ></ym-empty>
    <ym-load-more v-else :status="pagingLazy.loadStatus"></ym-load-more>
  </view>
</template>

<script setup lang="ts">
import CONFIG from '@/config'
import { ref, reactive, computed } from 'vue'
import { onShow, onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import {
  useService,
  useConfig,
  useRouter,
  setToken,
  setUserInfo
} from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import { operateConfirm } from '@/utils/commonUse'

const service = useService()
const baseUrl = CONFIG.ASSETS_BASE_URL

const keyword = ref('')

const pagingLazy = reactive(new PagingLazy(async function (page, size) {
  const result = await service.collectBp.getCollectList({ page, size })
  return {
    total: result.total,
    records: result.records
  }
}))

onLoad(async function () {
  pagingLazy.load()
})
onShow(async function () {
  await pagingLazy.refresh()
})

onPullDownRefresh(async () => {
  await pagingLazy.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  pagingLazy.next()
})

const copy = () => {
  uni.setClipboardData({
    data: baseUrl
  })
}

const goDetail = async (id: string) => {
  uni.navigateTo({ url: `/pages/project/detail?id=${id}` })
}


const bpInfo:any = reactive({
  id: ''
})
//  查看项目BP
const getBpFileLast = async (id:string) => {
  const result = await service.collectBp.getBpFileLastest({
    id
  })
  Object.assign(bpInfo, result)
}

// 移除收藏
const removeCollect = async (item:any) => {
  uni.showLoading({})
  const result = await service.collectBp.removeCollect({ id: item.id })
  if (result) {
    setTimeout(() => {
      uni.showToast({ icon: 'none', title: '移除成功' })
      pagingLazy.refresh()
    }, 500)
  }
}

const showAction = (item:any) => {
  uni.showActionSheet({
    itemList: ['移除'],
    success: res => {
      removeCollect(item)
    }
  })
}

</script>

<style lang="scss" scoped>
.theme-color{
  background-color: #E5F9F2;
}
.copy-text{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-right: 20rpx;
  word-break: break-all;
  max-width: 480rpx;
}
.copy-btn{
  border-radius: 50rpx;
  color:#01BB77;
  font-size: 26rpx;
  padding: 14rpx 34rpx;
  background-color: #fff;
  width: 128rpx;
  text-align: center;
}
</style>
