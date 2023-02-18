<template>
	<view class="container" :class="!loading? 'loaded': ''">
		<image src="../../assets/certification/identity.png" class="img" />
		<view class="wrap" >
			<view class="title" v-if="managerState != 'assisted'">
					<view class="fs-50 bold text-color-primary u-p-x-32 u-p-t-60">
						个人用户
					</view>
			</view>
			<view class="u-p-x-32 u-p-y-40 flex ai-center jc-between  bg-white"  @click="goManager" v-if="managerState != 'assisted'">
				<image src="../../assets/certification/manager.png" class="icon"></image>
				<view class="u-m-l-24">
					<view class="fs-36 text-color-primary u-m-b-10 bold">投资经理认证</view>
					<view class="fs-24 text-color-third desc">需要实名认证，邀请至少{{min}}名投资经理或{{min2}}名投资机构确权</view>
				</view>
        <view class="flex-1  flex jc-end ">
          <view class="create-btn yellow" v-if="!managerState">去认证</view>
          <view class="state-btn" v-if="managerState === 'assisting'">确权中 <img class="img"
              src="../../assets/certification/arrow-active.png" alt="" /></view>
          <view class="state-btn" v-if="managerState === 'draft'">草稿中 <img class="img"
              src="../../assets/certification/arrow-active.png" alt="" /></view>
        </view>
      </view>
      <view class="title">
					<view class="fs-50 bold text-color-primary u-p-x-32 u-p-t-60">
						企业/机构
					</view>
			</view>
			<view class="u-p-x-32 u-p-y-40 u-m-b-20 flex ai-center jc-between bg-white"  @click="goOrganization">
				<image src="../../assets/certification/organization.png" class="icon"></image>
				<view class="u-m-l-24">
					<view class="fs-36 text-color-primary u-m-b-10 bold">创建投资机构</view>
					<view class="fs-24 text-color-third desc">需完善机构基本资料、提交签章证明或用印申请文件并通过平台审核</view>
				</view>
        <view class="flex-1  flex jc-end ">
            <view class="create-btn" v-if="!organizationState">去创建</view>
						<view class="create-btn" v-if="organizationState === 'accept'">去创建</view>
						<view class="state-btn" v-if="organizationState === 'refuse'">审核不通过 <img class="img" src="../../assets/certification/arrow-active.png" alt=""/></view>
						<view class="state-btn" v-if="organizationState === 'draft'">草稿中 <img class="img" src="../../assets/certification/arrow-active.png" alt=""/></view>
						<view class="state-btn" v-if="organizationState === 'check'">审核中 <img class="img" src="../../assets/certification/arrow-active.png" alt=""/></view>
          </view> 
			</view>
      <view class="u-p-x-32 u-p-y-40 u-m-b-20 flex ai-center jc-between bg-white"  @click="goEnterprise">
				<image src="../../assets/certification/company.png" class="icon"></image>
				<view class="u-m-l-24">
					<view class="fs-36 text-color-primary u-m-b-10 bold">创建企业</view>
					<view class="fs-24 text-color-third desc">需完善企业基本资料、提交签章证明文件并通过平台审核</view>
				</view>
        <view class="flex-1  flex jc-end ">
          <view class="create-btn" v-if="!enterpriseState">去创建</view>
          <view class="create-btn" v-if="enterpriseState === 'accept'">去创建</view>
          <view class="state-btn" v-if="enterpriseState === 'refuse'">审核不通过</view>
          <view class="state-btn" v-if="enterpriseState === 'draft'">草稿中 <img class="img"
              src="../../assets/certification/arrow-active.png" alt="" /></view>
          <view class="state-btn" v-if="enterpriseState === 'check'">审核中 <img class="img"
              src="../../assets/certification/arrow-active.png" alt="" /></view>
        </view>
      </view>
      <view class="u-p-x-32 u-p-y-40 u-m-b-20 flex ai-center jc-between bg-white" @click="goObserver">
        <image src="../../assets/certification/observer.png" class="icon"></image>
        <view class="u-m-l-24">
          <view class="fs-36 text-color-primary u-m-b-10 bold">创建指导单位</view>
          <view class="fs-24 text-color-third desc">需完善基本材料并通过平台审核</view>
        </view>
        <view class="flex-1  flex jc-end">
          <view class="create-btn" v-if="!observerState">去创建</view>
          <view class="create-btn" v-if="observerState === 'accept'">去创建</view>
          <view class="state-btn" v-if="observerState === 'refuse'">审核不通过 <img class="img"
              src="../../assets/certification/arrow-active.png" alt="" /></view>
          <view class="state-btn" v-if="observerState === 'draft'">草稿中 <img class="img"
              src="../../assets/certification/arrow-active.png" alt="" /></view>
          <view class="state-btn" v-if="observerState === 'check'">审核中 <img class="img"
              src="../../assets/certification/arrow-active.png" /></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// 创建机构状态： 0-未加入/创建 1-审核中 2-已加入/创建
