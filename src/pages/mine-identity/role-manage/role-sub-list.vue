<template>
  <view class="page safe">
    <template v-if="listPagingLazy.list.length>0">
    <view class="u-p-x-32 u-p-t-20" >
      <view class="bg-white u-m-b-20 u-p-x-30 u-p-y-40 flex jc-between ai-center" v-for="item,index in listPagingLazy.list" :key="index">
        <view class="avatar-icon u-m-r-20" >
            <image :src="assets(item.icon)|| '../../../assets/mine/default.png'"/>
        </view>
        <view class="flex-1 ai-strech flex flex-column jc-between" >
            <view class="fs-30 text-color-primary u-m-b-10 bold role-name">{{item.name}}</view>
            <view class="fs-26 text-color-secondary">角色:{{item.roleName}}</view>
        </view>
        <view class="tranfer-btn fs-26" @click="unbind(item)" >转让</view>
      </view>
    </view>
    </template>
    <template v-else>
      <ym-empty type="search" title="暂无子账号，请至少拥有一个子账号后，再转让管理员"></ym-empty>
      <view class="next-btn" @click="goInvite">去邀请子账号</view>
    </template>
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
  uni.navigateTo({
    url: '/pages/mine-identity/account-manage/invite-account?representativeId=' + representativeId.value
  })
}
const unbind = (item:any) => {
  uni.showModal({
    title: '转让管理员',
    content: '转让之后,将失去该企业的管理权限，并须重新登录',
    success: async res => {
      if (res.confirm) {
         uni.showLoading({})
        try {
          const result = await service.subaccount.transferAdmin({
            identityId: item.identityId,
            representativeId: representativeId.value
          })
          uni.showToast({ title: '转让成功，即将跳转登录'})
          setTimeout(() => {
            uni.hideLoading()
            uni.clearStorageSync()
            uni.reLaunch({url:'/pages/login/login'})
          }, 500)
        } catch (error) {
        }
      }
    }
  })
 

}
const representativeId = ref('')
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  // roleNotIn  0管理员，1办事员
  const { total, records }  = await service.subaccount.getSubAccountList({ page, size, roleNotIn: ['0'],representativeId:representativeId.value})
  return { total, records }
}))
onReachBottom(() => {
  listPagingLazy.next()
})

onLoad((options) => {
  representativeId.value = options.representativeId || ''
})

onShow(()=> {
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

  .unbind-btn{
     padding:18rpx 36rpx;
     border-radius: 60rpx;
     border: 2rpx solid #D4D4D4;
     background-color: #f6f6f6;
  }
  .tranfer-btn{
    background: $--ym-bg-primary;
    padding:18rpx 36rpx;
    border-radius: 60rpx;
    color:#fff;
  }
  .border{
    border-bottom:1rpx solid #D4D4D4;
  }
 .role-name{
    max-width: 250rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>