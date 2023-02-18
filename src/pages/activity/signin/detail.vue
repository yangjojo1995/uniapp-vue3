<template>
  <view>
    <ym-group title="" type="info">
      <view class="field">
        <view class="field__label">报名操作人</view>
        <view class="field__value">{{
          data.operatorInfo ? data.operatorInfo.name : '-'
        }}</view>
      </view>
      <view class="field">
        <view class="field__label">报名时间</view>
        <view class="field__value">{{  time.formatTime(data.createTime) || '-' }}</view>
      </view>
      <view class="field">
        <view class="field__label">姓名</view>
        <view class="field__value">{{ data.participantName || '-' }}</view>
      </view>
     <view class="field">
        <view class="field__label">手机号</view>
        <view class="field__value">{{ data.mobile || '-' }}</view>
      </view>
      <view class="field">
        <view class="field__label">报名人数（人）</view>
        <view class="field__value">{{ data.participantNum || '-' }}</view>
      </view>
      <view class="field">
        <view class="field__label">机构类型</view>
        <view class="field__value">{{
          data.institutionTypeDict ? data.institutionTypeDict.itemName : '-'
        }}</view>
      </view>
      <view class="field">
        <view class="field__label">所在的企业/机构名称</view>
        <view class="field__value">
          <text>{{ data.institutionName || '-' }}</text>
        </view>
      </view>
      <view class="field">
        <view class="field__label">在企业/机构所任职位</view>
        <view class="field__value">{{ data.position || '-' }}</view>
      </view>
    </ym-group>
  </view>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { useService, useRouter } from '@/plugins/app-core'
  import { onLoad } from '@dcloudio/uni-app'
  import assets from '@/utils/assets'
  import time from '@/utils/time'
  const service = useService()
  const router = useRouter()

  const data = reactive({
    createTime: '',
    operatorInfo: { name: '' },
    participantName: '',
    mobile: '',
    position: '',
    participantNum: '',
    institutionTypeDict: { itemName: '' },
    institutionType: '',
    institutionName: '',
    id: '',
    userId: '',
  })

  onLoad(async (props) => {
    const id = decodeURIComponent(props.activityId || '')
    const result = await service.activity.getSignInfo({ id })
    Object.assign(data, result)
  })
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
      background: #f2f2f2;
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
    color: #00c682;
  }

  .header-btn {
    display: inline-block;
    width: 226rpx;
    height: 82rpx;
    background: #f8f8f8;
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
      color: #00c682;
      background: #e7f8f2;
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
      text-align: right;
    }
    &__value2 {
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
