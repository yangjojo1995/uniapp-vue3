<template>
  <view class="page safe">
    <u-sticky bgColor="#fff">
      <view class="nav-tab-list">
        <view class="tab-inner">
          <view class="nav-tab-item" :class="currentIndex == index ? 'nav-tab-item-active': ''" v-for="(item,index) in list1" :key="index" @click="select(index)"  :index="index">{{item.name}}</view>
        </view>
      </view>
    </u-sticky>
    <view class="u-p-x-32 u-p-t-20" v-if="currentIndex === 0">
      <template v-if="listPagingLazy.list.length>0">
      <view class="bg-white u-m-b-20 u-p-x-30 u-p-y-40 flex jc-between ai-center" v-for="item,index in listPagingLazy.list" :key="index">
        <view class="avatar-icon u-m-r-20" >
            <image :src="assets(item.icon)|| '../../../assets/mine/default.png'"/>
        </view>
        <view class="flex-1 ai-strech flex flex-column jc-between" >
            <view class="fs-30 text-color-primary u-m-b-10 bold">{{item.name}}</view>
            <view class="fs-26 text-color-secondary">角色:{{item.roleName}}</view>
        </view>
        <view class="unbind-btn fs-26" @click="unbind(item)">解除绑定</view>
      </view>
      </template>
      <ym-empty v-else></ym-empty>
    </view>
    <view class="u-p-x-32 u-p-t-20" v-else>
      <view class="bg-white u-p-x-30 u-p-y-40 flex jc-between ai-center border" v-for="item,index in 1" :key="index">
        <view class="flex-1 ai-strech flex flex-column jc-between" >
            <view class="fs-30 text-color-primary u-m-b-10 bold">办事员</view>
            <view class="fs-26 text-color-secondary">备注：系统默认角色，暂不可修改</view>
        </view>
      </view>
    </view>
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
const list1 = reactive([
  {name: '账号管理'},
  {name: '角色管理'}
])
const currentIndex = ref(0)
const select = (index:number) => {
  if (index === 0) {
    listPagingLazy.refresh()
  }
  currentIndex.value = index
}
const unbind = (item:any) => {

  uni.showModal({
    title: '解绑子账号?',
    content: '解绑之后,子账号无法使用该企业的功能。确定解绑？',
    success: async res => {
      if (res.confirm) {
         uni.showLoading({})
        try {
          const result = await service.subaccount.unbindSubAccount({
            identityId: item.identityId
          })
          uni.showToast({ title: '解绑成功'})
          listPagingLazy.refresh()
          uni.hideLoading()
        } catch (error) {
        }
      }
    }
  })
 

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

  .unbind-btn{
     padding:18rpx 36rpx;
     border-radius: 60rpx;
     border: 2rpx solid #D4D4D4;
     background-color: #f6f6f6;
  }

  	.nav-tab-list{
	  width:100%;
	  background-color: #FEFEFE;
	}
	.tab-inner{
	  display: flex;
	  align-items: center;
	  justify-content: space-evenly;
	}
	.nav-tab-item{
	  flex-grow: 1.0;
	  display:inline-block;
	  font-size: 30rpx;
	  font-weight: bold;
	  color: #999;
	  padding:24rpx 32rpx 24rpx;
	  position: relative;
	  text-align: center;
	}
	.nav-tab-item-active::after{
	  content: '';
	  width: 28rpx;
    height: 6rpx;
	  background: linear-gradient(90deg,transparent, transparent);
	  border-radius: 10rpx;
	  position: absolute;
	  bottom:0;
	  left:50%;
	  transform: translateX(-50%);
	}
	.nav-tab-item-active::after{
	  content: '';
	  width: 28rpx;
    height: 6rpx;
	  background: $--ym-bg-primary;
	  border-radius: 10rpx;
	  position: absolute;
	  bottom:0;
	  left:50%;
	  transform: translateX(-50%);
	}
	.nav-tab-item-active{
	  font-size: 30rpx;
	  color: #333333;
	}
	.nav-tab-list{
	  white-space: nowrap;
	  overflow: hidden;
	}

  .border{
    border-bottom:1rpx solid #D4D4D4;
  }
</style>