<template>
  <div class="comment--header" >
    <image class="image" :src="assets(item.createByIcon)" @click.stop="toCompanyDetail(item.createBy, item.userType)"/>
    <div class="comment--header__info" @click.stop="toCompanyDetail(item.createBy, item.userType)">
      <div class="comment--header__info__top">
        <div class="top__name">{{item.createByName}}</div>
        <div class="top__tag" v-if="item.publisher">发布人</div>
        <div class="top__role" v-if="item.commentTags && item.commentTags.length>0">
          <template v-for="(ele, i) in item.commentTags" :key="ele.id">
            <div class="top__role__item">
              <text v-if="i!==0" class="top__role__spilt"> | </text>
              <text> {{ele.name}} </text>  
            </div>
          </template>
        </div>
      </div>
      <div class="comment--header__info__time">
        {{fromNowLocal(item.createTime)}}
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
  import assets from '../../lib/assets';
  import { fromNowLocal } from '../../utils/dayjs'
  import { toCompanyDetail } from '../../utils/toDetail'

  const props = withDefaults(defineProps<{
    item: CommentItem,
  }>(), {

  })

</script>

<style lang="scss" scoped>
  .comment--header{
    display: flex;
    align-items: center;
    margin-bottom: 26rpx;
    
    .image{
      width: 80rpx;
      height: 80rpx;
      border-radius: 80rpx;
      margin-right: 18rpx;
    }

    .comment--header__info{
      flex-grow: 1;

      .comment--header__info__top{
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;
        word-break: break-all;

        .top__name{
          overflow: hidden;
          max-width: 360rpx;
          font-size: 32rpx;
          font-weight: 500;
          color: #333333;
          margin-right: 16rpx;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .top__tag{
          flex: 0 0 86rpx;
          height: 32rpx;
          margin-right: 12rpx;
          background: #00BF17;
          border-radius: 100rpx 100rpx 100rpx 0;
          font-size: 20rpx;
          color: #FFFFFF;
          text-align: center;
          line-height: 32rpx;
        }

        .top__role{
          font-size: 26rpx;
          font-weight: 400;
          color: #666666;
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          
          .top__role__spilt{
            margin: 0 6rpx;
          }

          .top__role__item{
            width:fit-content;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 140rpx;
          }
        }

      }

      .comment--header__info__time{
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
      }
    }
  }
</style>