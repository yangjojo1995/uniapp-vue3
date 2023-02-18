<template>
<view class="content u-p-x-64 bg-white">
  <view class="u-p-t-60 border">
    <view class="fs-28 text-color-primary bold  input-label label-required">请上传加盖印章的营业执照复印件/广东省乡产产业投资联盟申请表（二选一）</view>
    <view class="picture flex ai-center u-p-b-24 u-p-t-46 flex-wrap">
      <view class="pic u-m-b-20 u-m-r-20"  v-for="item,index in params.stampImage" :key="index">
        <image :src="assets(item)" @tap="previewImage(item)" class="img"></image>
        <image class="del-icon" src="../../../assets/certification/del-icon.png" @tap.stop="deleteFile(index)"></image>
      </view>
      <view class="pic u-m-b-20 u-m-r-20" @tap="chooseFile" v-if="params.stampImage.length<6">
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
import assets from '@/utils/assets';
let isSubmit = false
const from = ref('')
const unionId = ref('')
const fullStampImage = ref('')
const params: any = reactive({
  id: '',
  stampImage: []
})
const config = useConfig()
const service = useService()

const check = async () => {
  if (params.stampImage.length === 0 || params.stampImage == undefined || params.stampImage == null) {
    uni.showToast({
      icon: 'none',
      title: '请上传申请表或复印件照片'
    })
    return
  }

  if (isSubmit) {
    return false
  }
  isSubmit = true
  uni.showLoading({})
  try {
    const result = await service.certification.addOrganizationDraft({
      id: unionId.value,
      stampImage: params.stampImage
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
  url = assets(url)
  uni.previewImage({
    current: url + '?original=true',
    urls: [url + '?original=true']
  })
}

const deleteFile = (index:number) => {
  // fullStampImage.value = ''
  params.stampImage.splice(index,1)
}

const chooseFile = () => {
  uni.chooseImage({
    count:6-params.stampImage.length,
    sizeType:['compressed'],
    success: res => {
      uploadFile(res.tempFilePaths)
    }
  })
}
const uploadFile = async (filePath: any) => {
  const file = filePath.shift()
  const result = await service.app.uploadFile({
    filePath: file
  })
  const fileData = JSON.parse(result.data)
  params.stampImage.push(fileData.data.url)
    if (filePath.length >0) {
    uploadFile(filePath)
  } 
}

const getOrganizationDetail = async () => {
  const result = await service.certification.getOrganizationDetail({
    id: unionId.value
  })
  if (result !== null && result !== undefined) {
    Object.keys(params).forEach((key: string) => {
      // console.log(key)
      if (key === 'stampImage') {
          params[key] =  result[key] || []
      } else {
          params[key] = result[key]
      }
    })
  }
  params.id = unionId.value
}

onLoad((options) => {
  unionId.value = options.unionId || ''
  getOrganizationDetail()
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
