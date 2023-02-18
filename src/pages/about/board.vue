<template>
  <!-- 数据看板 -->
  <view class="board">
    <view class="board__box">
      <view class="board__box__title">投资机构</view>
      <view class="board__box__des">
        <span class="board__box__des__number">{{investInstitutionCounts}}</span>
        <span class="board__box__des__unit">家</span>
      </view>
      <image class="board__box__img" src="../../assets/index/board1.png"></image>
    </view>
    <view class="board__box">
      <view class="board__box__title">投资经理</view>
      <view class="board__box__des">
        <span class="board__box__des__number">{{investManagerCounts}}</span>
        <span class="board__box__des__unit">位</span>
      </view>
      <image class="board__box__img" src="../../assets/index/board2.png"></image>
    </view>
    <view class="board__box">
      <view class="board__box__title">企业</view>
      <view class="board__box__des">
        <span class="board__box__des__number">{{enterpriseCounts}}</span>
        <span class="board__box__des__unit">家</span>
      </view>
      <image class="board__box__img" src="../../assets/index/board3.png"></image>
    </view>
    <view class="board__box">
      <view class="board__box__title">项目</view>
      <view class="board__box__des">
        <span class="board__box__des__number">{{projectCounts}}</span>
        <span class="board__box__des__unit">个</span>
      </view>
      <image class="board__box__img" src="../../assets/index/board4.png"></image>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useService } from '@/plugins/app-core'
import { ref } from 'vue'
import { onLoad } from "@dcloudio/uni-app";


const service = useService()

let investInstitutionCounts = ref(0)
let investManagerCounts = ref(0)
let enterpriseCounts = ref(0)
let projectCounts = ref(0)

onLoad(async () => {
  let data = await service.app.getStatistics()
  console.log(data)
  investInstitutionCounts.value = data.investInstitutionCounts
  investManagerCounts.value = data.investManagerCounts
  enterpriseCounts.value = data.enterpriseCounts
  projectCounts.value = data.projectCounts
})

</script>

<style lang="scss" scoped>
.board{
  padding: 20rpx 24rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .board__box{
    width: 340rpx;
    height: 191rpx;
    background: #FFFFFF;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    position: relative;

    .board__box__title{
      margin: 32rpx 0 8rpx 24rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }

    .board__box__des{
      margin: 0 24rpx;

      .board__box__des__number{
        font-size: 48rpx;
        font-weight: 900;
        color: #333333;
        margin-right: 12rpx;
      }
      .board__box__des__unit{
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
      }
    }

    .board__box__img{
      width: 90rpx;
      height: 86rpx;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
</style>

