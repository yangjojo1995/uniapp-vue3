<template>
  <view class="page">
    <view class="page-list">
      <ym-list-item
        v-for="item in listPagingLazy.list"
        :key="item.id"
        :noThumb="false"
        :name="item.operatorInfo ? item.operatorInfo.name : '-'"
        :clickable="true"
        @click="handleClick(item)"
      >
        <template #content>
          <view class="field-container">
            <view class="field">
              <view class="field__label">签到姓名</view>
              <view class="field__value">
                <text>{{ item.participantName }}</text>
              </view>
            </view>
            <view class="field">
              <view class="field__label">签到时间</view>
              <view class="field__value">
                <text>{{ time.formatTime(item.createTime) }}</text>
              </view>
            </view>
            <view class="field">
              <view class="field__label">机构类型</view>
              <view class="field__value">
                <text>{{
                  item.institutionTypeDict
                    ? item.institutionTypeDict.itemName
                    : '-'
                }}</text>
              </view>
            </view>
          </view>
        </template>
      </ym-list-item>
    </view>

    <ym-empty
      v-if="listPagingLazy.isEmpty"
      text="暂无数据"
      mode="list"
    ></ym-empty>
    <uni-load-more v-else :status="listPagingLazy.loadStatus"></uni-load-more>
  </view>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue'
  import {
    onLoad,
    onReady,
    onPullDownRefresh,
    onReachBottom,
    onShow,
  } from '@dcloudio/uni-app'
  import {
    useService,
    useConfig,
    useRouter,
    getUserInfo,
  } from '@/plugins/app-core'
  import { PagingLazy } from '@/utils/paging'
  import assets from '@/utils/assets'
  import time from '@/utils/time'
  const router = useRouter()
  const service = useService()

  const filterData = reactive({
    activityId: '',
  })

  // 分页
  const listPagingLazy = reactive(
    new PagingLazy(async function (page, size) {
      const { total, records } = await service.activity.activitySignIn({
        page,
        size,
        ...filterData,
      })
      return { total, records }
    })
  )

  onLoad(async (props) => {
    const id = decodeURIComponent(props.activityId || '')
    filterData.activityId = id
    listPagingLazy.load()
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
        },
      })
    }
    router.push({ path: '/pages/activity/signin/detail', query: { activityId: item.id } })
  }
</script>

<style lang="scss" scoped>
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
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
      line-height: 24rpx;
      letter-spacing: 1rpx;
    }

    &__value {
      flex: 1;
      font-size: 24rpx;
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

  .text-primary {
    color: #00c682;
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
