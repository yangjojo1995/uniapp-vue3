<template>
  <view v-if="item.name" class="flex ai-center u-p-y-30 group-item" :class="showBorder? '': 'no-border'">
      <image class="group-icon" :src="item.image ? assets(item.image) : userDefault"/>
      <view class="flex flex-column jc-between wrap">
        <view>
          <text v-if="item.name && item.name.length<20" class="fs-32 text-color-primary u-m-r-10">{{item.name}}</text>
          <view v-else class="fs-32 text-color-primary u-m-r-10">{{item.name}}</view>
          <text class="fs-24 text-color-secondary">/{{item.position}}</text>
        </view>
        <view class="fs-26 text-color-secondary">{{item.profile}}</view>
      </view>
    </view>
</template>

<script setup lang="ts">
import assets from '@/utils/assets'
import userDefault from '@/assets/mine/default.png'

import { ref } from 'vue'
const props = defineProps<{
 item:Object,
 showBorder:Boolean
}>()

const expandDefault = ref(false)
const toggleShow = () => {
  console.log(expandDefault)
  expandDefault.value = !expandDefault.value
}
</script>

<style lang="scss" scoped>
  .group-icon{
  width: 90rpx;
  height: 90rpx;
  min-width: 90rpx;
  border-radius: 50%;
  margin-right:24rpx;
}
.group-item{
  border-bottom: 1rpx solid #F2F2F2;
}
.no-border{
  border:none;
}
.wrap{
  align-self:stretch
}
</style>
