<template>
      <view class="cooperation-item flex ai-center" @click="emit('item-click', item, $event)">
        <view class="avatar-icon">
          <image :src="item.avatar ? assets(item.avatar) : '../../assets/index/nav_3.png'" />
        </view>
        <view class="cooperation-info flex-1">
          <view class="cooperation-header flex ai-center jc-between">
            <text class="cooperation-header-title">{{item.name}}</text>
            <view class="cooperation-btn cooperation-green flex-center" v-if="item.statusStr=='已确权'">
              <span>已确权</span>
            </view>
            <view class="cooperation-btn cooperation-purple flex-center" v-if="item.statusStr=='已撤销'">
              <span>已撤销</span>
            </view>
            <view class="cooperation-btn cooperation-orange flex-center" v-if="item.statusStr=='确权中'">
              <span class="warning"></span> 
              <span>协助确权</span>
              <img class="s-arrow" src="../../assets/mine/arrow-right-bold.png" alt="">
            </view>
          </view>
          <view class="cooperation-row" v-if="item.investInstitution">所属机构 <text class="cooperation-row-value">{{item.investInstitution}}</text></view>
          <view class="cooperation-row" v-if="item.projectName">项目名称 <text class="cooperation-row-value">{{item.projectName}}</text></view>
          <view class="cooperation-row" v-if="item.createTime">申请时间 <text class="cooperation-row-value">{{ time.formatTime(item.createTime) }}</text></view>
      </view>
    </view>  
</template>

<script setup lang="ts">
import assets from '@/utils/assets'
import time from '@/utils/time'
const props = defineProps<{
  showBorder?: boolean
  item: Object
}>()

const emit = defineEmits<{
  (e: 'item-click', item: Object, event: any): void
}>()
</script>

<style lang="scss">
.cooperation-item{
  width: 686rpx;
  height: 204rpx;
  margin: 20rpx 32rpx;
  padding: 32rpx;
  background: #FFFFFF;
  border-radius: 6rpx;
  box-sizing: border-box;
}

.avatar-icon{
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20rpx;
  image{
    width:100%;
    height:100%;
  }
}

.warning{
  background: #FFA300;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right:10rpx;
}
.s-arrow{
  width: 24rpx;
  height: 24rpx;
  margin-left: 6rpx;
}

.cooperation-header{
  align-items: center;
  justify-content: space-between;
  display: flex;
  margin-bottom: 12rpx;

  .cooperation-header-title{
    font-size: 30rpx;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300rpx;
  }
}
.cooperation-row{
  font-size: 24rpx;
  color: #999;
  margin: 6rpx;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 496rpx;

  .cooperation-row-value{
    word-break: break-all;
    margin-left: 10rpx;
    color: #666;
  }
}

.cooperation-btn {
  padding: 6rpx 20rpx;
  font-size: 22rpx;
  font-weight: 400;
  border-radius: 50rpx;
}

.cooperation-orange{
  background: rgba(255, 163, 0, 0.1);
  border: 1px solid rgba(255, 163, 0, 0.3);
  color: #FFA300;
}

.cooperation-green{
  background: #E5F9F2;
  border: 1rpx solid #BAF4DA;
  color: #00CF74;
}

.cooperation-purple{
  background: rgba(112, 79, 220, 0.1);
  border: 1px solid rgba(112, 79, 220, 0.3);
  color: #6B54D4;
}
</style>