<template>
  <view class="content">
    <view class="u-m-t-20 bg-white u-p-x-32 role">
      
      <scroll-view  scroll-y="true" class="role-scroll">

        <view class="u-p-y-32 flex ai-center jc-between item" :class="{'display': item.deleted===1 }" v-for="(item,index) in roleList" :key="index" @click="changeToken(item)">
          <view class="tag" v-if="currentSubToken===item.subToken">当前管理</view> 
          <view class="tag" v-if="item.deleted===1">已禁用</view> 
          <view class="icon-box" >
            <image v-if="item.icon" :src="assets(item.icon)" />
            <image v-else src="../../assets/mine/default.png" />
          </view>
          <view class="fs-32 text-color-primary flex-1 info">
            <view class="info-name">{{item.name}}</view> 
            <view class="info-role">{{item.defaultRoleTypeName }} | {{item.defaultSecondaryRoleTypeName}}</view> 
          </view>
        </view>
        <view class="item-bottom"><!-- 加载更多 --></view>
        
        <ym-empty v-if="!roleList || !roleList.length" text="暂无数据"></ym-empty>
      </scroll-view>
      

      <ym-footer>
        <view class="flex jc-between ai-center">
          <view class="manager-btn fs-32 text-color-primary" @click="goRoleList">管理</view>
          <view class="next-btn" @click="goCertification()">
            添加身份
          </view>
        </view>
      </ym-footer>
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



const getToken = async  () => {
  const result =	await service.mine.getAllToken()
  Object.assign(roleList, result.enterpriseIdentities)  
  let current: enterpriseItem = await getEnterpriseIdentity() as enterpriseItem
  if(current && current.subToken){
    currentSubToken.value = current.subToken
  }
}

onShow(async () => {
  getToken()
})

const goRoleList = () => {
  uni.navigateTo({
    url: '/pages/mine-identity/role-manage/role-list'
  })
}
const changeToken = async (item: enterpriseItem) => {
  if (item.deleted===1) {
    return
  }
  // confirm  1已确认，0未确认
  if (item.defaultRoleType === 2 && item.confirm === 0) {
    uni.showModal({
      title: '资料确认通知',
      content: '您的身份由平台运营创建，请确认信息并阅读投盟公约后使用',
      showCancel: false,
      confirmText: '去确认',
      success: (res) => {
        console.log(res)
        if (res.confirm) {
          return uni.navigateTo({ url: `/pages/mine-identity/organization/index?type=update&unionId=${item.representativeId}&subToken=${item.subToken}` })
        }
      }
    })
  } else {
    const token = item.subToken
    uni.showLoading({	title: '切换中...' })
    await setSubToken(token)
    await service.app.updateLoginTime()
    setTimeout(() => {
      uni.navigateBack({ delta: 1 })
    }, 200);
  }

}

const goCertification = () => {
  uni.navigateTo({
    url: './certification',
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
  height: calc(100vh - 82px);
}
.item-bottom{
  width: 100%;
  height: 40rpx;
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
    padding:18rpx 60rpx;
    margin-right:20rpx;
   border-radius: 60rpx;
}
.next-btn{
  width:476rpx !important;
}

</style>>
