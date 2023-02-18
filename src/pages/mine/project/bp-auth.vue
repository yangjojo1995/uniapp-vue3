<template>
  <view class="wrap">
    	<view class="u-p-x-32 bg-white u-m-b-20 u-m-t-20">
        <!-- <view class="auth-item fs-32 text-color-primary u-p-y-48 flex ai-center jc-between" >
          <image class="pdf-icon u-m-r-14" src="../../../assets/mine/pdf.png"></image>
          <text class="flex-1  bold">
           {{bpName}}
          </text>
          <view class="fs-22 u-p-x-14 u-p-y-8 state">{{confirmed == 0 ?'待确权': '已确权'}}</view>
        </view> -->
        <view class="auth-item flex ai-center fs-32 text-color-primary  u-p-y-48 bold"  >
          <text>已邀请的确权人</text>
        </view>
        <view class="auth-list">
            <view class="auth-list-user flex ai-center jc-between u-p-y-24" :class="index === list.length-1? 'no-border': ''" v-for="item,index in list" :key="index">
              <image class="user-icon u-m-r-20" :src="assets(item.avatar)" ></image>
              <view class="flex-1 flex flex-column jc-center ">
                <text class="text-color-primary fs-32">{{item.representativeIdStr}}</text>
                <view class="text-color-secondary fs-26">
                  <text >{{item.statusStr}} </text>
                  <!-- 确权状态：assisting确权中，assisted已确权，revoke已撤销 -->
                  <template v-if="item.status === 'assisted'">
                    <text class="u-p-x-14">|</text>
                     <text>{{time(item.updateTime)}}</text>
                  </template>
                </view>
              </view>
               <image v-if="item.status==='assisting'" class="m-icon u-m-r-16" src="../../../assets/mine/m-icon.png"  @click.stop="showAction(item)" ></image>
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
import { time } from '@/utils/dayjs'
const service = useService()
const bpId = ref('')
const bpName = ref('')

const confirmed = ref(0)
const list:any = reactive([])

// 移除确权
const removeBpAssist = async (item:any) => {
  try {
    uni.showLoading({})
    // id 为确权操作的id
    const result = await service.collectBp.removeBpAssist({
      id: item.id
    })
    setTimeout(() => {
      uni.hideLoading()
      getList()
    }, 500)
  } catch (error) {
  }
}
const getList = async () => {
  const result = await service.collectBp.getBpMemberList({ projectId: bpId.value })
  Object.assign(list, result)
}

const showAction = (item:any) => {
  uni.showActionSheet({
    itemList: ['撤销'],
    success: res => {
      removeBpAssist(item)
    }
  })
}
onLoad(async (options:any) => {
  bpId.value = options.bpId || ''
  bpName.value = decodeURIComponent(options.bpName) || ''

  confirmed.value = options.confirm || ''

  getList()
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
.pdf-icon{
  width:56rpx;
  height:56rpx;
  max-width: 56rpx;
}
.no-border{
    border-bottom: 1rpx solid transparent;
}

.state{
  background: rgba(255, 163, 0, 0.1);
  border-radius: 40rpx;
  border: 1rpx solid rgba(255, 163, 0, 0.3);
  color:#FFA300;
}
</style>
