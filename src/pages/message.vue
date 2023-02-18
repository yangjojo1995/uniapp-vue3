<template>
  <view class="content">
    <view class="group">
      <view class="group__title">系统消息</view>
      <view class="group__content">

        <view class="card" @click="router.push('/pages/announcement/list')">
          <view class="card-icon">
            <view v-if="notice.badge" class="card-icon-badge"></view>
            <image mode="aspectFit" src="@/assets/message/icon_1.png" />
          </view>
          <view class="card-content">
            <view class="card-content-header">
              <view class="card-content-header-title">公告</view>
            </view>
            <view class="card-content-detail" v-if="notice.datetime">{{ notice.content }}</view>
          </view>
          <view class="ym-arrow-box">
            <view class="ym-arrow-icon" style="width: 32rpx; height: 32rpx;"></view>
          </view>
        </view>

        <view class="card" @click="router.push('/pages/notify/list')">
          <view class="card-icon">
            <view v-if="notify.badge" class="card-icon-badge"></view>
            <image mode="aspectFit" src="@/assets/message/icon_2.png" />
          </view>
          <view class="card-content">
            <view class="card-content-header">
              <view class="card-content-header-title">通知</view>
              <!-- <view class="card-content-header-time" v-if="notify.datetime">{{ fromNowLocal(notify.datetime) }}</view> -->
            </view>
            <view class="card-content-detail"  v-if="notify.content">{{ notify.content }}</view>
          </view>
          <view class="ym-arrow-box">
            <view class="ym-arrow-icon" style="width: 32rpx; height: 32rpx;"></view>
          </view>
        </view>

        <view class="card" @click="router.push('/pages/mine/cooperation/cooperation')">
          <view class="card-icon">
            <view v-if="assist.badge" class="card-icon-badge"></view>
            <image mode="aspectFit" src="@/assets/message/icon_3.png" />
          </view>
          <view class="card-content">
            <view class="card-content-header">
              <view class="card-content-header-title">协助确权</view>
             <!--  <view class="card-content-header-time" v-if="assist.datetime">{{ fromNowLocal(assist.datetime) }}</view> -->
            </view>
            <view class="card-content-detail"  v-if="assist.content">{{ assist.content }}</view>
          </view>
          <view class="ym-arrow-box">
            <view class="ym-arrow-icon" style="width: 32rpx; height: 32rpx;"></view>
          </view>
        </view>

        <view class="card" @click="router.push('/pages/review/list')">
          <view class="card-icon">
            <view v-if="agency.badge" class="card-icon-badge"></view>
            <image mode="aspectFit" src="@/assets/message/icon_4.png" />
          </view>
          <view class="card-content">
            <view class="card-content-header">
              <view class="card-content-header-title">待办审核</view>
              <!-- <view class="card-content-header-time" v-if="agency.datetime">{{ fromNowLocal(agency.datetime) }}</view> -->
            </view>
            <view class="card-content-detail"  v-if="agency.content">{{ agency.content }}</view>
          </view>
          <view class="ym-arrow-box">
            <view class="ym-arrow-icon" style="width: 32rpx; height: 32rpx;"></view>
          </view>
        </view>

      </view>
    </view>

    <view v-if="identity" class="group">
      <view class="group__title">盟聊消息</view>
      <view class="group__content">

        <view class="card"  v-for="item in contactList" :key="item.id" 
           @click="router.push({ path: '/pages/message/chat', query: { contact: item.id } })">
          <view class="card-icon">
            <view v-if="item.badge" class="card-icon-tab">{{ item.badge > 99 ? '99+' : item.badge }}</view>
            <image mode="aspectFit" :src="assets(item.avatar)" />
          </view>
          <view class="card-content">
            <view class="card-content-header">
              <view class="card-content-header-title">
                <span>{{ item.name }}</span>
                <span class="card-content-header-title-tip" v-if="item.title"> / {{ item.title }}</span>
              </view>
              <view class="card-content-header-time">{{ fromNowLocal(item.datetime) }}</view>
            </view>
            <view class="card-content-detail" >{{ item.message }}</view>
          </view>
        </view>
        <ym-empty v-if="!contactList.length" title="暂无消息" type="message"></ym-empty>

      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onHide, onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { useService, useRouter } from '@/plugins/app-core'
import { fromNowLocal } from '@/utils/dayjs'
import assets from '@/utils/assets'
import { getIdentity } from '@/utils/subToken'
import socket from '@/utils/socketXctm'

