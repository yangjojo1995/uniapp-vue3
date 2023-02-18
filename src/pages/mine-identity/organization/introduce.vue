<template>
	<view class="main-container">
			<view >
				<view class="login-form-item u-p-y-20">
					<textarea v-model="params.introduction"  class="login-textara" :maxlength="-1"  placeholder-class="login-placeholder" placeholder="提示：1.私募股权投资基金管理公司还需介绍管理（累计和在管）基金个数、规模，是否管理母基金，母基金下自主管理（累计和在管）的子基金个数、认缴及实缴金额，农业投资项目个数及典型案例简述，投资收益情况，行业地位，核心竞争力。 2.综合类证券公司，投行业务排名，农业领域保荐项目、成功上市项目案例。 3.产业投资机构，近3年营业收入、净利润、投资金额，专攻细分领域，未来产业发展和投资规划。"  />
				</view>
			</view>
      <view class="fs-24 flex jc-end text-color-secondary u-p-y-16 u-p-x-32" >
        {{maxLength}}/2000
      </view>
			<view >
				<view class="next-btn u-m-t-80" @click="submit">保存</view>
			</view>
	</view>
</template>

<script lang="ts" setup>
 import {ref,reactive,computed} from 'vue'
import { onLoad,onShow } from "@dcloudio/uni-app";
import { router, useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'

const service = useService()
const unionId = ref('')
let isSubmit = false
let isEdit = false
const params:any= reactive({
  id: '',
  introduction: '',
})
const maxLength = computed(() => params.introduction? params.introduction.length:0)
const submit = async () => {
  if (params.introduction === ''  || params.introduction == undefined || params.introduction == null ) {
    uni.showToast({
      icon: 'none',
      title: '请输入单位简介'
    })
    return
  } else {
		if (params.introduction.length>2000) {
			uni.showToast({
				icon: 'none',
				title: '单位简介最多输入2000字'
			})
			return
		}
    if (params.introduction.replace(/\s/g, '').length === 0) {
      uni.showToast({
        icon: 'none',
        title: '请输入单位简介'
      })
      return
    }
	}
	 if (isSubmit) {
    return false
  }
  isSubmit = true
   
  uni.showLoading({})
  try {
    
    if (!isEdit) {
 		const result = await service.certification.addOrganizationDraft(params)
    setTimeout(() => {
      uni.hideLoading()
      isSubmit = false
        uni.navigateBack({
          delta: 1
        })
    }, 500)
		} else {
			uni.$emit('organization:summary', params.introduction)
			uni.navigateBack({
				delta:1 
			})
		}
  
    } catch (error) {
      isSubmit = false 
  }
}

const getOrganizationDetail = async () => {
  const result = await service.certification.getOrganizationDetail({id: unionId.value})
  if (result!==null &&result!==undefined) {  
    Object.keys(params).forEach((key:string) => {
      params[key] = result[key]
    })
  }
   params.id = unionId.value
}
const getCurrentInfo = async () => {
  try {
    const result = await service.organization.getCurrentOrganizationInfo()
    Object.assign(params, result)
  } catch (error) {
    
  }
}
onLoad(async (options) => {
 if (options.edit) {
		isEdit= true
		getCurrentInfo()
	} else {
  unionId.value = options.unionId || ''
  getOrganizationDetail()
  }
})
</script>

<style lang="scss" >
.login-form-item{
	  border-bottom:2rpx solid rgba(240, 242, 245, 0.3);
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	}
	.login-placeholder{
	  font-size: 28rpx;
		color:#B2B2B2;
	}
		.login-textara{
			border: 1rpx solid #eee;
			height:440rpx;
			font-size: 28rpx;
			padding: 20rpx 20rpx;
			background-color: #fff;
			width:100%;
			border-radius: 8rpx;
		}
    .red{
      color:red;
    }
</style>
