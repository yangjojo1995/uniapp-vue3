<template>
  <view class="content u-p-x-64 bg-white">
    <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold  input-label label-required">真实姓名</view>
      <view class="u-p-y-24">
          <!-- <text class="fs-24 text-color-primary">{{userInfo.realName || 111}}</text> -->
         <input disabled placeholder="请输入真实姓名" class="fs-24" :maxlength="25" :value="userInfo.realName"  />
      </view>
    </view>
    <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold input-label label-required">身份证号</view>
       <view class="u-p-y-24">
         <!-- <text class="fs-24 text-color-primary">{{userInfo.idCard}}</text> -->
        <input disabled placeholder="请输入身份证号" class="fs-24" :maxlength="18" :value="userInfo.idCard"  />
      </view>
    </view>
    <view class="fs-24 u-p-t-24 u-p-b-60 tips">
      与账号唯一绑定后，不可解除绑定，以上信息已通过区块链加密。
    </view>
  </view>
</template>

<script setup lang="ts">

import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useService } from '@/plugins/app-core'

const userInfo:any = reactive({})
const service = useService()
const getDetail = async () => {
  const result = await service.user.getCurrentUserInfo()
  Object.assign(userInfo, result)
}
onLoad((options:any) => {
  getDetail()
})
</script>

<style lang="scss" scoped>
.content{
  min-height:100vh;
}
.border{
  border-bottom:1rpx solid #F2F2F2;
}
.label-required{
  position:relative;
  display:inline-block;
  &:after{
    content: '*';
    color:#FF4536;
    position:absolute;
    right:-20rpx;
    top:50%;
    transform:translateY(-50%);
  }
}
.tips{
  color:#FFA300;
}

</style>
