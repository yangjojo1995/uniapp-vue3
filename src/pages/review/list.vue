<template>
  <view class="page">
    <uni-segmented-control
      :current="current"
      :values="items"
      @clickItem="onClickItem"
      styleType="text"
      activeColor="#12C287"
    ></uni-segmented-control>
    <view class="content">
      <ym-list-card 
        v-for="item in listPagingLazy.list" :key="item.id" :icon="iconMap[item.title] || '../../assets/review/icon3.png'" 
        :name="item.title"  @click="handleClick(item)">
        <template #name-left>
          <ym-tag :type="typeMap[item.status].type">{{typeMap[item.status].label}}</ym-tag>
        </template>
        <template #content>
          <view class="list-item">申请时间：{{ time.formatTime(item.createTime) }}</view>
          <view class="list-item">申请人：{{ item.sourceName || '-' }} </view>
          <view class="list-item" v-if="item.expireReason">失效原因：{{ item.expireReason || '-' }}</view>
        </template>
      </ym-list-card>

      <ym-empty v-if="listPagingLazy.isEmpty" text="暂无数据" mode="list" ></ym-empty>
      <uni-load-more v-else :status="listPagingLazy.loadStatus" ></uni-load-more>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive} from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom, onShow} from '@dcloudio/uni-app'
import {  useService,  useRouter,  getUserInfo} from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import time from '@/utils/time'
const router = useRouter()
const service = useService()
const current = ref(0)
const filterData = reactive({ status: '0' })
const items = ['待审核', '已同意', '已失效', '已撤销', '全部']
const typeMap: any = {
  '0': { type: 'yellow', label: '待审核' },
  '1': { type: 'primary', label: '已同意' },
  '2': { type: 'info', label: '已失效' },
  '3': { type: 'purple', label: '已撤销' }
}
const iconMap: any = {
  'BP查看权限申请': '../../assets/review/icon1.png',
  '办事子账号邀请': '../../assets/review/icon2.png',
}
// 分页
const listPagingLazy = reactive(
  new PagingLazy(async function (page, size) {
    const { total, records } = await service.review.reviewSearch({
      page,
      size,
      type: 'target',
      ...filterData
    })
    return { total, records }
  })
)

onShow(async (props) => {
  listPagingLazy.refresh()
})
onReachBottom(() => listPagingLazy.next())
onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh()
})

const userInfo = ref()
onLoad(async () => {
  userInfo.value = await getUserInfo()
})
const handleClick = function (item: any) {
  if (!userInfo.value) {
    return uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) router.push('/pages/login/login')
      }
    })
  }
  router.push({
    path: '/pages/review/detail',
    query: { id: item.id }
  })
}
const onClickItem = function (e: any) {
  if (current.value != e.currentIndex) {
    current.value = e.currentIndex
    if (current.value === 4) {
      filterData.status = ''
    } else {
      filterData.status = current.value + ''
    }
    listPagingLazy.refresh()
  }
}
</script>

<style lang="scss" scoped>
::v-deep.list-item{
  &::after{
    display:none;
  }
}

.list-item{
  font-size: 26rpx;
  font-weight: 400;
  color: #666666;
  margin: 8rpx 0 ;
}
  .content {
    margin-top: 20rpx;
  }

</style>
