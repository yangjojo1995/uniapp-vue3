<template>
  <view
    class="project-item bg-white u-m-t-20"
    :class="isIndex?'project-item-index':'u-p-m'"
    @click="emit('item-click', item, $event)"
  >

    <view class="u-p-x-32 u-p-t-20" :class="projectPool?'project-t-20':''">
      <view class="project-content flex">
        <view class="poster u-m-r-26 u-p-t-14">
          <image
            :src="item.image ? assets(item.image) : projectDefaultImg"
            class="poster-icon"
            mode="aspectFill"
          />
        </view>
        <view class="fs-30 text-color-primary flex-1">
          <view class="flex u-p-t-10">
            <view class="des-text fs-30 bold flex-grow-1">
              {{ item.projectName }}
            </view>
            <view class="flex jc-end ai-center" v-if="myProject">
              <ym-tag :type="item.status == 'draft'
                  ? 'purple'
                  : item.status == 'stop'
                  ? 'info'
                  : 'blue'"> {{ item.statusDict.itemName }}</ym-tag>
            </view>
            <view class="flex jc-end ai-center" v-if="collectProject && item.status == '已停止'">
              <ym-tag type="info"> {{ item.status }}</ym-tag>
            </view>
             <view class="ym-arrow-box" v-if="projectPool">
            <view class="ym-arrow-icon"></view>
          </view>
          </view>

          <view class="tips bold flex">
            <text class="text icons" v-if="item.industryDict">{{item.industryDict.itemName}}</text>
            <text class="text icons" v-if="item.investRoundDict">{{item.investRoundDict.itemName}}</text>
            <text class="text icons" v-if="item.hasBp === 1">BP</text>
            <text class="text icons" v-if="item.assistStr">{{item.assistStr}}</text>
          </view>
          <view v-if="item.orgName" class="tuijian">
            <view class="icon fs-20">
              <image class="tuijian-icon" src="../../assets/project/tuijian_icon2.png"></image>推荐单位
            </view>
            <view class="text fs-20">{{ item.orgName }}</view>
            </view>
          <view class="des-text sm-title"> {{ item.description }}</view>
        </view>
        <!-- <view class=""> -->

        <!-- </view> -->
      </view>
      <view class="flex ai-center jc-between u-p-y-24 footer" v-if="myProject">
        <view class="fs-24 text-color-third flex-1 flex ai-center">
          <text>{{item.view}}查看</text>
          <view class="circle"></view>
          <text class="flex-grow-1">{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm') }} 创建</text>
          <image class="m-icon u-m-r-16" src="../../assets/mine/m-icon.png"  @click.stop="emit('more-click', item, $event)" ></image>
        </view>
      </view>
      <view class="flex ai-center jc-end u-p-y-24 footer" v-if="collectProject">
        <view class="fs-24 text-color-third flex ai-center">
          <image class="m-icon u-m-r-16" src="../../assets/mine/m-icon.png"  @click.stop="emit('more-click', item, $event)" ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import assets from '@/utils/assets'
import { computed } from 'vue'
import dayjs from 'dayjs'
import projectDefaultImg from '@/assets/mine/project-default.png'

const props = defineProps<{
    index?: Number
    item?: Object
    myProject?: Boolean
    collectProject?: Boolean
    isIndex?:Boolean
    projectPool?:Boolean
  }>()

const emit = defineEmits<{
    (e: 'item-click', item: Object, event: any): void
    (e: 'more-click', item: Object, event: any): void
  }>()
</script>

<style lang="scss" scoped>
  .poster-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    overflow: hidden;
  }
  .bold {
    font-weight: bold;
  }
  .eye-icon {
    width: 30rpx;
    height: 30rpx;
  }
  .btn {
    background: $--ym-bg-primary;
    border-radius: 42rpx;
    color: #fff;
    font-size: 28rpx;
  }
  .u-p-t-7 {
    padding-top: 7rpx;
  }
  .time {
    border-bottom: 1rpx solid #f2f2f2;
  }
  .project-tag {
    padding: 8rpx 10rpx 8rpx 16rpx;
    border-bottom-left-radius: 22rpx;
    color: #fff;
    font-size: 24rpx;
    background-color: #018ff0;
    min-width: 104rpx;
    text-align: center;
    box-sizing: border-box;
  }
  .caogao {
    background-color: #6b54d4;
  }
  .stop {
    background-color: #7e8fc9;
  }
  .tips {
    margin: 22rpx 0 20rpx;
    align-items: center;
    .text {
      font-size: 28rpx;
      color: #999;
    }
    .line {
      background: #999;
      width: 4rpx;
      height: 30rpx;
      margin-left: 10rpx;
      margin-right: 6rpx;
    }
    .icons {
      color: #666666;
      font-size: 26rpx;
      padding-right: 15rpx;
      line-height: 1;
      // font-weight: 500;
      &+.icons{
        border-left: 2rpx solid #ccc;
        padding-left: 15rpx;
      }
    }
  }
  .project-item {
    position: relative;
    overflow: hidden;
    &.project-item-index{
      &::after{
      content: '';
      position: absolute;
      bottom: 0;
      left:24rpx;
      width: 654rpx;
      height: 1px;
      background: #F2F2F2;
    }
    }

  }
  .u-p-m {
    border-bottom:none;
 margin-left: 24rpx;
    margin-right: 24rpx;
    border-radius: 12rpx;
  }
  .project-content {
    padding-bottom: 30rpx;
    .ym-arrow-box{
      margin-top: 8rpx;
      align-items: baseline;
    }
  }
  .footer {
    border-top: 2rpx solid #f2f2f2;
    .circle {
      width: 6rpx;
      height: 6rpx;
      background: #999999;
      border-radius: 50%;
      margin: 0 8rpx;
    }
    .m-icon{
      width: 40rpx;
      min-width: 40rpx;
      height: 40rpx;
    }
  }
  .des-text {
    max-height: 40rpx;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .sm-title {
    color: #666;
    font-size: 26rpx;
    font-weight: 400;
  }
  .project-t-20 {
    padding-top: 20rpx;
  }
  .tuijian{
    margin-bottom: 18rpx;
    font-weight: 400;
    color: #A37411;
    border-radius: 6px;
    background: #FFF7E3;
    display: inline-block;
    font-size: 0;
    .icon{
      display: inline-block;
      background: #F9ECCB;
      padding: 0 12rpx;
      border-radius: 6px 0px 0px 6px;
      height: 40rpx;
      line-height: 40rpx;
      }
      .text{
        display: inline-block;
        padding: 0 14rpx 0 12rpx;
        height: 40rpx;
        line-height: 40rpx;
      }
      .tuijian-icon{
        width: 24rpx;
        height: 24rpx;
        margin-right: 8rpx;
        vertical-align: sub;
      }
  }
</style>
