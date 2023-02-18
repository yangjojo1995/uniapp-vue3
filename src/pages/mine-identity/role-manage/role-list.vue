<template>
  <view class="content">
    <view class="u-m-t-20 bg-white u-p-x-32 role">
      <scroll-view  scroll-y="true" class="role-scroll">
        <view class="u-p-y-32 flex ai-center jc-between item" :class="{'display': item.deleted===1 }" v-for="(item,index) in roleList" :key="index" >
          <view class="tag" v-if="item.deleted===1">已禁用</view> 
          <view class="icon-box" >
            <image :src="assets(item.icon)" />
          </view>
          <view class="fs-32 text-color-primary flex-1 info">
            <view class="info-name">{{item.name}}</view> 
            <view class="info-role">{{item.defaultRoleTypeName }} | {{item.defaultSecondaryRoleTypeName}}</view> 
          </view>
          <template v-if="item.deleted!==1">
            <view class="unbind-btn fs-26" @click="unbind(index,item)" v-if="item.defaultSecondaryRoleType!= 0">解除绑定</view>
            <view class="tranfer-btn fs-26" @click="goSublist(item)" v-else>转让管理员</view>
          </template>
        </view>
        <ym-empty v-if="!roleList || !roleList.length" text="暂无数据"></ym-empty>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import assets from '@/utils/assets'
import { ref, reactive, refType, onShow, useService, operateConfirm, errorCatch } from '@/utils/commonUse'
import { setSubToken, getSubToken, getEnterpriseIdentity } from '@/utils/subToken'
import { enterpriseItem } from '@/service/mine'
const service = useService()

let roleList: Array<enterpriseItem> = reactive([])
let currentSubToken: refType<string> = ref('')

const unbind = (index:number,item:any) => {
  uni.showModal({
    title: '解绑子账号?',
    content: '解绑之后,子账号无法使用该企业的功能。确定解绑？',
    success: async res => {
      if (res.confirm) {
         uni.showLoading({})
        try {
          const result = await service.subaccount.unbindSubAccount({
            identityId: '',
            representativeId:item.representativeId
          })
          uni.showToast({ title: '解绑成功'})
          roleList.splice(index,1)
          uni.hideLoading()
        } catch (error) {
        }
      }
    }
  })
 
}

const getToken = async  () => {
  const result =	await service.mine.getAllToken()
  Object.assign(roleList, result.enterpriseIdentities)  
}

onShow(async () => {
  getToken()
})

const goSublist = (item:any) => {
  uni.navigateTo({
    url: '/pages/mine-identity/role-manage/role-sub-list?representativeId='+item.representativeId
  })
}


</script>

<style lang="scss" scoped>
.content{
  height: 100vh;
  overflow: hidden;
}
.role {
  min-height: calc(100vh - 20rpx);
  margin-top: 20rpx
}

.role-scroll{
  height: calc(100vh - 82px)
}
.item {
  border-bottom: 1rpx solid #dcdcdc;
  position: relative;

  .tag{
    color: #fff;
    width: 108rpx;
    height: 40rpx;
    font-size: 24rpx;
    min-width: 120rpx;
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    background: #E4F0FF;
    border-radius: 4rpx;
    color: #0073FF;
  }

  &.display{
    .info {
      .info-name{
        color: #aaa;
      }
      .info-role{
        color: #aaa;
      }
    }

    .tag{
      background: #ddd;
      color: #aaa;
    }
  }
  

  &:last-child{
    border-bottom: 1rpx solid transparent;
  }
}

.icon-box{
  width: 108rpx;
  height: 108rpx;
  background: #F2F2F2;
  overflow: hidden;
  border-radius: 108rpx;
  margin-right: 20rpx;
  flex-shrink: 0;

  image{
    width: 108rpx;
    height: 108rpx;
    border-radius: 108rpx;
    object-fit: contain;
  }
}

.info{
  width: calc(100% - 160px);

  .info-name{
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    word-break: break-all;
  }

  .info-role{
    margin-top: 8rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
  }
}

.bottom{
    height: 146rpx;
    background: #FFFFFF;
    width: 100%;
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    left: 0;
    box-shadow: 0 -2px 12px 0 rgb(0 0 0 / 10%);

  .bottom-btn {
    height: 82rpx;
    margin: 32rpx;
    background: $--ym-bg-primary;
    border-radius: 50px;
    color: #fff;
    align-items: center;
    display: flex;
    justify-content: center;
  }
}

 .manager-btn{
    background: #F8F8F8;
    border: 2rpx solid #E9E9E9;
    padding:24rpx 60rpx;
    margin-right:20rpx;
   border-radius: 60rpx;
}
.next-btn{
  width:476rpx !important;
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

</style>>



