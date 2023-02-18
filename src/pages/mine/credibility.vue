<template>
  <view class="page">

    <view class="header">
      <image class="chengxinzhishu-bg" src="@/assets/mine/chengxinzhishu-bg.png"></image>
      <view class="chengxinzhishu-wrapper">
        <view class="header__icon">
        <image class="header-icon" mode="aspectFit" v-if="data.logo && data.logo!=='null'" :src="assets(data.logo)"></image>
        <image class="header-icon" mode="aspectFit" v-else src="../../assets/mine/default.png"></image>
      </view>
      <view class="header__name">{{ data.name }}</view>
      <view class="header__desc">
        <view class="flex ai-center jc-center" @click="router.push({ path: '/pages/organization/credibility' })">
          <image class="chengxinzhishu-icon" src="@/assets/mine/chengxin-icon.png"></image>
          <text>诚信指数</text>
          <text class="text-primary u-m-r-10 u-m-l-10 bold">{{ data.total }}</text>
        </view>
      </view>
      </view>

    </view>

    <ym-group type="info">
      <template #title>
        <view class="ym-group-title">
          <text>明细</text>
          <text>诚信指数</text>
        </view>
      </template>
      <view v-for="item in data.detailed" :key="item.label" class="field">
        <view v-if="data.total!==0" class="field__label">{{ item.label }}</view>
        <view v-if="data.total!==0" class="field__value">
          <text class="number" :class="{ 'is-negative': item.value < 0 }">{{ positiveNumberMeets(item.value) }}</text>
        </view>
      </view>
    </ym-group>

<!--     <ym-group type="info">
      <template #title>
        <view class="ym-group-title">
          <text>年份</text>
          <text>诚信指数</text>
        </view>
      </template>
      <view v-for="item in data.statistics" :key="item.year" class="field">
        <view class="field__label">{{ item.year }}</view>
        <view class="field__value">
          <text class="number" :class="{ 'is-negative': item.value < 0 }">{{ positiveNumberMeets(item.value) }}</text>
        </view>
      </view>
    </ym-group> -->
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useService, useRouter } from '@/plugins/app-core'
import { onLoad } from '@dcloudio/uni-app'
import assets from '@/utils/assets'
const service = useService()
const router = useRouter()

const data: any = reactive({
  logo: '',
  name: '',
  total: 100,
  detailed: [
    { label: '认证成功', value: 100 }
  ],
  statistics: [
    { year: '2019', value: 100 },
    { year: '2018', value: 80 }
  ]
})

onLoad(async (props) => {
  data.logo = props.logo
  data.name = props.name

  const result = await service.user.getCurrentUserInfo()
  if (result.realName) {
    data.total = 100
  } else {
    data.total = 0
  }
})

const positiveNumberMeets = function (number: number) {
  return number > 0 ? `+${number}` : `${number}`
}
</script>

<style lang="scss" scoped>
.page{
   padding-bottom: 50rpx;
}
::v-deep.ym-group-title{
  letter-spacing: 1rpx;
}
::v-deep.group{
  margin: 20rpx 24rpx;
  border-radius: 12rpx;
}

.header {
  padding: 55rpx 0 30rpx;
  background: #ffffff;
  margin: 20rpx 24rpx;
  border-radius: 12rpx;
  position: relative;
  overflow: hidden;
  height: 256rpx;

  &__icon {
    display: block;
    width: 128rpx;
    height: 128rpx;
    background: #F2F2F2;
    margin: 0 auto;
    border-radius: 50%;
    margin-bottom: 24rpx;
    overflow: hidden;
  }

  &__name {
    font-size: 34rpx;
    font-weight: 500;
    color: #333333;
    line-height: 34rpx;
    text-align: center;
    margin-bottom: 16rpx;
  }

  &__desc {
    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    line-height: 36rpx;
    text-align: center;
    margin-bottom: 25rpx;
  }

  &__btns {
    text-align: center;
  }
}

.text-primary {
  color: #00C682;
}

.header-btn {
  display: inline-block;
  width: 226rpx;
  height: 82rpx;
  background: #F8F8F8;
  border-radius: 41rpx;
  text-align: center;
  font-size: 26rpx;
  font-weight: 400;
  color: #333333;
  line-height: 82rpx;
  letter-spacing: 1rpx;
  user-select: none;

  &:active {
    opacity: 0.8;
  }

  &--primary {
    color: #00C682;
    background: #E7F8F2;
  }

  &+.header-btn {
    margin-left: 14rpx;
  }
}

.field {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20rpx;
  word-break: break-word;
  &:last-child {
    margin-bottom: 0;
  }

  &__label {
    white-space: nowrap;
    padding-right: 60rpx;
    white-space: nowrap;
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
  }

  &__value {
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
  }
}

.header-icon {
  display: block;
  width: 100%;
  height: 100%;
}

.ym-group-title {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.number {
  color: $--ym-color-primary;
  .is-negative {
    color: $--ym-color-warning;
  }
}
</style>
