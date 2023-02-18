<template>
  <view class="user-card ">
    <view class="user-card__left">
      <image class="image" v-if="userInfo.icon" :src="assets(userInfo.icon)"></image>
      <image class="image" v-else src="../../assets/mine/default.png"></image>
    </view>
    <view class="user-card__content" >
      <view class="header">{{userInfo.name}}</view>
      <view class="info">
        <!-- 左侧标签 -->
        <template>
          <view v-if="type==0" class="info__tag type0 flex-center" @click="goCertification">
            <text>去认证</text> 
            <image class="image" src="../../assets/mine/org-right.png"/>
          </view>

          <view v-else-if="type!=0 && userInfo.personIdentity.length==0" class="info__tag type1 flex-center">
            <text>普通用户</text> 
          </view>

          <view v-else class="info__tag type2 flex-center">
            <image class="image" src="../../assets/mine/manager.png"/>
            <text>投资经理</text>
          </view>
        </template>
        
        <!-- 右侧按钮组 -->
        <view class="info__link flex-center">
          <view class="info__link__change flex-center"  @click="handleChangeRole">
            <image class="image" src="../../assets/mine/echange.png" />
            <text class="text">{{[0, 1].includes(type)? '切换为企业' : '切换为个人'}}</text>
          </view>
          <image src="../../assets/mine/setting.png" class="image info__link__setting" @click="goSetting" />
          
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import assets from '@/utils/assets'
import { useRouter, getUserInfo } from '@/plugins/app-core'

const router = useRouter()

const props = withDefaults(defineProps<{
  userInfo: any
  type: number
}>(), {
  type: 0
})

const emit = defineEmits<{
  /** 点击事件 */
  (e: 'click', event: Event): void
  (e: 'changeRole', event: Event): void
}>()

// 前往认证页
const goCertification = () => {
  uni.navigateTo({	url: '/pages/mine/certification'}) 
}

// 切换角色
const handleChangeRole = (event: Event) => {
  emit('changeRole', event)
}

// 前往设置页
const goSetting = () => {
  uni.navigateTo({	url: '/pages/mine/setup'}) 
}

</script>

<style lang="scss" scoped>
.user-card{
  margin: 12rpx 24rpx 20rpx;
  display: flex;

  .user-card__left{
    margin: 0 8rpx;
    flex: 0 0 90rpx;
    height: 90rpx;
    border-radius: 90rpx;
    border: 3rpx solid #FFFFFF;
    .image{
      width: 90rpx;
      height: 90rpx;
      border-radius: 90rpx;
    }
  }

  .user-card__content{
    margin-left: 12rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1 1 580rpx;

    .header{
      width: 580rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .info{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .info__tag{
        width: 108rpx;
        height: 34rpx;
        border-radius: 42rpx;
        font-size: 22rpx;
        font-weight: 400;

        &.type0{
          border: 1px solid #FF7B00;
          background: #FEF6EE;
          color: #FF7B00;
          .image{
            width: 16rpx;
            height: 16rpx;
            margin-left: 4rpx;
          }
        }
        &.type1{
          border: 1px solid #999;
          color: #666;
          background: #FEF6EE;
        }
        &.type2{
          width: 150rpx;
          height: 42rpx;
          background: rgba(66,127,82,0.1);
          color: #666666;
          .image{
            width: 28rpx;
            height: 28rpx;
            margin-right: 6rpx;
          }
        }
      }

      .info__link{
        width: 272rpx;

        .info__link__setting{
          width:44rpx;
		      height:44rpx;
        }

        .info__link__change{
          margin-right: 16rpx;
          display: flex;
          flex: 0 0 214rpx;
          box-sizing: border-box;
          height: 54rpx;
          background: #FFFFFF;
          border-radius: 54rpx;
          border: 2rpx solid #CDCDCD;


          .image{
            width:30rpx;
            height:30rpx;
            margin-right: 12rpx;
          }

          .text{
            font-size: 24rpx;
            font-weight: 500;
            color: #333333;
          }
        }
      }
    }
  }

}
</style>
