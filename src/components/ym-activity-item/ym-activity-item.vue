<template>
  <view class="activity-group" @click.stop="emit('item-click', item, $event)">
    <view class="activity-group-img">
      <image :src="item.image ? assets(item.image) : projectDefaultImg" mode="aspectFill" />
      <ym-activity-tag :status="item.status"></ym-activity-tag>
    </view>
    <view class="activity-group-title flex-between">
      <view class="text-nowrap">{{item.title}}</view>
      <view class="ym-arrow-icon"></view>
    </view>
    <view class="activity-group-row">
      <image src="../../assets/activity/time.png"></image>
      {{formatTimeQuantum(item.beginTime, item.endTime)}}
      
    </view>
    <view class="activity-group-row text-nowrap">
      <image src="../../assets/activity/local.png"></image>
      {{item.address}}
    </view>
    <view class="activity-group-row" v-if="item.view!==null" style="padding-bottom: 12rpx">
      <image src="../../assets/activity/view.png"></image>
      {{item.view}}次 预览
    </view>
    <div class="activity-group-footer" v-if="$slots.buttons">
     <slot name="buttons"></slot>
    </div>
  </view>
</template>

<script setup lang="ts">
import assets from '@/utils/assets'
import projectDefaultImg from '@/assets/mine/project-default.png'
import dayjs from 'dayjs'

function formatTimeQuantum(begin: number, end: number){
  if(dayjs(begin).format('YYYY-MM-DD') == dayjs(end).format('YYYY-MM-DD')){
    return dayjs(begin).format('YYYY-MM-DD HH:mm') + ' ~ ' + dayjs(end).format('HH:mm')
  }else if(dayjs(begin).format('YYYY') == dayjs(end).format('YYYY')){
    return dayjs(begin).format('YYYY-MM-DD HH:mm') + ' ~ ' + dayjs(end).format('MM-DD HH:mm')
  }else{
    return dayjs(begin).format('YYYY-MM-DD HH:mm') + ' ~ ' + dayjs(end).format('YYYY-MM-DD HH:mm')
  }
}

const props = defineProps<{
  item: Object
}>()

const emit = defineEmits<{
  (e: 'item-click', item: Object, event: any): void
}>()
</script>

<style lang="scss" scoped>
.activity-group{
  background: #fff;
  margin: 20rpx 24rpx;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 24rpx;

  .activity-group-img{
    width: 654rpx;
    height: 305rpx;
    border-radius: 12rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
      border-radius: 12rpx;
      overflow: hidden;
    }
  }

  .activity-group-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    margin: 24rpx 0 12rpx;
    
  }

  .activity-group-row{
    font-size: 24rpx;
    font-weight: 400;
    color: #666;
    padding: 6rpx 0;    

    image {
      width: 36rpx;
      height: 36rpx;
      transform: translateY(8rpx);
      margin-right: 8rpx;
    }
  }

  .activity-group-footer{
    height: 90rpx;
    width: 100%;
    border-top: 1px solid #F2F2F2;
  }
}
</style>
