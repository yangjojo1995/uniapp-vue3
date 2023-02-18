<template>
  <!-- 点赞列表项 -->
  <div class="person-item" :class="{'person-item--hide-border': hideBorder}" @click="toCompanyDetail(item.createBy, item.userType)">
    <image class="image" :src="assets(item.createByIcon)" />
    <div class="person-item__right">
      <div class="person-item__right__name">
        {{item.createByName}}

        <div class="top__role" v-if="item.commentTags && item.commentTags.length>0">
          <template v-for="(ele, i) in item.commentTags" :key="ele.id">
            <div class="top__role__item">
              <text v-if="i!==0" class="top__role__spilt"> | </text>
              <text> {{ele.name}} </text>  
            </div>
          </template>
        </div>
      </div>
      <div class="person-item__right__time">
        {{fromNowLocal(item.createTime)}}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import assets from '../../lib/assets';
  import { fromNowLocal } from '../../utils/dayjs'
  import { toCompanyDetail } from '../../utils/toDetail'

  const props = withDefaults(defineProps<{
    item: CommentItem
    hideBorder?: boolean
  }>(), {
    hideBorder: false
  })


  function goPerson(){
  }
</script>

<style lang="scss" scoped>
.person-item{
  padding: 24rpx 0;
  display: flex;
  border-top: 2rpx solid #F2F2F2;
  
  &.person-item--hide-border{
    border-top: none;
  }

  .image{
    flex: 0 0 80rpx;
    height: 80rpx;
    border-radius: 80rpx;
    margin-right: 18rpx;
  }
  .person-item__right{
    .person-item__right__name{
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      margin-bottom: 12rpx;
      display: flex;
      align-items: flex-end;
    }
    .person-item__right__time{
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
    }
  }

}

.top__role{
  margin-left: 20rpx;
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
    max-width: 180rpx;
  }
}
</style>