<template>
  <view class="page">
      <template v-if="listPagingLazy.list.length>0">
        <view class="u-p-x-32 u-p-t-20">
        <view class="bg-white u-m-b-20 u-p-x-30 u-p-y-40 flex jc-between ai-center" v-for="item,index in listPagingLazy.list" :key="index" @click="selectChange(item)">
          <view class="avatar-icon u-m-r-20" >
              <image :src="assets(item.avatar) || '../../../assets/mine/default.png'" />
          </view>
          <view class="flex-1 ai-strech flex flex-column jc-between u-m-r-30" >
              <view class="fs-30 text-color-primary u-m-b-10 bold">{{item.name}}</view>
              <view class="fs-26 text-color-secondary">加入时间：{{time.formatTime(item.affiliateTime)}}</view>
          </view>
          <view class="checkbox">
            <view class="check-inner" :class="item.checked? 'checked-active' : ''" v-if="showAction">
              <u-icon name="checkmark" size="12" color="#fff"></u-icon>
            </view>
          </view>
        </view>
     </view>
     <view style="padding-bottom:220rpx;"></view>
    </template>
    <ym-empty v-else></ym-empty>
    <ym-footer>
      <template v-if="!showAction">
        <view class="w-100 flex jc-between ai-center">
          <view class="manager-btn fs-32 text-color-primary" @click="showAction = true">管理</view>
          <view class="invite-btn text-center flex-1 next-btn" @click="goSearch">邀请投资经理挂靠</view>
        </view>
      </template >
      <template v-else>
         <view class="w-100 flex jc-between ai-center">
          <view class="manager-btn fs-32 text-color-primary" @click="showAction = false">取消</view>
          <view class="delete-btn text-center flex-1" @click="deleteHandle">解除关系</view>
        </view>
      </template>
    </ym-footer>
  </view>
</template>

<script setup lang="ts">
import {ref,reactive} from 'vue'
import { onLoad,onReachBottom, onShow } from "@dcloudio/uni-app";
import { useService, useConfig } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging';
import time from '@/utils/time'
import assets from '@/utils/assets'
const service =useService()
const config =useConfig()
const showAction = ref(false)
// const goInvite = () => {
//   uni.navigateTo({url:'/pages/mine-identity/account-manage/invite'})
// }
// const goAccount = () => {
//   uni.navigateTo({url:'/pages/mine-identity/account-manage/role-list'})
// }
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  // roleNotIn  0管理员，1办事员
  const { total, records }  = await service.manager.relationManagerList({ page, size})
  for (const item of records) {
    item.checked =  false
  }
  return { total, records }
}))

onReachBottom(() => {
  listPagingLazy.next()
})

onShow(() => {
listPagingLazy.refresh()
})


const goSearch = () => {
  uni.navigateTo({url:'/pages/mine-identity/organization-manage/invite-manager'})
}
const getChange = (e:any) => {
  console.log(e)
}
const selectChange = (item:any) => {
 if (!showAction.value) return
 item.checked = !item.checked
}
const deleteHandle =  () => {
  let arr:any =  []
  listPagingLazy.list.forEach((data:any) =>{
    if(data.checked)arr.push(data.id)
  })
  if (arr.length ===0) {
    uni.showToast({
      icon: 'none',
      title: '请至少选择一个投资经理'
    })
    return 
  }
  uni.showModal({
    title: '解除关系',
    content: `确定解除投资经理挂靠关系?`,
    success: async (res) => {
      if (res.confirm) {
       const result  =await service.organization.exitRelation({
         investManagerId: arr
       })
       uni.showToast({icon: 'none', title: '解除关系成功'})
       showAction.value = false
       listPagingLazy.refresh()
      }
    }
  })
}



</script>>

<style lang="scss" scoped>
.checkbox{
  min-width: 36rpx;
}
.check-inner{
  width:36rpx;
  height:36rpx;
  background-color: #fff;
  border-radius: 6rpx;
  border:1rpx solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checked-active{
  width:36rpx;
  height:36rpx;
  background-color: #01BA76;
  border-radius: 6rpx;
  border:1rpx solid #01BA76;
  display: flex;
  align-items: center;
  justify-content: center;
}
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
    background: #F8F8F8;
    border: 2rpx solid #E9E9E9;
    padding:18rpx 62rpx;
    margin-right:20rpx;
        border-radius: 60rpx;
  }
  .delete-btn{
    background-color: #FF2722;
    padding:18rpx 0;
    border-radius: 60rpx;
    color:#fff;
    width: 476rpx !important;
  }
</style>