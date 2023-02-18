<template>
  <view class="page">
    <view class="agreement">
      <!-- <view class="agreement__title">《XXXX协议》</view> -->
      <view class="agreement__content" v-html="agreement"></view>
    </view>

    <ym-footer>
      <ym-button class="button" type="primary" @click="goSignList">查看签名</ym-button>
    </ym-footer>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import { useService, getUserInfo } from '@/plugins/app-core'
import { getUserType } from '@/utils/user'

const service = useService()

let agreement = ref('')
let type: any = ref(0)

onLoad(async (props) => {
  type.value = await getUserType()
  const result = await service.commitment.get({ type: type.value || 1 })
  agreement.value = result.content
})

/**
 * 是否已认证
 * @return true已认证，false未认证
 */
async function ifAuthenticated() {
  let userInfo = await getUserInfo()
  if(!userInfo){
    return false
  }
  let returnFalg = false
  if(Array.isArray(userInfo.enterpriseIdentities) && userInfo.enterpriseIdentities.length>0){
    returnFalg = true
  }
  if(Array.isArray(userInfo.personIdentity) && userInfo.personIdentity.length>0){
    returnFalg = true
  }
  return returnFalg
}

// 前往认证页
const goSignList = async () => {
  if(await ifAuthenticated() && type.value!==0){
    uni.navigateTo({
      url: '/pages/mine/rule/signList'
    })
  }else{
    uni.showModal({
      title: '认证提示',
      content: '该权限需要先认证身份，现在去认证吗？',
      confirmText: '去认证',
      cancelText: '再等等',
      success: async (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/mine/certification'
          })
        }
      }
		})
  }
}

</script>

<style lang="scss">
.page {
  padding: 20rpx 0 128rpx;
  .button{
    width: 100%;
  }
}

.agreement {
  padding: 30rpx;
  background-color: #fff;
  &__title {
    font-size: 40rpx;
    font-weight: 500;
    color: #333333;
    line-height: 40rpx;
    text-align: center;
    margin-bottom: 32rpx;
  }
  &__content {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    line-height: 42rpx;
  }
}

/* .page-footer {
  $height: 146rpx;

  position: relative;
  width: 100%;
  height: $height;
  background: #FFFFFF;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  &-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: $height;
    background: #FFFFFF;
    z-index: 9999;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
} */

/* .button {
  max-width: 550rpx;
  display: block;
  width: 100%;
  height: 82rpx;
  background: $--ym-bg-primary;
  border-radius: 82rpx;
  border: none;
  padding: 0 34rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 400;
  color: #ffffff;
  line-height: 82rpx;

  &::after {
    display: none;
  }

  &.button-hover {
    opacity: 0.8;
  }
} */
</style>