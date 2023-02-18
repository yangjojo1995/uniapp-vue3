<template>
  <view>

    <view class="header">
      <view class="header__icon">
        <image class="header-icon" mode="aspectFit" :src="assets(data.logo)" alt="" />
      </view>
      <view class="header__name">{{ data.name }}</view>
      <view class="header__desc">
        <text @click="router.push({ path: '/pages/organization/credibility' })">
          <text>当前诚信指数：</text>
          <text class="text-primary">{{ data.total }}</text>
        </text>
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
        <view class="field__label">{{ item.label }}</view>
        <view class="field__value">
          <text class="number" :class="{ 'is-negative': item.value < 0 }">{{ positiveNumberMeets(item.value) }}</text>
        </view>
      </view>
    </ym-group>

    <ym-group type="info">
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
    </ym-group>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useService, useRouter } from '@/plugins/app-core'
import { onLoad } from '@dcloudio/uni-app'
import assets from '@/utils/assets'
const service = useService()
const router = useRouter()

const data = reactive({
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
  const id = decodeURIComponent(props.id || '')
  const result = await service.observer.getObserverInfo({ id })
  data.logo = result.avatar
  data.name = result.shortName
})

const positiveNumberMeets = function (number: number) {
  return number > 0 ? `+${number}` : `${number}`
}
</script>

<style lang="scss" scoped>
.header {
  padding: 60rpx 0;
  background: #ffffff;
  margin-bottom: 20rpx;

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
    margin-bottom: 10rpx;
  }

  &__desc {
    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    line-height: 36rpx;
    letter-spacing: 1rpx;
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
    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    line-height: 40rpx;
    letter-spacing: 1rpx;
  }

  &__value {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
    letter-spacing: 1rpx;
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
  color: #00C682;
  .is-negative {
    color: #ff5555;
  }
}
</style>
