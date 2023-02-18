<template>
  <view >

    <view class="ym-card">
      <ym-cell-group>
        <ym-cell-image label="头像" v-model="formData.avatar" />
        <!--affiliateStatus  null：未操作 枚举备注: "0", "待审核"； "1", "已同意"； "2", "已失效"; "3", "已撤销"； -->
        <ym-cell  align="right"   label="所属投资机构" :content="formData.investInstitution"  forward   @click="goOrganization" />
        <ym-cell-input label="职位" required maxlength="10" v-model="formData.position" />
        <ym-cell align="right" label="所属地区" :content="formData.belongProvinceStr+formData.belongCityStr"  forward @click="goRegion" />
        <ym-cell align="right" label="联系电话" forward @click="goPhone">
          <text class="fs-28 u-m-r-30" v-if="formData.phone"  :class="formData.phoneStatus === 'public'? 'c-open':'c-close'"> {{formData.phoneStatus === 'public'? '公开': '不公开'}}</text>
          <text>{{ formData.phone || '去设置' }}</text>
        </ym-cell>
        <ym-cell align="right" label="联系邮箱" forward :border="false" @click="goEmail">
          <text class="fs-28 u-m-r-30" v-if="formData.email"  :class="formData.emailStatus === 'public'? 'c-open':'c-close'"> {{formData.emailStatus === 'public'? '公开': '不公开'}}</text>
          <text>{{ formData.email || '去设置' }}</text>
        </ym-cell>
      </ym-cell-group>
    </view>

    <view class="ym-card">
      <ym-cell-group title="投资偏好">
        <ym-cell-city align="right" label="关注地区" :inline="true"  limit="10" v-model="formData.focusAreasArray"></ym-cell-city>
        <ym-cell-fileds align="right" label="投资领域" :inline="true" v-model="formData.investFieldsArray" />
        <ym-cell-rounds align="right" label="投资轮次" :inline="true"  v-model="formData.investRoundsArray" />
        <ym-cell-select align="right" label="单笔投额" v-model="formData.investment" :border="false" />
      </ym-cell-group>
    </view>

    <view class="ym-card">
      <view class="action-list u-p-x-32 bg-white u-m-b-20 u-p-b-32">
        <view class=" action-title fs-36 text-color-primary bold u-p-y-48" @click="goIntroduce">个人简介<image class="edit" src="../../../assets/certification/go-edit.png"/></view>
        <view class="action-content" v-if="formData.summary">
          <ym-project-collsage :showExpand="true" :nopadding="true" :content="formData.summary"></ym-project-collsage>
        </view>
      </view>
    </view>
   
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
import { onLoad, onShow } from '@dcloudio/uni-app'
import assets from '@/utils/assets'

let isInit = false

const service = useService()
const modalShow = ref(false)
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
  affiliateStatus: ''
})


const goOrganization = async () => {
   uni.$once('relative-page:relative',  async () => {
    const result = await service.manager.getCurrentManagerInfo()
    isInit = false // 不触发watch
   Object.assign(formData, result)
  })
  const result = await service.manager.getCurrentManagerInfo()
  if (result.affiliateStatus == null || result.affiliateStatus == '3') {
    uni.navigateTo({url:'/pages/mine-identity/manager/edit-relative'})
  } else {
    uni.navigateTo({url:'/pages/mine-identity/manager/relative-organization'})
  }
}

const modalShowFn = (show:boolean) => {
  modalShow.value = show
}
const goIntroduce = () => {
  uni.$once('manager:summary',  (value) => {
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
    formData.phone = value.value
    formData.phoneStatus = value.status
  })
   const value = formData.phone || ''
  uni.navigateTo({
    url: '/pages/features-page/emailPhoneUpdate?value='+value + '&required=true&maxlength=13&label=联系手机&ruleType=telOrphone&status='+formData.phoneStatus
  })
}
const goEmail = () => {
   uni.$once('features-page:updateEmail',  (value) => {
    console.log(value)
    //  public, shield
    formData.email= value.value
    formData.emailStatus = value.status
  })
  const value = formData.email || ''
  uni.navigateTo({
    url: '/pages/features-page/emailPhoneUpdate?value='+value+ '&required=true&maxlength=50&label=联系邮箱&ruleType=email&status='+formData.emailStatus
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
    const result = await service.manager.getCurrentManagerInfo()
    Object.assign(formData, result)
    nextTick(() => {
      isInit = true
    })
  } catch (error) {
    
  }
}
const updateManagerInfo = async () => {
  try {
    const paramsCopy = JSON.parse(JSON.stringify(formData))
    const result = await service.manager.updateManagerInfo(paramsCopy)
  } catch (error) {
    
  }
}
watch(() => JSON.stringify(formData), async (val) => {
  if (isInit) {
    await updateManagerInfo()
    isInit = false
    console.log(formData)
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