import { ref, reactive, computed } from 'vue'
import { onLoad, onShow } from "@dcloudio/uni-app";
import { router, useService, useConfig, useRouter, setToken, setUserInfo, getUserInfo, serviceKey } from '@/plugins/app-core'

const service = useService()

let unionIdManager = ''
let unionIdObserver = ''
let unionIdEnterprise = ''
let unionIdOrganization = ''

let managerState = ref('')
let enterpriseState = ref('')
let observerState = ref('')
let organizationState = ref('')
let loading = ref(true)

// 当前数据ID对应的状态,投资经理草稿状态（draft）确权中（assisting）确权完成（assisted）,
// 其他企业类型草稿状态（draft）审核中（check）审核通过（accept）审核不通过（refuse）
let idCard = ref('')
// 获取当前用户实名信息
const getDetail = async () => {
  const result = await service.user.getCurrentUserInfo()
  idCard.value = result?.idCard
}

const getManagerInfo = async () => {
  const result = await service.certification.getManagerId()
  unionIdManager = result?.id || ''
  managerState.value = result?.status || ''
}
const getObserverInfo = async () => {
  const result = await service.certification.getObserverId()
  unionIdObserver = result?.id || ''
  observerState.value = result?.status || ''
}
const getOrganizationInfo = async () => {
  const result = await service.certification.getOrganizationId()
  unionIdOrganization = result?.id || ''
  organizationState.value = result?.status || ''
}
const getEnterpriseInfo = async () => {
  const result = await service.certification.getEnterpriseId()
  unionIdEnterprise = result?.id || ''
  enterpriseState.value = result?.status || ''
}

const getUnionId = async () => {
  const result = await service.certification.getUnionId()
  return result
}

const goManager = async () => {
  const result = await getDetail() // 获取是否实名认证信息
  if (unionIdManager) { //是否有草稿id
    if (managerState.value === 'draft') {
      // 草稿中
      uni.navigateTo({
        url: '/pages/mine-identity/manager/index?unionId=' + unionIdManager
      })
    } else if (managerState.value === 'assisting') {
      // 去查看确权
      uni.navigateTo({
        url: '/pages/mine-identity/manager/authentication?unionId=' + unionIdManager
      })
    }
  } else {
    // 去创建
    if (idCard.value) {
      let unionId = await getUnionId() // 要先去实名认证
      uni.navigateTo({
        url: '/pages/mine-identity/manager/index?unionId=' + unionId
      })
    } else {
      let unionId = await getUnionId() // 要先去实名认证
      uni.navigateTo({
        url: '/pages/mine/identity/person?unionId=' + unionId + '&from=certification'
      })
    }
  }
}

