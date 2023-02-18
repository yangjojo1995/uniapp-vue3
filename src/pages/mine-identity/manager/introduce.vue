<template>
<view class="main-container">
  <view>
    <view class="login-form-item u-p-y-20">
      <textarea v-model="params.summary" class="login-textara" :maxlength="-1" placeholder-class="login-placeholder" placeholder="请输入个人简介(2000字以内)" />
      </view>

</view>
      <view class="fs-24 flex jc-end text-color-secondary u-p-y-16 u-p-x-32" >
        {{maxLength}}/2000
      </view>

<view >

<view class="next-btn u-m-t-80" @click="submit">确定</view>

</view>

</view>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  computed
} from 'vue'
import {
  onLoad,
  onShow
} from "@dcloudio/uni-app";
import {
  router,
  useService,
  useConfig,
  useRouter,
  setToken,
  setUserInfo
} from '@/plugins/app-core'

const service = useService()
const unionId = ref('')
let isSubmit = false
let isEdit = false
const params: any = reactive({
  id: '',
  summary: '',
})

const maxLength = computed(() =>  params.summary ?params.summary.length : 0)
const submit = async () => {
  if (params.summary === ''  || params.summary == undefined || params.summary == null) {
    uni.showToast({
      icon: 'none',
      title: '请输入个人简介'
    })
    return
  } else {
    if (params.summary.length > 2000) {
      uni.showToast({
        icon: 'none',
        title: '个人简介最多输入2000字'
      })
      return
    }
    if (params.summary.replace(/\s/g, '').length === 0) {
      uni.showToast({
        icon: 'none',
        title: '请输入个人简介'
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
      const result = await service.certification.addManagerDraft(params)
      setTimeout(() => {
        uni.hideLoading()
        isSubmit = false
        uni.navigateBack({
          delta: 1
        })
      }, 500)
    } else {
      uni.$emit('manager:summary', params.summary)
			uni.navigateBack({
				delta:1 
			})
    }
   
  } catch (error) {
     isSubmit = false
  }
}

const getManagerDetail = async () => {
  const result = await service.certification.getManagerDetail({
    id: unionId.value
  })
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key: string) => {
      params[key] = result[key]
    })
  }
  params.id = unionId.value
}
const getCurrentInfo = async () => {
  try {
    const result = await service.manager.getCurrentManagerInfo()
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
  getManagerDetail()
  }
})
</script>

<style lang="scss">
.login-form-item {
  border-bottom: 2rpx solid rgba(240, 242, 245, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login-placeholder {
  font-size: 28rpx;
  color: #B2B2B2;
}

.login-textara {
  border: 1rpx solid #eee;
  height: 440rpx;
  font-size: 28rpx;
  padding: 20rpx 20rpx;
  background-color: #fff;
  width: 100%;
  border-radius: 8rpx;
}

.red {
  color: red;
}
</style>
