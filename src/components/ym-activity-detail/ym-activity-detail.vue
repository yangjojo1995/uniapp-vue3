<template>
  <view class="detail">
    <view class="touch" v-if="item.reason">    
      <view class="touch-title">提前结束原因：{{item.reason}}</view>
    </view>
    <view class="touch red" v-if="item.downReason">
      <view class="touch-title">下架原因：{{item.downReason}}</view>
    </view>
    
    <view class="ym-card">
      <view class="detail-banner">
          <image  class="banner-image" v-if="item.image" :src="assets(item.image)"  @click="previewImg(item.image)" mode="aspectFit" />
          <image  class="banner-image" v-else :src="projectDefaultImg" mode="aspectFit" />
          <ym-activity-tag :y="-32"></ym-activity-tag>
        </view>
    </view>
    
    <view class="detail-wrap">

      <view class="ym-card">
        <view class="detail-base">
          <view class="detail-base-title">{{item.title}}</view>
          <view class="detail-base-row">
            <view class="detail-base-row-label">地址</view>
            <view class="detail-base-row-value">{{item.address}}</view>
          </view>
          <view class="detail-base-row">
            <view class="detail-base-row-label">时间</view>
            <view class="detail-base-row-value yellow"> {{formatTimeQuantum(item.beginTime, item.endTime)}}</view>
          </view>
          <view class="detail-base-row" v-if="item.director">
            <text class="detail-base-row-label">指导单位</text>
            <text class="detail-base-row-value">{{item.director || '-'}}</text>
          </view>
          <view class="detail-base-row">
            <text class="detail-base-row-label">主办方</text>
            <text class="detail-base-row-value">{{item.organizer}}</text>
          </view>
          <view class="detail-base-row"  v-if="item.undertaker">
            <text class="detail-base-row-label">承办方</text>
            <text class="detail-base-row-value">{{item.undertaker || '-'}}</text>
          </view>
          <view class="detail-base-row"  v-if="item.supporter">
            <text class="detail-base-row-label">支持单位</text>
            <text class="detail-base-row-value">{{item.supporter || '-'}}</text>
          </view>
          <view class="detail-base-row" v-if="item.publisherInfo&&item.publisherInfo.name">
            <view class="detail-base-row-label">发布人</view>
            <image class="company" :src="assets(item.publisherInfo?.avatar)" @click="toCompanyDetail(item.publisherInfo)" />
            <text class="detail-base-row-value blue" @click="toCompanyDetail(item.publisherInfo)">{{ item.publisherInfo?.name }}</text>
          </view>
          <view class="detail-base-row"></view>
        </view>
      </view>


      <view class="detail-info ym-card">
        <view class="detail-info-title">活动详情</view>
        <view class="detail-info-content"  v-html="contentHtml"></view>

        <!-- 活动图片 -->
        <image @click="previewImg(p, item.pictures )" class="detail-info-image" mode="widthFix" v-for="(p,i) in item.pictures" :key="i" :src="assets(p)"></image>
      </view>

    </view>

  </view>
</template>

<script setup lang="ts">
import assets from '@/utils/assets'
import projectDefaultImg from '@/assets/mine/project-default.png'
import dayjs from 'dayjs'
import { useRouter } from '@/plugins/app-core'
import {computed} from 'vue'
import { previewImg  } from "@/utils/preview";

const router = useRouter()

const props = defineProps<{
  index:Number,
  item: any
}>()
const contentHtml = computed(()=> props.item.content?props.item.content.replace(/\n/g, '<br/>'):'')

function formatTimeQuantum(begin: number, end: number){
  if(dayjs(begin).format('YYYY-MM-DD') == dayjs(end).format('YYYY-MM-DD')){
    return dayjs(begin).format('YYYY-MM-DD HH:mm') + ' ~ ' + dayjs(end).format('HH:mm')
  }else if(dayjs(begin).format('YYYY') == dayjs(end).format('YYYY')){
    return dayjs(begin).format('YYYY-MM-DD HH:mm') + ' ~ ' + dayjs(end).format('MM-DD HH:mm')
  }else{
    return dayjs(begin).format('YYYY-MM-DD HH:mm') + ' ~ ' + dayjs(end).format('YYYY-MM-DD HH:mm')
  }
}

// 跳转发布人页面
const toCompanyDetail = function (publisherInfo: any): void {
  let {accountRole, id} = publisherInfo
  if (typeof id !== 'string') return

  if (accountRole === 2) {
    router.push({ path: '/pages/organization/detail', query: { id } })
  } else if (accountRole === 3) {
    router.push({ path: '/pages/company/detail', query: { id } })
  } else if (accountRole === 4) {
    router.push({ path: '/pages/observer/detail', query: { id } })
  } else if (accountRole === 1) {
    router.push({ path: '/pages/manager/detail', query: { id } })
  }
}

</script>

<style lang="scss" scoped>

.detail{

  .detail-banner{
    width: 100%;
    height: 350rpx;
    overflow: hidden;
    position: relative;

    .banner-image {
      width: 100%;
      height: 350rpx;
    }

  }
  .detail-wrap {

    .detail-base{
      padding: 32rpx 32rpx 8rpx;

      .detail-base-title{
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
        margin: 8rpx 0;
      }

      .detail-base-row{
        margin: 28rpx 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        font-weight: 400;
        font-size: 26rpx;
        max-width: 686rpx;

        .detail-base-row-label{
          flex: 0 0 128rpx;
          text-align: left;
          color: #999999;
        }

        .detail-base-row-value{
          color: #666666;
          max-width: 558rpx;
          word-break: break-all;
        }
      }
    }

    .detail-info{
      background: #fff;
      padding: 32rpx 24rpx;
      box-sizing: border-box;
      margin-top: 20rpx;

      .detail-info-title{
        font-size: 28rpx;
        font-weight: 500;
        color: #333333;
        margin: 8rpx 0 20rpx;
      }
      .detail-info-content{
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
        line-height: 40rpx;
      }
      .detail-info-image{
        width: 100%;
        border-radius: 12rpx;
        margin-top: 12rpx;
      }
    }
    
  }
}

.company {
  width: 74rpx;
  min-width: 74rpx;
  height: 74rpx;
  background: #F2F2F2;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 24rpx;
}

.touch{
  background: #FFF2DE;
  padding: 16rpx 32rpx;
  margin: 0rpx 0 20rpx;
  
  .touch-title{
    font-size: 28rpx;
    font-weight: 500;
    color: #FF9F00;
    margin: 8rpx 0 12rpx;
  }

  .touch-group{
    font-size: 24rpx;
    font-weight: 400;
    color: #FF9F00;
    margin: 16rpx 0;
  }
}

.touch.red {
  background: #FFEBEB;

  .touch-title{
    background: #FFEBEB;
    color: #FF2620;
  }
}


</style>
