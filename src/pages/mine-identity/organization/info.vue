<template>
  <view >
    <view class="ym-card">
      <ym-cell-group>
        <ym-cell-image label="单位LOGO" v-model="formData.logo" />
        <ym-cell-input maxlength="10" required label="单位简称" v-model="formData.shortName" />
        <ym-cell align="right" label="单位全称" :content="formData.fullName" />
        <ym-cell align="right" label="统一社会信用代码" :content="formData.creditCode" />
        <ym-cell-location align="right" label="所属地区" v-model="formData.location" :border="false" />
      </ym-cell-group>
    </view>

    <view class="ym-card">
      <ym-cell-group>
        <ym-cell-input required maxlength="25" label="联系人姓名" v-model="formData.contactName" />
        <ym-cell-input required maxlength="20" label="职务" v-model="formData.contactPosition" />
        <ym-cell align="right" label="联系电话" forward @click="goPhone">
          <text class="fs-28 u-m-r-30" v-if="formData.contactPhone"  :class="formData.contactPhoneStatus === 'public'? 'c-open':'c-close'"> {{formData.contactPhoneStatus === 'public'? '公开': '不公开'}}</text>
          <text>{{ formData.contactPhone || '去设置' }}</text>
        </ym-cell>
        <ym-cell align="right" label="联系邮箱" forward @click="goEmail">
          <text class="fs-28 u-m-r-30" v-if="formData.contactEmail"  :class="formData.contactEmailStatus === 'public'? 'c-open':'c-close'"> {{formData.contactEmailStatus === 'public'? '公开': '不公开'}}</text>
          <text>{{ formData.contactEmail || '去设置' }}</text>
        </ym-cell>
        <ym-cell-input required maxlength="60"  label="通讯地址" v-model="formData.contactAddress" :border="false" />
      </ym-cell-group>
    </view>

    <view class="ym-card">
      <ym-cell-group title="投资偏好">
        <ym-cell-city align="right" label="关注地区" :inline="true" limit="10" v-model="formData.focusAreas"></ym-cell-city>
        <ym-cell-fileds align="right" label="投资领域" :inline="true" v-model="formData.investFields" />
        <ym-cell-rounds align="right" label="投资轮次" :inline="true"  v-model="formData.investRounds" />
        <ym-cell-select align="right" label="单笔投额" v-model="formData.investment" :border="false" />
      </ym-cell-group>
    </view>

    <view class="ym-card">
      <view class="action-list u-p-x-32 bg-white u-m-b-20 u-p-b-32">
        <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goIntroduce">单位简介<image class="edit" src="../../../assets/certification/go-edit.png"/></view>
        <view class="action-content" v-if="formData.introduction">
          <ym-project-collsage :showExpand="true" :nopadding="true" :content="formData.introduction"></ym-project-collsage>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, reactive,watch, nextTick } from 'vue'
import { useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
import { onLoad, onShow } from '@dcloudio/uni-app'
import assets from '@/utils/assets'

const service = useService()
let isInit = false
let modalShow = ref(false)
const formData = reactive({
  id: '',
  logo: '',
  shortName: '',
  fullName: '',
  creditCode: '',
  location: null as any,
  contactName: '',
  contactPosition: '',
  contactPhone: '',
  contactEmail: '',
  contactPhoneStatus: '',
  contactEmailStatus: '',
  contactAddress: '',
  focusAreas: [] as any,
  focusAreasValue: '',
  investFields: [] as any,
  investFieldsValue: '',
  investRounds: [] as any,
  investRoundsValue: '',
  investment: '',
  introduction: ''
})

const modalShowFn = (show:boolean) => {
  modalShow.value = show
}
const goIntroduce = () => {
  uni.$once('organization:summary',  (value) => {
    formData.introduction = value
  })
  uni.navigateTo({
    url: './introduce?unionId='+formData.id + '&edit=true'
  })
}

const goPhone = () => {
   uni.$once('features-page:updatePhone',  (value) => {
    //  public, shield
    formData.contactPhone = value.value
    formData.contactPhoneStatus = value.status
  })
  const value = formData.contactPhone || ''
  uni.navigateTo({
    url: '/pages/features-page/emailPhoneUpdate?value='+value + '&required=true&maxlength=13&label=联系手机&ruleType=telOrphone&status='+formData.contactPhoneStatus
  })
}
const goEmail = () => {
   uni.$once('features-page:updateEmail',  (value) => {
    //  public, shield
    formData.contactEmail= value.value
    formData.contactEmailStatus = value.status
  })
   const value = formData.contactEmail || ''
  uni.navigateTo({
    url: '/pages/features-page/emailPhoneUpdate?value='+value + '&required=true&maxlength=50&label=联系邮箱&ruleType=email&status='+formData.contactEmailStatus
  })
}


const getCurrentInfo = async () => {
  try {
    const result = await service.organization.getCurrentOrganizationInfo()
    Object.assign(formData, result)
    nextTick(() => {
      isInit = true
    })
  } catch (error) {
    
  }
}
const updateOrganizationInfo = async () => {
  try {
    const paramsCopy = JSON.parse(JSON.stringify(formData))
    const result = await service.organization.updateOrganizationInfo(paramsCopy)
  } catch (error) {
    
  }
}
watch(() => JSON.stringify(formData), async (val) => {
  if (isInit) {
    await updateOrganizationInfo()
    isInit = false
    await getCurrentInfo()
  } 
 
}, {
  deep: true
})


onLoad((params:any) => {
  getCurrentInfo()
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

</style>
