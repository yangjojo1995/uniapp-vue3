<template>
  <view class="page">
    <uni-segmented-control
      :current="current"
      :values="items"
      @clickItem="onClickItem"
      styleType="text"
      activeColor="#12C287"
    ></uni-segmented-control>
    <view class="content">
      <view>
        <ym-list-item
         :interval="true"
          v-for="item in listPagingLazy.list"
          :key="item.id"
          :noThumb="false"
          :clickable="true"
          @click="handleClick(item)"
        >
          <template #name>
            <view class="review-title">
              <div class="review-title-left">
                <image
                  v-if="item.title === '挂靠机构申请'"
                  class="review-img"
                  mode="aspectFit"
                  src="@/assets/review/icon1.png"
                />
                <image
                  v-else-if="item.title === '办事子账号邀请'"
                  class="review-img"
                  mode="aspectFit"
                  src="@/assets/review/icon2.png"
                />
                <image
                  v-else
                  class="review-img"
                  mode="aspectFit"
                  src="@/assets/review/icon3.png"
                />
                <text>{{ item.title }}</text>

                <ym-tag v-if="item.status == '0'" class="u-m-l-30" type="yellow">待审核</ym-tag>
                <ym-tag v-if="item.status == '1'" class="u-m-l-30" type="primary">已同意</ym-tag>
                <ym-tag v-if="item.status == '2'" class="u-m-l-30" type="info">已失效</ym-tag>
                <ym-tag v-if="item.status == '3'" class="u-m-l-30" type="purple">已撤销</ym-tag>
              </div>

              <view class="ym-arrow-box">
                <view class="ym-arrow-icon"></view>
              </view>
            </view>
          </template>
          <template #content>
            <view class="field-container">
              <view class="field">
                <view class="field__label">申请时间：</view>
                <view class="field__value">
                  <text>{{ time.formatTime(item.createTime) }}</text>
                </view>
              </view>
              <view class="field">
                <view class="field__label">处理人：</view>
                <view class="field__value">
                  <text style="white-space:normal">{{ item.targetName || '-' }}</text>
                </view>
              </view>
              <view class="field" v-if="item.expireReason">
                <view class="field__label">失效原因：</view>
                <view class="field__value">
                  <text style="white-space:normal">{{ item.expireReason || '-' }}</text>
                </view>
              </view>
            </view>
          </template>
        </ym-list-item>
        <ym-empty
          v-if="listPagingLazy.isEmpty"
          text="暂无数据"
          mode="list"
        ></ym-empty>
        <uni-load-more
          v-else
          :status="listPagingLazy.loadStatus"
        ></uni-load-more>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  onLoad,
  onReady,
  onPullDownRefresh,
  onReachBottom,
  onShow
} from '@dcloudio/uni-app'
import {
  useService,
  useConfig,
  useRouter,
  getUserInfo
} from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import assets from '@/utils/assets'
import time from '@/utils/time'
const router = useRouter()
const service = useService()
const current = ref(0)
const filterData = reactive({ status: '0' })
const items = ['待审核', '已同意', '已失效', '已撤销', '全部']
// 分页
const listPagingLazy = reactive(
  new PagingLazy(async function (page, size) {
    const { total, records } = await service.review.reviewSearch({
      page,
      size,
      type: 'source',
      ...filterData
    })
    return { total, records }
  })
)

onShow(async () => {
  listPagingLazy.refresh()
})

onReachBottom(() => listPagingLazy.next())
onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh()
})

const userInfo = ref()
onLoad(async () => {
  userInfo.value = await getUserInfo()
})
const handleClick = function (item: any) {
  if (!userInfo.value) {
    return uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) router.push('/pages/login/login')
      }
    })
  }
  router.push({
    path: '/pages/application/detail',
    query: { id: item.id }
  })
}
const onClickItem = function (e: any) {
  if (current.value != e.currentIndex) {
    current.value = e.currentIndex
    if (current.value === 4) {
      filterData.status = ''
    } else {
      filterData.status = current.value + ''
    }
    listPagingLazy.refresh()
  }
}
</script>

<style lang="scss" scoped>
::v-deep.list-item{
  &::after{
    display:none;
  }
}
  .header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    background-color: #ffffff;
  }

  .page-list {
    margin-top: 20rpx;
  }
  .content {
    margin-top: 20rpx;
  }
  .field-container {
    width: 100%;
  }

  .field {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    margin-top: 8rpx;
    word-break: break-word;

    &__label {
      white-space: nowrap;
      padding-right: 8rpx;
      flex: 0 0 120rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #999999;
      line-height: 24rpx;
      letter-spacing: 1rpx;
    }

    &__value {
      flex: 1;
      font-size: 26rpx;
      font-weight: 400;
      color: #666666;
      line-height: 30rpx;
      letter-spacing: 1rpx;

      text {
        display: inline-block;
        box-sizing: border-box;
        padding-right: 10rpx;
        border-right: 1rpx solid #c6c6c6;
        margin-right: 10rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:last-child {
          padding-right: 0;
          border-right: 0;
          margin-right: 0;
        }
      }
    }
  }

  .credibility {
    white-space: nowrap;
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 42rpx;
    letter-spacing: 1rpx;

    text {
      margin-left: 6rpx;
    }
  }
  .review-title {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
    justify-content: space-between;
    width: 100%;
    .review-title-left {
      display: flex;
      align-items: center;
    }
    .review-img {
      width: 54rpx;
      height: 54rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }
    .btn-primary {
      color: #ffa300;
      background: rgba(255, 163, 0, 0.1);
      border: 2rpx solid rgba(255, 163, 0, 0.3);
    }
    .btn-success {
      color: #4db355;
      background: rgba(77, 179, 85, 0.1);
      border: 2rpx solid rgba(77, 179, 85, 0.3);
    }
    .btn-warning {
      color: #999999;
      background: rgba(153, 153, 153, 0.1);
      border: 2rpx solid rgba(153, 153, 153, 0.3);
    }
  }

  .region-city-panel {
    width: 100%;
    background-color: #ffffff;

    &__inner {
      flex: 0 0 auto;
      height: 60vh;
      // height: calc(100vh - 300rpx);
    }

    &__btns {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
