<template>
<view class="content u-p-x-64 bg-white">
  <view class="u-p-t-60 border">
    <view class="fs-28 text-color-primary bold  input-label">上传加盖印章的营业执照附件照片（非必填）</view>
    <view class="picture flex ai-center u-p-b-24 u-p-t-46">
      <view class="pic" v-if="fullBusinessLicense">
        <image :src="fullBusinessLicense" @tap="previewImage(fullBusinessLicense)" class="img"></image>
        <image class="del-icon" src="../../../assets/certification/del-icon.png" @tap.stop="deleteFile"></image>
      </view>
      <view class="pic" @tap="chooseFile" v-else>
        <image src="../../../assets/certification/add.png" class="img"></image>
      </view>
    </view>
  </view>
  <view class="next-btn  u-m-t-60" @tap="check">保存</view>
</view>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  computed
} from 'vue'
import {
  onPullDownRefresh,
  onReachBottom,
  onLoad
} from "@dcloudio/uni-app";
import {
  router,
  useService,
  useConfig,
  useRouter,
  setToken,
  setUserInfo
} from '@/plugins/app-core'

let isSubmit = false
const from = ref('')
const unionId = ref('')
const fullBusinessLicense = ref('')
const params: any = reactive({
  id: '',
  businessLicense: ''
})
const config = useConfig()
const service = useService()

const check = async () => {
  if (isSubmit) {
    return false
  }
  isSubmit = true
  uni.showLoading({})
  try {
    const result = await service.certification.addObserverDraft({
      id: unionId.value,
      businessLicense: params.businessLicense
    })
    setTimeout(() => {
      uni.hideLoading()
      isSubmit = false
      uni.navigateBack({
        delta: 1
      })
    }, 500)
  } catch (error) {
    isSubmit = false 
  }

}
const previewImage = (url: any) => {
  uni.previewImage({
    current: url + '?original=true',
    urls: [url + '?original=true']
  })
}

const deleteFile = () => {
  fullBusinessLicense.value = ''
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
const uploadFile = async (filePath: any) => {
  const result = await service.app.uploadFile({
    filePath: filePath[0]
  })
  const file = JSON.parse(result.data)
  fullBusinessLicense.value = config.ASSETS_BASE_URL + file.data.url
  params.businessLicense = file.data.url
}

const getObserverDetail = async () => {
  const result = await service.certification.getObserverDetail({
    id: unionId.value
  })
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key: string) => {
      console.log(key)
      if (key === 'businessLicense') {
        fullBusinessLicense.value = result[key]?config.ASSETS_BASE_URL + result[key]: ''
      }
      params[key] = result[key]
    })
  }
  params.id = unionId.value
}

onLoad((options) => {
  unionId.value = options.unionId || ''
  getObserverDetail()
})
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
}

.border {
  border-bottom: 1rpx solid #F2F2F2;
}

.label-required {
  position: relative;
  display: inline-block;

  &:after {
    content: '*';
    color: #FF4536;
    position: absolute;
    right: -20rpx;
    top: 50%;
    transform: translateY(-50%);
  }
}

.picture {
  .pic {
    position: relative;
    margin-right: 32rpx;
    background: #F7F7F7;

    .img {
      max-width: 162rpx;
      min-width: 162rpx;
      height: 108rpx;
      border-radius: 6rpx;
      overflow: hidden;
    }

    .del-icon {
      width: 32rpx;
      height: 32rpx;
      position: absolute;
      top: -16rpx;
      right: -16rpx;

    }
  }
}
</style>
