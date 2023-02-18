<template>
  <view class="role-card">
    <view class="role-card__manage" v-if="[2, 3, 4].includes(type)" @click="handleChangeEnterprise">
      <image class="role-card__manage--bg" src="../../assets/mine/card-bg.png"></image>
      <view class="header flex-between">
        <view class="header__title">当前管理</view>
        <view class="header-tag flex-center">
          <text>切换</text>
          <image class="image" src="../../assets/mine/arrow-green.png"></image>
        </view>
      </view>
      <view class="content flex-center">
        <image class="image" v-if="userIdentity?.enterpriseIdentity.icon" :src="assets(userIdentity.enterpriseIdentity.icon)" />
        <image class="image" v-else src="../../assets/mine/default.png"></image>
        <view class="content-name">{{userIdentity.enterpriseIdentity.name}}</view>
        <view class="content-role">{{roleMap[type]}}丨{{userIdentity.enterpriseIdentity.defaultSecondaryRoleTypeName}}</view>
      </view>
    </view>

    <view class="role-card__task flex-center" :class="{'role-card__task--top': [2, 3, 4].includes(type)}">
      <view class="role-card__task__item flex-center I--right" @click="goCredibility">
        <text class="item-left">{{credibility}}</text>
        <text class="item-right">诚信指数</text>
      </view>
      <view class="role-card__task__item flex-center" @click="goMyActivities">
        <text class="item-left">{{participateCount}}</text>
        <text class="item-right">参与活动</text>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, Ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import assets from '@/utils/assets'
import { useRouter, useService } from '@/plugins/app-core'
const service = useService()
const router = useRouter()

const props = withDefaults(defineProps<{
  userInfo?: any
  userIdentity: any
  type: number
}>(), {
  type: 0
})

const roleMap: any = reactive({0: '个人用户', 1: '投资经理', 2: '投资机构', 3: '企业', 4: '指导单位' })
let participateCount: Ref<number> = ref(0)
let credibility: Ref<number> = ref(0)
  const initData = async () => {
  // 获取参与活动数量
  participateCount.value = await service.activity.participateCount()

  // 获取诚信指数 
  const result = await service.user.getCurrentUserInfo()
  if(result.realName){
    credibility.value = 100
  }else {
    credibility.value = 0
  }
}

onShow(async () => {
  initData()
})

const emit = defineEmits<{
  /** 点击事件 */
  (e: 'click', event: Event): void
}>()

// 切换企业账号
const handleChangeEnterprise = () => {
  uni.navigateTo({	url: '/pages/mine/change-role' })
}

// 前往我的活动列表页
const goMyActivities = () => {
  uni.navigateTo({	url: '/pages/mine/activity/activity-mine'}) 
}

// 前往诚信指数详情页
const goCredibility = () => {
  uni.navigateTo({	url: `/pages/mine/credibility?logo=${props.userInfo.icon}&name=${props.userInfo.name}`}) 
}

defineExpose({
  initData
})

</script>

<style lang="scss" scoped>
.role-card{
  margin: 20rpx 24rpx;
  width: 702rpx;

  .role-card__manage{
    position: relative;
    width: 702rpx;
    height: 190rpx;
    border-radius: 12rpx;
    overflow: hidden;
    z-index: 5;
    .role-card__manage--bg{
      width: 702rpx;
      height: 190rpx;
      border-radius: 12rpx;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 1;
    }

    .header{
      height: 76rpx;
      width: 100%;
      background: rgba(25,160,61,0.4);
      border-radius: 12px 12px 0px 0px;
      position: relative; z-index: 5;
      .header__title{
        font-size: 24rpx;
        font-weight: 500;
        color: #FFFFFF;
        margin-left: 22rpx;
      }
      .header-tag{
        width: 98rpx;
        height: 42rpx;
        background: linear-gradient(270deg, rgba(255,255,255,0.8) 0%, #FFFFFF 100%);
        border-radius: 100rpx 0px 0px 100rpx;
        font-size: 22rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #32B855;

        .image{
          width: 16rpx;
          height: 16rpx;
          margin-top: 4rpx;
        }
      }

    }

    .content{
      height: 114rpx;
      position: relative; z-index: 5;
      .image{
        margin-left: 24rpx;
        margin-right: 10rpx;
        width: 64rpx;
        height: 64rpx;
        border-radius: 64rpx;
      }
      .content-name{
        font-size: 28rpx;
        font-weight: 500;
        color: #FFFFFF;
        flex-grow: 1;
        max-width: 428rpx;
      }
      .content-role{
        flex-shrink: 0;
        width: fit-content;
        margin-right: 16rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: #FFFFFF;
      }


    }

  }

  .role-card__task{
    position: relative;
    height: 78rpx;
    background: linear-gradient(180deg, #D0FBDB 0%, #FFFFFF 100%);
    border-radius: 12rpx;

    &.role-card__task--top{
      height: 90rpx;
      padding-top: 12rpx;
      border-radius: 0 0 12rpx 12rpx;
      transform: translateY(-12rpx);
      z-index: 0;
    }

    .role-card__task__item{
      position: relative;
      width: 50%;
      &.I--right::after{
        position: absolute;
        content: '';
        width: 0;
        height: 28rpx;
        border-right: 2rpx solid #C6C6C6;
        right: 0;
        top: 8rpx;
      }
      .item-left{
        display: inline-block;
        font-size: 38rpx;
        font-weight: 600;
        color: #1FBE49;
        margin-right: 6rpx;
      }
      .item-right{
        font-size: 24rpx;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}
</style>
