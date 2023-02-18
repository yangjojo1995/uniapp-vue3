<template>
  <view class="page">
    <template v-if="listPagingLazy.list.length>0">
      <view class="u-p-x-32 u-p-t-20">
        <view class="bg-white u-m-b-20 u-p-x-30 u-p-y-40 flex jc-between ai-center" v-for="item,index in listPagingLazy.list" :key="index">
          <view class="avatar-icon u-m-r-20" >
              <image :src="assets(item.icon) || '../../../assets/mine/default.png'"/>
          </view>
          <view class="flex-1 ai-strech flex flex-column jc-between" >
              <view class="fs-30 text-color-primary u-m-b-10 bold">{{item.name}}</view>
              <view class="fs-26 text-color-secondary">角色:{{item.roleName}}</view>
          </view>
        </view>
      </view>
      <view style="padding-bottom:220rpx;"></view>
    </template>
    <ym-empty v-else></ym-empty>
    <ym-footer>
        <view class="w-100 flex jc-between ai-center">
          <view class="manager-btn fs-32 text-color-primary" @click="goAccount">管理</view>
          <view class="invite-btn text-center flex-1 next-btn" @click="goInvite">办事子账号邀请</view>
        </view>
    </ym-footer>
  </view>
</template>

<script setup lang="ts">
import {ref,reactive} from 'vue'
import { onLoad, onReachBottom, onShow } from "@dcloudio/uni-app";
import { useService, useConfig } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging';
import assets from '@/utils/assets'
const service =useService()
const config =useConfig()
const goInvite = () => {
  uni.navigateTo({url:'/pages/mine-identity/account-manage/invite-account'})
}
const goAccount = () => {
  uni.navigateTo({url:'/pages/mine-identity/account-manage/role-list'})
}
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  // roleNotIn  0管理员，1办事员
  const { total, records }  = await service.subaccount.getSubAccountList({ page, size, roleNotIn: ['0']})
  return { total, records }
}))

onReachBottom(() => {
  listPagingLazy.next()
})

onShow(() => {
  listPagingLazy.refresh()
})




</script>>

<style lang="scss" scoped>
  .avatar-icon{
    width:108rpx;
    height:108rpx;
    border-radius: 50%;
    overflow: hidden;
    image{
      width:100%;
      height:100%;
    }
  }

  .invite-btn {
    background: $--ym-bg-primary;
    color: #fff;
    padding:18rpx 0;
    border-radius: 50%;
     border-radius: 60rpx;
    width: 476rpx !important;
  }

  .manager-btn{
    border: 2rpx solid #E9E9E9;
    padding:18rpx 62rpx;
    margin-right:20rpx;
    border-radius: 60rpx;
    background: #F6F6F6;

  }
  .delete-btn{
    background-color: #FF2722;
    padding:24rpx 0;
    border-radius: 60rpx;
    color:#fff;
    width: 476rpx !important;
  }
</style>