<template>
  <view >
    <view class="ym-card">
      <ym-cell-group>
        <ym-cell-image label="单位LOGO" v-model="formData.avatar" />
        <ym-cell-input label="单位简称" v-model="formData.shortName" maxlength="10" required/>
        <ym-cell align="right" label="单位全称" :content="formData.fullName" />
        <ym-cell align="right" label="统一社会信用代码" :content="formData.creditCode" />
        <ym-cell  align="right" label="所属地区" :content="formData.belongProvinceStr+formData.belongCityStr"  forward @click="goRegion" />
        <ym-cell-industy :border="false"  align="right" label="所属行业" v-model="formData.belongIndustry" forward  />
      </ym-cell-group>
    </view>

    <view class="ym-card">
      <ym-cell-group>
        <ym-cell-input label="联系人姓名" v-model="formData.contactName" maxlength="25" required />
        <ym-cell-input label="职务" v-model="formData.position" maxlength="20"/>
        <ym-cell align="right" label="联系电话" forward @click="goPhone">
          <text class="fs-28 u-m-r-30" v-if="formData.contactPhone"  :class="formData.contactPhoneStatus === 'public'? 'c-open':'c-close'"> {{formData.contactPhoneStatus === 'public'? '公开': '不公开'}}</text>
          <text>{{ formData.contactPhone || '去设置' }}</text>
        </ym-cell>
        <ym-cell align="right" label="联系邮箱" forward @click="goEmail">
          <text class="fs-28 u-m-r-30" v-if="formData.contactEmail"  :class="formData.contactEmailStatus === 'public'? 'c-open':'c-close'"> {{formData.contactEmailStatus === 'public'? '公开': '不公开'}}</text>
          <text>{{ formData.contactEmail  || '去设置' }}</text>
        </ym-cell>
        <ym-cell-input label="通讯地址" v-model="formData.address" :border="false" maxlength="60" />
      </ym-cell-group>
    </view>

    <view class="ym-card">
      <view class="action-list u-p-x-32 bg-white u-m-b-20 u-p-b-32">
        <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goIntroduce">单位简介<image class="edit" src="../../../assets/certification/go-edit.png"/></view>
        <view class="action-content" v-if="formData.summary">
          <ym-project-collsage :showExpand="true" :nopadding="true" :content="formData.summary"></ym-project-collsage>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive,watch,nextTick } from 'vue'
import { useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
import assets from '@/utils/assets'
import debounce from '@/utils/debounce'

import { onLoad, onShow } from '@dcloudio/uni-app'
const service = useService()
let isInit = false
const formData = reactive({
  id: '',
  avatar: '',
  shortName: '',
  fullName: '',
  creditCode: '',
  contactName: '',
  position: '',
  contactPhone: '',
  contactEmail: '',
  contactPhoneStatus: '',
  contactEmailStatus: '',
  address: '',
  focusAreas: [] as any,
  investFields: [] as any,
  investRounds: [] as any,
  belongCity: '',
  belongProvince: '',
  investment: '',
  summary: '',
  belongIndustryStr: '',
  belongProvinceStr: '',
  belongCityStr: ''
})

let options:any = reactive([])
const modalShow = ref(false)
const modalShowFn = (show:boolean) => {
  modalShow.value = show
}
const goIntroduce = () => {
  uni.$once('enterprise:summary',  (value) => {
    formData.summary = value
  })
  uni.navigateTo({
    url: './introduce?unionId='+formData.id + '&edit=true'
  })
}
const goPhone = () => {
   uni.$once('features-page:updatePhone',  (value) => {
    //  public, shield
    console.log(value)
    formData.contactPhone = value.value
    formData.contactPhoneStatus = value.status
  })
  const value = formData.contactPhone || ''
  uni.navigateTo({
    url: '/pages/features-page/emailPhoneUpdate?value='+ value + '&required=true&maxlength=13&label=联系手机&ruleType=telOrphone&status='+formData.contactPhoneStatus
  })
}
const goEmail = () => {
   uni.$once('features-page:updateEmail',  (value) => {
    console.log(value)
    //  public, shield
    formData.contactEmail= value.value
    formData.contactEmailStatus = value.status
  })
  const value = formData.contactEmail || ''
  uni.navigateTo({
    url: '/pages/features-page/emailPhoneUpdate?value='+value + '&required=true&maxlength=50&label=联系邮箱&ruleType=email&status='+formData.contactEmailStatus
  })
}

const goRegion = () => {
  uni.$once('features-page/region-city-selection:confirm',  (data) => {
    formData.belongProvince = data[0].provinceId
    formData.belongCity = data[0].cityId
    formData.belongProvinceStr = data[0].provinceName
    formData.belongCityStr = data[0].cityName
  })
  uni.navigateTo({
    url: '/pages/features-page/region-city-selection?limit=1&value='+ formData.belongCity
  })
}


const getCurrentInfo = async () => {
  try {
    const result = await service.company.getCurrentCompanyInfo()
    Object.assign(formData, result)
    nextTick(() => {
      isInit = true
    })
  } catch (error) {
    
  }
}
const updateCompanyInfo = async () => {
  try {
    const paramsCopy = JSON.parse(JSON.stringify(formData))
    if (typeof(paramsCopy.belongIndustry) === 'object' && paramsCopy.belongIndustry!=null) { 
      //当回显信息，不操作选择区域的情况下，这个值后端返回的是string
      // 操作组件时，返回的为数组
      paramsCopy.belongIndustry = paramsCopy.belongIndustry[0] || ''
    } 
    const result = await service.company.updateCompanyInfo(paramsCopy)
  } catch (error) {
    
  }
}
watch(() => JSON.stringify(formData), async (val) => {
  if (isInit) {
    await updateCompanyInfo()
    isInit = false
    console.log(formData)
    await getCurrentInfo()
  } 
 
}, {
  deep: true
})
const getDictionaryIndusty = async (code:any) => {
  const result = await service.app.getDictionary({dictCode: code})
  result.forEach((key:any) => {
    key.value = key.itemValue 
    key.label = key.itemName
  })
  options = result
}


onLoad((params:any) => {
  getCurrentInfo()
  getDictionaryIndusty('industry_type')

})
</script>

<style lang="scss" scoped>
.page-footer {
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
    z-index: 10;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.button {
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
}

.s_image {
  display: inline-block;
  width: 114rpx; min-width:114rpx;
  height: 40rpx;
  vertical-align: middle;
  + text {
    vertical-align: middle;
  }
}
   .action-content{
      border-top: 1rpx solid #ECE7E3;
    }

     .action-title{
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .edit{
        width:36rpx;
        height:36rpx;
        min-width: 36rpx;
      }
      &:before{
        content: '';
        width: 8rpx;
        height: 36rpx;
        background: $--ym-bg-primary;
        border-radius: 8rpx;
        position: absolute;
        left:-32rpx;
        top:50%;
        transform: translateY(-50%);
      }
     }
 .fileds-wrap{
    position: fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    z-index: 999;
    background-color: #fff;
  }

  .footer-btn-wrap{
    position:absolute;z-index: 999;bottom:0;left:0
  }
</style>