const goObserver = async () => {
  if (unionIdObserver) { //是否有草稿id
    if (observerState.value === 'draft') {
      // 草稿中
      uni.navigateTo({
        url: '/pages/mine-identity/observer/index?unionId=' + unionIdObserver
      })
    } else if (observerState.value === 'refuse' || observerState.value === 'check') {
      // 去查看确权
      if (observerState.value === 'check') {
        uni.navigateTo({
          url: '/pages/mine/certification-state?unionId=' + unionIdObserver
        })
      } else {
        uni.navigateTo({
          url: '/pages/mine/certification-state-fail?unionId=' + unionIdObserver + '&from=observer'
        })
      }

    } else {
      let unionId = await getUnionId() // 要先去企业资质认证
      uni.navigateTo({
        url: '/pages/mine-identity/observer/index?unionId=' + unionId
      })
    }
  } else {
    // 去创建
    let unionId = await getUnionId() // 要先去企业资质认证
    uni.navigateTo({
      url: '/pages/mine-identity/observer/index?unionId=' + unionId
    })
  }
}
const goEnterprise = async () => {
  if (unionIdEnterprise) { //是否有草稿id
    if (enterpriseState.value === 'draft') {
      // 草稿中
      uni.navigateTo({
        url: '/pages/mine-identity/enterprise/index?unionId=' + unionIdEnterprise
      })
    } else if (enterpriseState.value === 'refuse' || enterpriseState.value === 'check') {
      // 去查看确权
      if (enterpriseState.value === 'check') {
        uni.navigateTo({
          url: '/pages/mine/certification-state?unionId=' + unionIdEnterprise
        })
      } else {
        uni.navigateTo({
          url: '/pages/mine/certification-state-fail?unionId=' + unionIdEnterprise + '&from=enterprise'
        })
      }

    } else {
      //  accept
      let unionId = await getUnionId() // 要先企业资质认定
      uni.navigateTo({
        url: '/pages/mine/identity/company?unionId=' + unionId + '&from=enterprise'
      })
    }
  } else {
    // 去创建
    let unionId = await getUnionId() // 要先企业资质认定
    uni.navigateTo({
      url: '/pages/mine/identity/company?unionId=' + unionId + '&from=enterprise'
    })
  }
}
const goOrganization = async () => {
  if (unionIdOrganization) { //是否有草稿id
    if (organizationState.value === 'draft') {
      // 草稿中
      uni.navigateTo({
        url: '/pages/mine-identity/organization/index?unionId=' + unionIdOrganization
      })
    } else if (organizationState.value === 'refuse' || organizationState.value === 'check') {
      // 拒绝
      if (organizationState.value === 'check') {
        uni.navigateTo({
          url: '/pages/mine/certification-state?unionId=' + unionIdOrganization
        })
      } else {
        uni.navigateTo({
          url: '/pages/mine/certification-state-fail?unionId=' + unionIdOrganization + '&from=organization'
        })
      }
    } else {
      let unionId = await getUnionId()  // 要先去企业资质认证
      uni.navigateTo({
        url: '/pages/mine/identity/company?unionId=' + unionId + '&from=organization'
      })
    }
  } else {
    // 去创建
    let unionId = await getUnionId()  // 要先去企业资质认证
    uni.navigateTo({
      url: '/pages/mine/identity/company?unionId=' + unionId + '&from=organization'
    })
  }
}

let limit2 = ref()
let limit = ref()
let min2 = ref()
let min = ref()
const getDictionaryLimit = async (code:any) => {
  const result = await service.app.getDictionary({dictCode: code})
  result.forEach((key:any) => {
    if (key.itemValue === 'jg_max') {
      limit2.value =  key.description*1
    }
    if (key.itemValue === 'jl_max') {
      limit.value = key.description*1
    }
    if (key.itemValue === 'jl_min') {
      min.value = key.description*1
    }
    if (key.itemValue === 'jg_min') {
      min2.value = key.description*1
    }
  })
}


onShow(async () => {
  await getDictionaryLimit('assist_number')
  await getManagerInfo()
  await getObserverInfo()
  await getOrganizationInfo()
  await getEnterpriseInfo()
  loading.value = false
})





</script>

<style scoped lang="scss">
.container {
  position: relative;
  opacity: 0.2;
}

.loaded {
  transition: opacity 1s;
  opacity: 1;
}

.wrap {
  // padding: 0 32rpx;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.icon {
  width: 100rpx;
  height: 100rpx;
  min-width: 100rpx;
  border-radius: 50%;
}

.desc {
  max-width: 390rpx;
  min-width: 390rpx;
  word-break: break-all;
}

.title {
  height: 210rpx;
  display: flex;
  align-items: center;

}

.img {
  width: 100%;
  height: 210rpx;
}

.bold {
  font-weight: bold;
}

.create-btn {
  /* padding: 18rpx 40rpx; */
  text-align: center;
  line-height: 56rpx;
  width: 148rpx;
  height: 56rpx;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 26rpx;
  color: #FFFFFF;
  border-radius: 56rpx;
  background: $--ym-bg-primary;

  &.yellow{
    background: linear-gradient(270deg, #FDB448 0%, #FF8300 100%);
  }
}

.state-btn {
  display: flex;
  align-items: center;
  position: relative;
  color: #0077FF;
  font-size: 24rpx;
  padding-left: 24rpx;

  &:before {
    content: '';
    width: 12rpx;
    height: 12rpx;
    background-color: #0077FF;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .img {
    width: 24rpx;
    height: 24rpx;
  }
}
</style>
