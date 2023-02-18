<template>
  <view class="content">
    <view class="action-list u-p-x-26 bg-white u-m-b-20">
    <view class="u-p-t-60 border">
      <!-- <view class="fs-28 text-color-primary bold  input-label" :class="{ 'label-required': from !== 'organization' }">上传营业执照</view> -->
      <view class="fs-28 text-color-primary bold  input-label">上传营业执照</view>
      <view class="picture flex ai-center u-p-b-24 u-p-t-46">
        <view class="pic" v-if="fullBusinessUrl!= ''&&fullBusinessUrl!= undefined && fullBusinessUrl!= null">
          <image :src="fullBusinessUrl"  @tap="previewImage(fullBusinessUrl)" class="img"></image>
          <image class="del-icon" src="../../../assets/certification/del-icon.png" @tap.stop="deleteFile"></image>
        </view>
        <view class="pic" @tap="chooseFile" v-else >
          <image src="../../../assets/certification/add.png" class="img"></image>
        </view>
      </view>
    </view>
    <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold  input-label label-required">单位名称</view>
      <view class="u-p-y-24">
         <input placeholder="请输入单位名称" class="fs-24" :maxlength="50" :border="false" v-model="params.fullName" @change="getValue($event,fullName)"/>
      </view>
    </view>

   
    <view class="u-p-t-60 border">
      <view class="fs-28 text-color-primary bold input-label label-required">统一社会信用代码</view>
       <view class="u-p-y-24">
        <input placeholder="请输入18位统一社会信用代码" class="fs-24" :maxlength="18" :border="false" v-model="params.creditCode" @change="getValue($event,creditCode)"/>
      </view>
    </view>
  </view>
    <view class="next-btn  u-m-t-60" @tap="check">保存并继续</view>
  </view>
</template>

<script setup lang="ts">

import {ref,reactive,computed} from 'vue'
import { onPullDownRefresh, onReachBottom,onLoad } from "@dcloudio/uni-app";
import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'

let isSubmit = false
const from = ref('')
const unionId = ref('')
const fullBusinessUrl = ref('')
const params:any = reactive({
  businessLicense: '',
  fullName: '',
  creditCode: '',
})
const config = useConfig()
const service =useService()



const getValue = (e:any, propKey:any) => {
  propKey = e
}


const check = async () => {
/*   if (from.value !== 'organization' && (params.businessLicense === ''  || params.businessLicense === undefined || params.businessLicense === null)) {
    uni.showToast({
      icon: 'none',
      title: '请上传营业执照图片'
    })
    return
  } */
  if (params.fullName === ''  || params.fullName === undefined || params.fullName === null) {
      uni.showToast({
      icon: 'none',
      title: '请输入企业名称'
    })
    return
  }
   if (params.creditCode === ''  || params.creditCode === undefined || params.creditCode === null) {
      uni.showToast({
      icon: 'none',
      title: '请输入统一社会信用代码'
    })
    return
  }
  if (isSubmit) {
    return false
  }
  isSubmit = true
  uni.showLoading({})
  try {
    if (from.value === 'organization') {
      const result = await service.certification.addOrganizationDraft({
        id: unionId.value,
        businessLicense:params.businessLicense,
        fullName: params.fullName,
        creditCode:params.creditCode
      })
      setTimeout(() => {
        uni.hideLoading()
        isSubmit = false
        uni.redirectTo({
          url: '/pages/mine-identity/organization/index?unionId=' + unionId.value
        })
      }, 500)

    } else {
      const result = await service.certification.addEnterpriseDraft({
        id: unionId.value,
        businessLicense:params.businessLicense,
        fullName: params.fullName,
        creditCode:params.creditCode
      })
    setTimeout(() => {
        uni.hideLoading()
        isSubmit = false
        uni.redirectTo({
          url: '/pages/mine-identity/enterprise/index?unionId=' + unionId.value
        })
      }, 500)
    }
 } catch (error) {
    isSubmit = false
}

  
}
const previewImage =  (url:any) => {
  uni.previewImage({
    current: url + '?original=true',
    urls: [url + '?original=true']
  })
}

const deleteFile = () => {
  fullBusinessUrl.value = ''
  params.businessLicense = ''
}

const chooseFile = () => {
 	uni.chooseImage({
      count: 1,
      success: res => {
       uploadFile(res.tempFilePaths)
      }
  })
}
  const uploadFile = async (filePath:any) => {
     const result = await service.app.uploadFile({filePath:filePath[0]})
     const file = JSON.parse(result.data)
     params.businessLicense = file.data.url 
     fullBusinessUrl.value = config.ASSETS_BASE_URL +  file.data.url
  }


const getOrganizationDetail = async () => {
  const result = await service.certification.getOrganizationDetail({id: unionId.value})
  if (result !== null && result !== undefined) {
     Object.keys(params).forEach((key:string) => {
      if (key === 'businessLicense') {
        fullBusinessUrl.value =result[key]? config.ASSETS_BASE_URL+ result[key]: ''
      }
      params[key] = result[key]
    })
  }
 
}

const getEnterpriseDetail = async () => {
  const result = await service.certification.getEnterpriseDetail({id: unionId.value})
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key:string) => {
      if (key === 'businessLicense') {
        fullBusinessUrl.value = result[key]? config.ASSETS_BASE_URL+ result[key]: ''
      }
      params[key] = result[key]
    })
  }
}
  onLoad ((options) => {
    from.value = options.from || ''
    unionId.value = options.unionId || ''
    if (options.from === 'organization') {
      getOrganizationDetail()
    } else {
      getEnterpriseDetail()
    }
  })


</script>

<style lang="scss" scoped>
.content{
  margin: 20rpx 24rpx;
  margin-bottom: 0;
}
.action-list {
  border-radius: 12rpx;
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

.picture{
		.pic{
			position: relative;
			margin-right:32rpx;
			background: #F7F7F7;
			.img{
				max-width: 162rpx;
				min-width: 162rpx;
				height: 108rpx;
				border-radius: 6rpx;
				overflow: hidden;
			}
			.del-icon{
				width:32rpx;
				height:32rpx;
				position: absolute;
				top:-16rpx;
				right:-16rpx;
				
			}
		}
	}

</style>
