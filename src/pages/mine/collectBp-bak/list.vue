<template>
  <view class="page">
      <view class="flex ai-center jc-center u-p-y-16 fs-24 text-color-secondary theme-color">
          <view class="copy-text">如需下载请登录PC端网址{{baseUrl}}</view>
          <view class="copy-btn" @click="copy">复制</view>
      </view>
      <view class="u-p-x-32 u-p-y-20">
        <view class="bp-list">
          <view class="bp-item u-p-x-32 u-p-t-42 u-m-b-20 bg-white" v-for="item in pagingLazy.list" :key="item.id" @click="apply(item)">
            <view class="disable-auth fs-22 text-center flex ai-center jc-center" v-if="item.status!='可查看'">{{item.status}}</view>
            <view class="flex jc-between">
                <image class="bp-icon u-m-r-10" src="../../../assets/mine/pdf.png" lazy-load="false" ></image>
                <text class="fs-30 bold text-color-primary flex-1" >
                    {{item.projectName}}
                </text>
            </view>
            <view class="line u-p-t-20" ></view>
            <view class="flex ai-center jc-between u-p-y-24">
                <text class="text-color-third fs-26" >
                  {{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }} 收藏
                </text>
                <image class="m-icon u-m-r-10" src="../../../assets/mine/m-icon.png" lazy-load="false" @click.stop="showAction(item)" ></image>
            </view>
          </view>
        </view>
      </view>
      <ym-empty v-if="pagingLazy.isEmpty" text="暂无数据" mode="list"></ym-empty>
   </view>
</template>

<script setup lang="ts">
import CONFIG from '@/config'
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { reactive, useService } from '@/utils/commonUse'
import assets from '@/utils/assets'
import dayjs from 'dayjs'
import { PagingLazy } from '@/utils/paging'
const service = useService()
const baseUrl = CONFIG.ASSETS_BASE_URL

const pagingLazy = reactive(new PagingLazy(async function (page, size) {
  const result = await service.collectBp.getCollectList({ page, size })
  return {
    total: result.total,
    records: result.records
  }
}))

onPullDownRefresh(async () => {
  await pagingLazy.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  pagingLazy.next()
})

onShow(async () => {
  pagingLazy.load()
})

const copy = () => {
  uni.setClipboardData({
    data: baseUrl
  })
}
const showAction = (item:any) => {
  uni.showActionSheet({
    itemList: ['移除'],
    success: res => {
      removeCollect(item)
    }
  })
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

// 查看申请
const apply = async (item:any) => {
  if (item.status === '未授权') {
    uni.showModal({
      title: '查看申请',
      content: '确定向项目发布方申请查看BP吗？',
      success: async res => {
        if (res.confirm) {
          const result = await service.collectBp.applyBpAuth({ projectId: item.projectId })
          uni.navigateTo({
            url: '/pages/project/success'
          })
        }
      }
    })
  } else if (item.status === '可查看') {
    try {
      const res = await service.collectBp.getBpFile({ bpId: item.bpId, latest: true })
      uni.navigateTo({
        url: `/pages/project/bpFile?bpId=${item.bpId}&latest=true`
      })
    } catch (msg) {
      uni.showToast({ title: 'bp已更新', icon: 'none' })
      setTimeout(() => { uni.navigateBack({}) }, 800)
    }
  }
}

</script>>

<style lang="scss" scoped>
.disable-auth{
  position: absolute;
  right:0;
  top:0;
  width: 106rpx;
  height: 40rpx;
  background: linear-gradient(270deg, #F95F4B 0%, #FF9086 100%);
  border-radius: 0px 6rpx 0px 6rpx;
  color:#fff;
  text-align: center;
}

.theme-color{
  background-color: #E5F9F2;

}
.bp-item{
  border-radius: 6rpx;
  position:relative;
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
  width: 64rpx;
  text-align: center;
}
.bp-icon{
  width: 56rpx;
  min-width: 56rpx;
  height: 56rpx;
}
.m-icon{
  width: 40rpx;
  min-width: 40rpx;
  height: 40rpx;
}
.line{
  border-top:1rpx solid #f2f2f2;
}
</style>
