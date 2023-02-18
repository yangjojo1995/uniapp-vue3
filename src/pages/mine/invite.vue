<template>
  <view>
    <view class="header">
      <view class="header__title">邀请好友 加入乡产投盟</view>
      <view class="header__subtitle">为广东金融支持农业产业高质量发展贡献力量</view>
      <view v-if="name" class="header__name">
        <image class="image" src="@/assets/mine/invitation-header-icon.png" mode="aspectFit" />
        <text class="label">您的推荐人</text>
        <text class="name">{{ name }}</text>
      </view>
      <button class="header__btn" open-type="share" title="邀请微信好友">
        <image class="image-wx" src="@/assets/mine/invitation-header-wx.png" mode="aspectFit" />
        <text>邀请微信好友</text>
      </button>
    </view>

    <view class="list-box">
      <template v-if="pagingLazy.list.length">
        <view class="list-box__tip">
          <text>已累计邀请</text>
          <text>{{ pagingLazy.total > 999 ? '999+' : pagingLazy.total }}</text>
          <text>人</text>
        </view>
        <view class="table">
          <view class="table-thead">
            <view class="table-tr">
              <view class="table-th">好友注册账号</view>
              <view class="table-th">名称</view>
              <view class="table-th">个人身份</view>
              <view class="table-th">加入日期</view>
            </view>
          </view>
          <view class="table-tbody">
            <view v-for="item in pagingLazy.list" :key="item.id" class="table-tr">
              <view class="table-td">{{ item.account }}</view>
              <view class="table-td">{{ item.inviterName }}</view>
              <view class="table-td">{{ item.type }}</view>
              <view class="table-td">{{ date(item.createTime) }}</view>
            </view>
          </view>
        </view>
      </template>
      <ym-empty v-if="pagingLazy.isEmpty" title="暂无推荐好友" type="search"></ym-empty>
    </view>

  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getIdentity } from '@/utils/subToken'
import shareIcon from '../../assets/index/share.png'
export default defineComponent({
  data () {
    return {
      shareOptions: {},
    }
  },
  async created () {
    const userInfo = await getUserInfo()
    const identity = await getIdentity()
    this.shareOptions = {
      title: '邀请你加入乡产投盟',
      path: '/pages/login/login?inviter=' + (identity?.representativeId || userInfo?.userId),
      imageUrl: shareIcon
    }
  }
})
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { useConfig, useService, useRouter, getUserInfo } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import { date } from '@/utils/dayjs'

const config = useConfig()
const router = useRouter()
const service = useService()

const name = ref('')
const userInfo = ref()
onLoad(async () => {
  name.value = await service.mine.userInviter()
  userInfo.value = await getUserInfo()
})

// 推荐分页
const pagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records } = await service.mine.invitedList({ page, size })
  return { total, records }
}))
pagingLazy.size = 20

// 上拉加载
pagingLazy.load()
onReachBottom(() => pagingLazy.next())

// 下拉刷新
onPullDownRefresh(async () => {
  await pagingLazy.refresh()
  uni.stopPullDownRefresh();
})
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  background: #ffffff url('@/assets/mine/invitation-header.png') top center no-repeat;
  background: 100% auto;
  box-sizing: border-box;
  padding: 64rpx 0;
  &__title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    line-height: 32rpx;
    text-align: center;
    margin-bottom: 24rpx;
  }
  &__subtitle {
    font-size: 26prx;
    font-weight: 400;
    color: #999999;
    line-height: 26rpx;
    text-align: center;
    margin-bottom: 34rpx;
  }
  &__name {
    font-size: 26rpx;
    font-weight: 500;
    color: #666666;
    line-height: 26rpx;
    text-align: center;
    margin-bottom: 40rpx;
    color: #666666;
    .image {
      display: inline-block;
      width: 50rpx;
      height: 50rpx;
      margin-right: 1rpx;
      vertical-align: middle;
    }
    .label {
      color: #333333;
      margin-right: 17rpx;
      vertical-align: middle;
    }
    text {
      vertical-align: middle;
    }
  }
  &__btn {
    width: 550rpx;
    height: 82rpx;
    line-height: 82rpx;
    background: $--ym-bg-primary;
    border-radius: 50rpx;
    text-align: center;
    user-select: none;
    margin: auto;
    font-size: 32rpx;
    font-weight: 500;
    color: #FFFFFF;
    .image-wx {
      display: inline-block;
      width: 42rpx;
      height: 42rpx;
      margin-right: 15rpx;
      vertical-align: middle;
    }
  }
}

.list-box {
  background-color: #ffffff;
  margin-top: 20rpx;
  padding: 38rpx;
  &__tip {
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
    line-height: 26px;
    text-align: center;
    margin-bottom: 23rpx;
  }
}

.table {
  display: block;
  width: 100%;
  border: 2rpx solid #E9E9E9;
  border-radius: 8rpx;
  .table-thead {
    background: #F9F9F9;
    border-bottom: 2rpx solid #E9E9E9;
  }
  .table-tr {
    display: flex;
    border-bottom: 2rpx solid #E9E9E9;
    &:last-child {
      border-bottom: none;
    }
  }
  .table-th,
  .table-td {
    flex: 0 0 25%;
    width: 100%;
    font-size: 24rpx;
    padding: 24rpx 17rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
    line-height: 24rpx;
    box-sizing: border-box;
    overflow: hidden;
    &:first-child {
      padding-left: 34rpx;
    }
    &:last-child {
      padding-right: 34rpx;
    }
  }

  .table-th {
    padding-top: 22rpx;
    padding-bottom: 22rpx;
    color: #666666;
  }

  .table-th:nth-child(1), .table-td:nth-child(1) { flex: 0 0 33%; width: 33%; max-width: 33%; }
  .table-th:nth-child(2), .table-td:nth-child(2) { flex: 0 0 15%; width: 15%; max-width: 15%; }
  .table-th:nth-child(3), .table-td:nth-child(3) { flex: 0 0 22%; width: 22%; max-width: 22%; }
  .table-th:nth-child(4), .table-td:nth-child(4) { flex: 0 0 30%; width: 30%; max-width: 30%; }
}
</style>