const router = useRouter()
const service = useService()

// tab红点
onShow(async () => {
  const unRead = await service.message.getUnRead()
  if (unRead) {
    uni.showTabBarRedDot({ index: 2 })
  } else {
    uni.hideTabBarRedDot({ index: 2 })
  }
})

// 公告
const notice = reactive({ badge: 0, content: '', datetime: '' })
onShow(async () => {
  const result = await service.notice.getNoticeLatest()
  notice.badge = result?.read === false ? 1 : 0
  notice.content = result?.title || '暂无公告'
  notice.datetime = result?.createTime || ''
})

// 通知
const notify = reactive({ badge: 0, content: '', datetime: '' })
onShow(async () => {
  const result = await service.notify.getNotifyLast()
  notify.badge = result?.read === '1' ? 1 : 0
  notify.content = result?.content || result?.title || '暂无通知'
  notify.datetime = result?.createTime || ''
})

// 协助确权
const assist = reactive({ badge: 0, content: '', datetime: '' })
onShow(async () => {
  const result = await service.message.getAssistLast()
  assist.badge = result?.read === '1' ? 1 : 0
  assist.content = result?.content || result?.title || '暂无协助确权'
  assist.datetime = result?.createTime || ''
})


// 待办审核
const agency = reactive({ badge: 0, content: '', datetime: '' })
onShow(async () => {
  const result = await service.message.getTodoLast()
  agency.badge = result?.read === '1' ? 1 : 0
  agency.content = result?.content || result?.title || '暂无待办审核'
  agency.datetime = result?.createTime || ''
})

// 联系人列表
const contactList = reactive([] as any[])
const onContactList = (result: any) => {
  contactList.splice(0, contactList.length, ...result.map((item: any) => {
    return {
      id: item.contact,
      badge: Number(item.unReadNum || 0),
      avatar: item.icon,
      name: item.contactName,
      title: '',
      message: item.lastContent,
      datetime: item.lastMsgTime
    }
  }))
}
onShow(() => socket.onContactList(onContactList))
onHide(() => socket.offContactList(onContactList))

const identity = ref()
onShow(async () => {
  identity.value = await getIdentity()

  if (identity.value) {
    uni.showLoading({ title: '加载中...' })

    try {
      // 更新未读数
      await socket.getUnReadTotal()
      // 更新联系人列表
      await socket.getContactList()
    } catch (error) {
      console.log(error)
    }
    uni.hideLoading()
  } else {
    contactList.splice(0, contactList.length)
  }
})
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden;
}

.group {
  margin: 40rpx 32rpx 24rpx;

  &__title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333333;
    line-height: 36rpx;
  }

}

.card {
  position: relative;
  display: flex;
  padding: 32rpx;
  width: 686rpx;
  height: 164rpx;
  background: #FFFFFF;
  border-radius: 6rpx;
  margin: 20rpx 0;
  box-sizing: border-box;

  .card-icon{
    position: relative;
    width: 100rpx;
    height: 100rpx;
    margin-right: 28rpx;
    /* background: #EEF8FF; */
    border-radius: 100rpx;

    .card-icon-badge {
      display: block;
      padding: 6rpx;
      background-color: #FF5744;
      position: absolute;
      right: 8rpx;
      top: 8rpx;
      border-radius: 50rpx;
    }

    .card-icon-tab{
      display: block;
      padding: 6rpx;
      min-width: 20rpx;
      text-align: center;
      background-color: #FF5744;
      position: absolute;
      left: 70%;
      top: 0;
      border-radius: 50rpx;
      font-size: 22rpx;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 22rpx;
    }

    image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 100rpx;
    }
  }

  .card-right{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 32rpx;
    height: 100%;
    flex-shrink: 0;
  }

  .card-content {
    max-width: calc(100% - 160rpx);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex-grow: 1;
    

    .card-content-header{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30rpx;
      margin: 10rpx 0;
      
      .card-content-header-title{
        font-size: 30rpx;
        font-weight: 500;
        color: #333333;

        .card-content-header-title-tip{
          font-size: 22rpx;
          font-weight: 400;
          color: #999999;
        }
      }

      .card-content-header-time{
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
      }
    }

    .card-content-detail{
      margin: 10rpx 0;
      font-size: 26rpx;
      font-weight: 400;
      color: #999999;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }
}
</style>
