<template>
  <view>
    <ym-group type="info" v-if="data.title">
      <template #title>
        <view class="review-title">
           <image
            v-if="data.bindType == 1"
            class="review-img"
            mode="aspectFit"
            src="@/assets/review/icon1.png"
          />
          <image
            v-else-if="data.bindType == 2"
            class="review-img"
            mode="aspectFit"
            src="@/assets/review/icon2.png"
          />
          <image
            v-else-if="data.bindType == 3"
            class="review-img"
            mode="aspectFit"
            src="@/assets/mine/pdf.png"
          />
          <image
            v-else
            class="review-img"
            mode="aspectFit"
            src="@/assets/review/icon3.png"
          />
          <text>{{ data.title }}</text>
          <view class="apply-time">{{ time.formatTime(data.createTime) || '-' }}</view>
        </view>
      </template>
        <template v-if="data.bindType == 3 || data.bindType == 4">
          <view class="field" >
            <view class="field__label">项目名称：</view>
            <view class="field__value">{{ data.projectName || '-' }}</view>
          </view>
          <view class="field" >
            <view class="field__label">申请人：</view>
            <view class="field__value">{{ data.sourceName || '-' }}</view>
          </view>
        </template>
      <view class="field" v-else>
        <view class="field__label">申请人：</view>
        <view class="field__value">{{ data.sourceName || '-' }}</view>
      </view>
      <!-- <view class="field">
        <view class="field__label">申请时间</view>
        <view class="field__value">{{
          time.formatTime(data.createTime) || '-'
        }}</view>
      </view> -->
      <view class="field" v-if="data.status != '0'">
        <view v-if="data.status == '1'" class="field__label">处理时间：</view>
        <view v-if="data.status == '2'" class="field__label">失效时间：</view>
        <view v-if="data.status == '3'" class="field__label">撤销时间：</view>
        <view class="field__value" v-if="data.status == '2'">{{
          time.formatTime(data.expireTime) || '-'
        }}</view>
        <view
          class="field__value"
          v-if="data.status == '1' || data.status == '3'"
          >{{ time.formatTime(data.updateTime) || '-' }}</view
        >
      </view>
      <view class="field">
        <view class="field__label">状态：</view>

        <ym-tag v-if="data.status == '0'"
                type="yellow">
                {{labels(data.status, statusOptions) || '-'}}
                </ym-tag>
        <ym-tag v-if="data.status == '1'"
                type="primary">
                {{labels(data.status, statusOptions) || '-'}}
                </ym-tag>
        <ym-tag v-if="data.status == '2'"
                type="info">
                {{labels(data.status, statusOptions) || '-'}}
                </ym-tag>
        <ym-tag v-if="data.status == '3'"
                type="purple">
                {{labels(data.status, statusOptions) || '-'}}
                </ym-tag>
      </view>
      <view v-if="data.status == '2' && data.expireReason" class="field" >
        <view class="field__label">失效原因：</view>
        <view class="field__value">{{ data.expireReason}}</view>
      </view>
    </ym-group>
    <view class="f-btn" v-if="data.status == '0'">
      <view class="flex-center green-bg footer-btn" @click="submits">同意</view>
      <text>如未在7天内同意，本次申请将会失效</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useService, useRouter } from '@/plugins/app-core'
import { onLoad } from '@dcloudio/uni-app'
import assets from '@/utils/assets'
import time from '@/utils/time'
const service = useService()
const router = useRouter()
const statusOptions = [
  { label: '待审核', value: '0' },
  { label: '已同意', value: '1' },
  { label: '已失效', value: '2' },
  { label: '已撤销', value: '3' }
]
let id = ''
const data = reactive({
  createTime: '',
  expireTime: null,
  status: '',
  updateTime: '',
  bindType: '',
  sourceName: '',
  title: ''
})
const labels = function (
  value: any,
  list: any,
  valueKey = 'value',
  labelKey = 'label'
) {
  if (value == null) return ''
  const items = list.find((item: any) => {
    let itemValue = item[valueKey]
    if (typeof itemValue === 'number') itemValue = String(itemValue)
    return itemValue === String(value)
  })
  return items ? items[labelKey] : value
}
onLoad(async (props) => {
  id = decodeURIComponent(props.id || '')
  uni.showLoading({})
  const result = await service.review.reviewInfo({ id })
  Object.assign(data, result)
  uni.hideLoading()
})
const submits = async () => {
  await service.review.reviewOperate({ id, operate: 'agree' })
  uni.showToast({
    icon: 'success',
    title: '操作成功'
  })
  setTimeout(() => {
    uni.navigateBack({
      delta: 1
    })
  }, 500)
}
</script>

<style lang="scss" scoped>
.apply-time{
  flex-grow: 1;
  text-align: right;
  color: #999999;
  font-size: 24rpx;
}
::v-deep.group{
  margin: 16rpx 24rpx 0;
  border-radius: 12rpx;
}
::v-deep.group-header{
  display: block !important;
}
::v-deep.group-header__inner{
  width: 100% !important;
  display: block !important;
}
  // .header {
  //   padding: 60rpx 0;
  //   background: #ffffff;
  //   margin-bottom: 20rpx;
  //   &__icon {
  //     display: block;
  //     width: 128rpx;
  //     height: 128rpx;
  //     background: #f2f2f2;
  //     margin: 0 auto;
  //     border-radius: 50%;
  //     margin-bottom: 24rpx;
  //     overflow: hidden;
  //   }
  //   &__name {
  //     font-size: 34rpx;
  //     font-weight: 500;
  //     color: #333333;
  //     line-height: 34rpx;
  //     text-align: center;
  //     margin-bottom: 10rpx;
  //   }
  //   &__desc {
  //     font-size: 24rpx;
  //     font-weight: 400;
  //     color: #999999;
  //     line-height: 36rpx;
  //     letter-spacing: 1rpx;
  //     text-align: center;
  //     margin-bottom: 25rpx;
  //   }
  //   &__btns {
  //     text-align: center;
  //   }
  // }
  .footer-btn {
    width: 686rpx;
    height: 82rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: 500;
    margin: 0 8rpx;
  }
  .green-bg {
    background: $--ym-bg-primary;
    color: #fff;
  }
  // .text-primary {
  //   color: #00c682;
  // }
  .f-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    text {
      display: block;
      font-size: 26rpx;
      text-align: center;
      margin-top: 26rpx;
      color: #ffaa1e;
    }
  }
  // .header-btn {
  //   display: inline-block;
  //   width: 226rpx;
  //   height: 82rpx;
  //   background: #f8f8f8;
  //   border-radius: 41rpx;
  //   text-align: center;
  //   font-size: 26rpx;
  //   font-weight: 400;
  //   color: #333333;
  //   line-height: 82rpx;
  //   letter-spacing: 1rpx;
  //   user-select: none;
  //   &:active {
  //     opacity: 0.8;
  //   }
  //   &--primary {
  //     color: #00c682;
  //     background: #e7f8f2;
  //   }
  //   & + .header-btn {
  //     margin-left: 14rpx;
  //   }
  // }

  .field {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 20rpx;
    word-break: break-word;
    &:last-child {
      margin-bottom: 0;
    }
    &__label {
      white-space: nowrap;
      flex: 0 0 150rpx;
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

  // .header-icon {
  //   display: block;
  //   width: 100%;
  //   height: 100%;
  // }
  .review-title {
    display: flex;
    align-items: center;
    .review-img {
      width: 54rpx;
      height: 54rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }
  }
</style>
