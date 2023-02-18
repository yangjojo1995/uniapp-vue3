<template>
  <div class="comment--header2">
    <image class="image" :src="assets(item.createByIcon)" @click.stop="toCompanyDetail(item.createBy, item.userType)"/>
    <div class="comment--header2__info" @click.stop="toCompanyDetail(item.createBy, item.userType)">
      <div class="comment--header2__info__top">
        <div class="top__name">{{item.createByName}}</div>
      </div>
      <div class="comment--header2__info__time">
        {{fromNowLocal(item.createTime)}} {{type==='comment' ? '点评了': '点赞了' }}
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
  import assets from '../../lib/assets';
  import { fromNowLocal } from '../../utils/dayjs'
  import { toCompanyDetail } from '../../utils/toDetail'

  const props = withDefaults(defineProps<{
    type: string,
    item: CommentItem
  }>(),{
    type: 'comment'
  })

</script>

<style lang="scss" scoped>
  .comment--header2{
    display: flex;
    align-items: center;
    margin-bottom: 26rpx;
    
    .image{
      width: 80rpx;
      height: 80rpx;
      border-radius: 80rpx;
      margin-right: 18rpx;
    }

    .comment--header2__info{
      flex-grow: 1;

      .comment--header2__info__top{
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;

        .top__name{
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
          margin-right: 16rpx;
        }
      }

      .comment--header2__info__time{
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
      }
    }


  }
</style>