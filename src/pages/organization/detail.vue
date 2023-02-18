<template>
  <view class="page">

    <view class="header" :class="{'enable-state': data.enable === 1}">
      <image class="chengxinzhishu-bg" src="@/assets/mine/chengxinzhishu-bg.png"></image>

      <view class="chengxinzhishu-wrapper">
      <view class="header__icon">
        <image class="header-icon" mode="aspectFit" :src="assets(data.logo)" alt="" />
      </view>
      <view class="header__name">{{ data.shortName }}</view>
      <block v-if="data.enable === 0">
        <view class="header__desc">
          <view class="flex ai-center jc-center" @click="goCredibility">
            <image class="chengxinzhishu-icon" src="@/assets/mine/chengxin-icon.png"></image>
            <text>诚信指数</text>
            <text class="text-primary u-m-r-10 u-m-l-10 bold">100</text>
            <view class="ym-arrow-box">
              <view class="ym-arrow-icon"></view>
            </view>
          </view>
        </view>
        <view class="header__btns">
          <view class="header-btn header-btn--primary" @click="router.push({ path: '/pages/mine/relation', query: { id: data.id } })">
            <image class="header-btn-left" src="../../assets/mine/relation-green.png"></image>
            <text> 关系图谱</text>
          </view>
          <view class="header-btn" @click="sayHello">
            <image class="header-btn-left" src="../../assets/mine/chat.png"></image>
            打招呼
          </view>
        </view>
      </block>
      <view v-else class="fs-26 text-color-secondary text-center u-m-t-50">很抱歉，此用户已被禁止～</view>
      </view>
    </view>

    <block v-if="data.enable === 0">
    <ym-group title="投资偏好" type="info">
      <view class="field">
        <view class="field__label">关注地区</view>
        <view class="field__value">{{ mapJoin(data.focusAreasStr, 'cityIdStr') }}</view>
      </view>
      <view class="field">
        <view class="field__label">投资领域</view>
        <view class="field__value">{{ mapJoin(data.investFieldsStr, 'itemName') }}</view>
      </view>
      <view class="field">
        <view class="field__label">投资轮次</view>
        <view class="field__value">{{ mapJoin(data.investRoundsStr, 'itemName') }}</view>
      </view>
      <view class="field">
        <view class="field__label">单笔投额</view>
        <view class="field__value">{{ append(data.investment, '') }}</view>
      </view>
    </ym-group>

    <ym-group title="基本信息" type="info">
      <view class="field">
        <view class="field__label">公司名称</view>
        <view class="field__value">{{ data.fullName }}</view>
      </view>
      <view class="field">
        <view class="field__label">联系电话</view>
        <view class="field__value">{{ data.contactPhone || '不公开' }}</view>
      </view>
      <view class="field">
        <view class="field__label">邮箱地址</view>
        <view class="field__value">{{ data.contactEmail || '不公开' }}</view>
      </view>
      <view class="field">
        <view class="field__label">所属地区</view>
        <view class="field__value">
          <span v-if="data.location">{{ data.location.address }}</span>
          <span v-else>不公开</span>
        </view>
      </view>
    </ym-group>
    <ym-group title="机构简介" type="info">
      <view class="field">
        <view class="field__value2 ym-text-pre-wrap">{{ data.introduction }}</view>
      </view>
    </ym-group>
  </block>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useService, useRouter } from '@/plugins/app-core'
import { onLoad } from '@dcloudio/uni-app'
import assets from '@/utils/assets'
import { getIdentity } from '@/utils/subToken'
const service = useService()
const router = useRouter()

const data: any = reactive({
  contactPhone: '',
  contactEmail: '',
  id: '',
  investRoundsStr: [] as { itemName: string }[],
  focusAreasStr: [] as { cityIdStr: string }[],
  introduction: '',
  shortName: '',
  logo: '',
  fullName: '',
  location: null as { name: string, address: string } | null,
  investFieldsStr: [] as { itemName: string }[],
  investment: null,
  enable:0   // 启用状态 0启用 1禁用	
})

onLoad(async (props) => {
  const id = decodeURIComponent(props.id || '')
  const result = await service.organization.getOrganizationInfo({ id })
  Object.assign(data, result)
})

function mapJoin (array: Array<{ [key: string]: any }>, key: string) {
  return array.map((item) => item[key]).join('、')
}

function append (value: string, unit: string = '') {
  return value ? `${value}${unit}` : ''
}

const goCredibility = () => {
  uni.navigateTo({	url: `/pages/mine/credibility?logo=${data.logo}&name=${data.shortName}` })
}

const sayHello = async () => {
  if (!await getIdentity()) {
    uni.showModal({
      title: '认证提示',
      content: '该权限需要先认证身份，你要现在就去认证吗',
      confirmText: '去认证',
      cancelText: '再等等',
      success (res) {
        if (res.confirm) {
          uni.navigateTo({ url: '/pages/mine/certification' })
        }
      }
    })
  } else {
    uni.navigateTo({ url: `/pages/message/chat?contact=${data.id}` })
  }
}
</script>

<style lang="scss" scoped>
.page{
   padding-bottom: 50rpx;
}
::v-deep.group{
  margin: 0 24rpx 20rpx;
  border-radius: 12rpx;
}
.header {
  padding: 55rpx 0 30rpx;
  background: #ffffff;
  margin: 20rpx 24rpx;
  border-radius: 12rpx;
  position: relative;
  overflow: hidden;
  height: 364rpx;

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

  .header-btn-left {
    width: 28rpx;
    height: 28rpx;
    transform: translateY(4rpx);
  }

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
  &:last-child {
    margin-bottom: 0;
  }

  &__label {
    white-space: nowrap;
    padding-right: 60rpx;
    font-size: 26rpx;
    font-weight: 400;
    color: #999999;
    line-height: 40rpx;
    letter-spacing: 1rpx;
  }

  &__value {
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;
    line-height: 40rpx;
    letter-spacing: 1rpx;
    text-align: right;
  }
   &__value2 {
    font-size: 26rpx;
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
