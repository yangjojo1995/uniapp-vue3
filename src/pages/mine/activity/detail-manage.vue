<template>
  <view class="detail">

    <ym-activity-detail :item="detail"></ym-activity-detail>

    <ym-footer>
      <view class="footer-btn flex-center green-bg u-m-r-10" style="flex-shrink:1;" @click="goApply">
        <text>报名</text>
        {{detail.applyNum || 0}}
      </view>
      <view class="footer-btn flex-center green-bg" style="flex-shrink:1" @click="goSignList">
        <text>签到</text>
        {{detail.signInNum || 0}}
      </view>
    </ym-footer>

  </view>
</template>

<script setup lang="ts">
import { reactive, onLoad, useService } from '@/utils/commonUse'
const service = useService()
let id = ''
let detail: object = reactive({})
const goApply = () => {
  uni.navigateTo({
    url: '/pages/activity/apply/list?activityId=' +id
  })
}
const goSignList = () => {
  uni.navigateTo({
    url: '/pages/activity/signin/list?activityId=' +id
  })
}
onLoad(async (options: Record<string, string | undefined>) => {

  if (typeof options.id !== 'string') {
    uni.showToast({ title: '项目id值非法', icon: 'none' });
    return
  }
  id = options.id
  const result = await service.activity.getActivity({ id: options.id })
  Object.assign(detail, result)
})


</script>

<style lang="scss" scoped>

.detail{
  background: #F7F7F7;
  padding-bottom: 146rpx;
}

.footer-btn{
  width: 333rpx;
  height: 82rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 500;
  margin: 0 8rpx;

  text{
    margin-right: 10rpx;
  }
}

.green-bg {
  background: $--ym-bg-primary;
  color: #fff;
}

.disable-bg{
  background: #E9E9E9;
  color: #FFFFFF;
}

</style>
