<template>
  <view >
    <view class="u-p-y-20 bg-white">
      <ym-cell
        :label="params.label"
        :padding="true"
        align="right"
        :border="true"
        >
        <input v-model="params.value" class="cell-content-input"  placeholder="输入注册账号、手机、邮箱" :maxlength="params.maxlength" :border="false" />
      </ym-cell>
    </view>
    <view class="fs-28  link u-p-x-32  u-m-t-20">注：邀请成功后赋予默认办事员角色</view>
    <view class="wrap u-m-t-60">
      <view @click="goBind" class="next-btn">确定</view>
    </view>
  </view>

</template>

<script setup lang="ts">
  import {ref,reactive,computed} from 'vue'
  import { useService } from '@/plugins/app-core'
  import { isInit,isNumber, isPhone, isTelPhone, isEmail } from '@/utils/regex'
import { onLoad } from '@/utils/commonUse'
  
  const params:any =reactive( {
    label: '邀请账号',
    value: '',
    maxlength: 50,
  })
  const service = useService()
  let submit = false
  const goBind = async () => {
    if (submit){
      return 
    }
    if (params.value === '' || params.value === undefined || params.value === null ) {
       uni.showToast({
         icon: 'none',
         title: '请输入注册的账号或手机号、邮箱地址'
       })
       return
     }
    submit = true
    uni.showLoading({})

     try {
       const result = await service.subaccount.bindSubAccount({account:params.value, secondaryRoleId: '1', representativeId: representativeId.value})
       setTimeout(() => {
         submit = false
         uni.hideLoading()
         uni.navigateTo({
            url: '/pages/mine-identity/account-manage/state'
        })
       }, 500)
     } catch (error) {
       submit = false
     }
    

  }

  const representativeId = ref('')
  onLoad((options) => {
    representativeId.value = options.representativeId || ''
  })

</script>

<style lang="scss" scoped>
.cell-content-input {
  display: block;
  font-size: 28rpx;
  font-weight: 400;
  width: 100%;
  color: #333333;
  &:focus {
    outline: none;
    text-align: left;
  }
}
.link{
  color:#FF9F00;
}
</style>