<template>
  <view >
    <view class="u-p-y-20 bg-white">
    <ym-cell
      label="所属投资机构"
      :padding="true"
      align="right"
      :border="true"
      >
      <input v-model="formData.investInstitution" class="cell-content-input"  placeholder="请输入" :maxlength="50" :border="false" />
    </ym-cell>
    </view>
    <view class="fs-28  tip u-p-x-32  u-m-t-20">手动填写无法关联机构关系</view>
    <view class="wrap u-m-t-60 u-m-b-60">
      <view @click="updateManagerInfo" class="next-btn">保存</view>
    </view>
    <view class="fs-28 text-center  link" @click="goInvite">申请挂靠投资机构></view>
  </view>

</template>

<script setup lang="ts">
  import {ref,reactive,computed,nextTick} from 'vue'
  import { onLoad,onShow } from "@dcloudio/uni-app";
  import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
  
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

})
  const service = useService()

  const goInvite = () => {
    uni.navigateTo({url:'/pages/mine-identity/organization-manage/invite-organization'})
  }
  const getCurrentInfo = async () => {
  try {
    const result = await service.manager.getCurrentManagerInfo()
    if (result.affiliateStatus == '3') {
      result.investInstitution = ''
    }
    Object.assign(formData, result)
  } catch (error) {
    
  }
}
const updateManagerInfo = async () => {
  try {
    if (formData.investInstitution === '' || formData.investInstitution === null) {
      uni.showToast(({
        icon: 'none',
        title: '请输入挂靠机构名称'
      }))
      return
    }
    const paramsCopy = JSON.parse(JSON.stringify(formData))
    const result = await service.manager.updateManagerInfo(paramsCopy)
     uni.showToast(({
      icon: 'none',
      title: '修改成功'
    }))
    setTimeout(() => {
      uni.$emit('relative-page:relative')
      uni.navigateBack({
        delta:1
     })
    },500)
  
  } catch (error) {
    
  }
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
.tip{
  color:#FF9F00
}
</style>