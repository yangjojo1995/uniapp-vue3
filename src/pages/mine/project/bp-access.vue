<template>
  <view class="wrap">
    	<view class="u-p-x-32 bg-white u-m-b-20 u-m-t-20">
        <view class="action-title fs-36 text-color-primary bold u-p-y-48" >BP公开权限</view>
        <view class="auth-item flex ai-center fs-32 text-color-primary  u-p-y-48"  @click="selectIndex(1)">
          <view class="auth-icon-wrap" >
              <image class="auth-icon" src="../../../assets/mine/dui.png" v-if="currentIndex==1"/>
          </view>
          <text>所有投资人可查看</text>
        </view>
        <view class="auth-item  flex ai-center fs-32 text-color-primary u-p-y-48" @click="selectIndex(0)">
          <view class="auth-icon-wrap" >
              <image class="auth-icon" src="../../../assets/mine/dui.png"  v-if="currentIndex==0"/>
          </view>
          <text class="flex-1">已授权用户可查看</text>
         <image class="arrow-down" src="../../../assets/mine/arrow-down.png"  :class="currentIndex==0 ? 'arrow-down-active': ''"></image>
        </view>

        <view class="auth-list" v-if="currentIndex==0">
            <view class="auth-list-user flex ai-center jc-between u-p-y-24" :class="index === pagingLazy.list.length-1? 'no-border': ''" v-for="item,index in pagingLazy.list" :key="index">
              <image class="user-icon u-m-r-20" :src="assets(item.avatar)" ></image>
              <view class="flex-1 flex flex-column jc-center ">
                <text class="text-color-primary fs-32">{{item.name}}</text>
                <view class="text-color-secondary fs-26">
                  <text >{{item.type}} </text>
                  <text class="u-p-x-14">|</text>
                  <text>{{item.remark}}</text>
                </view>
              </view>
               <image class="m-icon u-m-r-16" src="../../../assets/mine/m-icon.png"  @click.stop="showAction(item)" ></image>
            </view>
        </view>
      </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import assets from '@/utils/assets'
const service = useService()
const currentIndex = ref(1)
const bpId = ref('')
let isSubmit = false

const selectIndex = (index:number) => {
  if (index == currentIndex.value) return
  if (isSubmit) {
    return false
  }
  currentIndex.value = index
  changeShowAll()
}

// 切换公开权限
const changeShowAll = async () => {
  if (isSubmit) {
    return false
  }
  isSubmit = true
  try {
    uni.showLoading({
      title: '正在切换'
    })
    const result = await service.collectBp.updateBpAuth({
      id: bpId.value,
      showAll: currentIndex.value
    })
    setTimeout(() => {
      isSubmit = false
      uni.hideLoading()
    }, 1000)
  } catch (error) {
    isSubmit = false
  }
}

// 移除查看下载权限
const removeBpAuth = async (item:any) => {
  try {
    uni.showLoading({})
    const result = await service.collectBp.removeBpAuth({
      bpId: bpId.value,
      id: item.id
    })
    setTimeout(() => {
      uni.hideLoading()
      pagingLazy.refresh()
    }, 500)
  } catch (error) {
  }
}
const pagingLazy = reactive(new PagingLazy(async function (page, size) {
  const result = await service.collectBp.getBpMemberPagelist({ page, size, projectId: bpId.value })
  return {
    total: result.total,
    records: result.records
  }
}))

const showAction = (item:any) => {
  uni.showActionSheet({
    itemList: ['移除'],
    success: res => {
      removeBpAuth(item)
    }
  })
}
watch(() => currentIndex.value, (val) => {
  if (val == 0) {
    pagingLazy.refresh()
  }
})
onLoad(async (options:any) => {
  bpId.value = options.bpId || ''
  currentIndex.value = options.showAll * 1
})
onReachBottom(() => {
  pagingLazy.next()
})

</script>

<style lang="scss" scoped>
    .action-title{
      border-bottom: 1rpx solid #ECE7E3;
      position: relative;
      &:before{
        content: '';
        width: 8rpx;
        height: 36rpx;
        background: $--ym-bg-primary;
        border-radius: 8rpx;
        position: absolute;
        left:-32rpx;
        top:50%;
        transform: translateY(-50%);
      }
    }
    .auth-item{
      border-bottom: 1rpx solid #ECE7E3;
    }

    .auth-icon-wrap{
      width:28rpx;
      height:28rpx;
      margin-right: 24rpx;
      display: flex;
      align-items: center;
      padding-left:20rpx;
    }
    .auth-icon{
      width:28rpx;
      height:28rpx;
      min-width:28rpx;
    }
    .arrow-down{
      width:28rpx;
      height:28rpx;
      min-width: 28rpx;
    }
    .arrow-down-active{
      transform: rotateZ(180deg);
      transition: 0.2s linear;
    }

  .auth-list{
    padding-left:60rpx;
  }
  .auth-list-user{
    border-bottom: 1rpx solid #ECE7E3;
  }
.user-icon{
  width: 80rpx;
  min-width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.m-icon{
  width: 40rpx;
  min-width: 40rpx;
  height: 40rpx;
}
.no-border{
    border-bottom: 1rpx solid transparent;
}
</style>
