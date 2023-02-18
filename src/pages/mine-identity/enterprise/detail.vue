<template>
  <view>

    <view class="header">
      <view class="header__icon">
        <image class="header-icon" mode="aspectFit" src="https://cdn.seovx.com/ha/?mom=302" alt="" />
      </view>
      <view class="header__name">某某基金</view>
      <view class="header__desc">
        <text @click="router.push({ path: '/pages/organization/credibility' })">
          <text>诚信指数：</text>
          <text class="text-primary">100</text>
        </text>
      </view>
      <view class="header__btns">
        <view class="header-btn header-btn--primary" @click="router.push({ path: '/pages/organization/relation' })">关系图谱</view>
        <view class="header-btn" @click="sayHello">打招呼</view>
      </view>
    </view>

    <ym-group title="投资偏好" type="info">
      <view class="field">
        <view class="field__label">关注地区</view>
        <view class="field__value">广州市、深圳市</view>
      </view>
      <view class="field">
        <view class="field__label">投资领域</view>
        <view class="field__value">科技</view>
      </view>
      <view class="field">
        <view class="field__label">投资轮次</view>
        <view class="field__value">A轮，B轮</view>
      </view>
      <view class="field">
        <view class="field__label">单笔投额</view>
        <view class="field__value">500万-1000万元</view>
      </view>
      <view class="field">
        <view class="field__label">归属地区</view>
        <view class="field__value">广东省广州市天河区xxxx</view>
      </view>
    </ym-group>

    <ym-group title="基本信息" type="info">
      <view class="field">
        <view class="field__label">公司名称</view>
        <view class="field__value">广州市xx公司（全称）</view>
      </view>
      <view class="field">
        <view class="field__label">联系电话</view>
        <view class="field__value">不公开</view>
      </view>
      <view class="field">
        <view class="field__label">邮箱地址</view>
        <view class="field__value">不公开</view>
      </view>
      <view class="field">
        <view class="field__label">所属地区</view>
        <view class="field__value">广东省广州市</view>
      </view>
    </ym-group>
    <ym-group title="机构简介" type="info">
      <view class="field">
        <view class="field__value">这里是投资机构简介，这里是投资机构简介，这里是投资机构简介，这里是投资机构简介</view>
      </view>
    </ym-group>
  </view>
</template>

<script setup lang="ts">
import { router } from '@/plugins/app-core'
import { getIdentity } from '@/utils/subToken'

const sayHello = async () => {
  if (!await getIdentity()) {
    uni.showModal({
      title: '认证提示',
      content: '该权限需要先认证身份，你要现在就去认证吗',
      confirmText: '去认证',
      cancelText: '再等等',
      success (res) {
        if (res.confirm) {
          uni.navigateTo({ url: `/pages/mine/certification` })
        }
      }
    })
  } else {
    uni.navigateTo({ url: `/pages/message/chat?contact=${data.id}` })
  }
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
  & + .header-btn {
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
</style>
