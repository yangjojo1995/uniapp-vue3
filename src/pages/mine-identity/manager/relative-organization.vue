<template>
  <view >
    <view class="u-p-y-20 bg-white">
    <ym-cell
      label="所属投资机构"
      :padding="true"
      align="right"
      :border="true"
      >
     <text > {{formData.investInstitution}}</text>
    </ym-cell>
    </view>
    <view class="wrap u-m-t-60 u-m-b-60">
       <!--affiliateStatus  null：未操作 枚举备注: "0", "待审核"； "1", "已同意"； "2", "已失效"; "3", "已撤销"； -->
      <view @click="exitOrganization" class="next-btn" v-if="formData.affiliateStatus == '1'">退出</view>
      <view @click="reApply" class="next-btn" v-else-if="formData.affiliateStatus == '2'">重新提交</view>
        <view class="fs-28 text-center  link" @click="goApplicationPage" v-else>申请记录</view>
    </view>
  </view>

</template>

<script setup lang="ts">
  import {ref,reactive,computed} from 'vue'
  import { onLoad,onShow } from "@dcloudio/uni-app";
  import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
  import { isInit,isNumber, isPhone, isTelPhone, isEmail } from '@/utils/regex'
  const service = useService()
const formData = reactive({
  id: '',
  avatar: '',
  investInstitution: '',
  position: '',
  cityData: {},
  phoneStatus: '',
  phone: '',
  emailStatus: '',
  email: '',
  focusAreasArray: [] as any[],
  investFieldsArray: [] as any[],
  investRoundsArray: [] as any[],
  investment: '',
  summary: '',
  belongCity: '',
  belongProvince: '',
  belongIndustryStr: '',
  belongProvinceStr: '',
  belongCityStr: '',
  investInstitutionId: '',
  affiliateStatus: ''
})

const reApply = () => {
  const arr = formData.investInstitution.split('（')
  uni.redirectTo({url: '/pages/mine-identity/organization-manage/invite-organization?name='+ arr[0]})
}
const goApplicationPage = () => {
   uni.redirectTo({url: '/pages/application/list'})
}
const getCurrentInfo = async () => {
  try {
    const result = await service.manager.getCurrentManagerInfo()
    Object.assign(formData, result)
  } catch (error) {
    
  }
}


const exitOrganization = () => {
  uni.showModal({
    title: '温馨提示',
    content: '退出后可重新挂靠投资机构，确定退出吗？',
    success: async res => {
      if (res.confirm) {
        const  result = await  service.manager.exitRelation({
          investInstitutionId:formData.investInstitutionId
        })
        uni.$emit('relative-page:relative')
        uni.showToast({
          title: '退出成功'
        })
        uni.redirectTo({url: '/pages/mine-identity/manager/edit-relative'})
      }
    }
  })
  
}

  onLoad((options:any) => {
    getCurrentInfo()
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
  color:#01BA76;
  text-decoration: underline;
}
</style>