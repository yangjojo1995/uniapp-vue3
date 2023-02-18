<template>
  <view class="introduce">
    <view class="introduce-title">
      <text><text class="require">*</text>详情介绍</text>
      <text>{{params.content.length || 0}}/2000</text>
    </view>
    <textarea class="textarea" maxlength="-1" v-model.trim="params.content"></textarea>
    <view class="introduce-title">上传图片</view>
    <view class="introduce-box">
      <view class="pic" v-for="item,index in params.pictures" :key="index" >
        <view class="delete" @click="deleteImg(index)">×</view>
        <image :src="assets(item)" class="img" mode="aspectFit"></image>
      </view>
      <view class="pic" @tap="chooseFile" v-if="params.pictures.length<6">
        <image src="../../../assets/certification/add.png" class="img"></image>
      </view>
    </view>

    <ym-footer>
      <view class="footer-btn flex-center green-bg" @click="submitForm">保存</view>
    </ym-footer>
  </view>
</template>

<script setup lang="ts">
import { ref, refType, onLoad, reactive, useService, useConfig, requireCheck, operateConfirm} from '@/utils/commonUse'
import assets from '@/utils/assets'
const service = useService()
const config = useConfig()
const coverImg = ref('')
const type = ref('')
const params: any = reactive({
  id: '',
  content: '',
  pictures: []
})

// 反显界面
const getDrafDetail = async () => {
  let data = await service.activity.getDraftDetail({id: params.id})
  if (!Array.isArray(data.pictures)) {
    Object.assign(data.pictures, [])
  }
  Object.assign(params, data)
}

onLoad(async (options) => {
  params.id = options.id
  await getDrafDetail()
})

// 选择图片
const chooseFile = () => {
  uni.chooseImage({
    count: 6 - params.pictures.length,
    success: res => {
      if(Array.isArray(res.tempFilePaths)){
        res.tempFilePaths.forEach(function(ele){
          uploadFile(ele)
        })
      }
    }
  })
}

// 上传图片
const uploadFile = async (filePath: any) => {
  const result = await service.app.uploadFile({
    filePath: filePath
  })
  const file = JSON.parse(result.data)
  params.pictures.push(file.data.url)
}

// 删除图片
const deleteImg = (index: string) => {
  params.pictures.splice(index,1)
}

const submitForm = () => {
  if(requireCheck('请输入详情介绍', params.content)) return
  if(requireCheck('详情介绍2000字内', params.content.length<=2000)) return
  operateConfirm('保存详情', async () => {
    return await service.activity.createActivity(params)
  })
}


</script>

<style lang="scss" scoped>
.introduce{
  margin: 20rpx 0 32rpx;
  padding: 0 32rpx 64rpx;
  background-color: #fff;
  overflow: hidden;

  .introduce-title{
    margin: 60rpx 0 38rpx;
    display: flex;
    justify-content: space-between;
  }

  .textarea{
    width: 100%;
    height: 414rpx;
    background: #F7F7F7;
    border-radius: 12rpx;
    padding: 32rpx;
    color: #333;
    font-size: 26rpx;
    box-sizing: border-box;
    line-height: 20px;
  }

  .introduce-box{
    display: flex;
    margin: 16rpx 0;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

.pic{
  position: relative;
  margin-bottom: 32rpx;
  background: #F7F7F7;
  border: 1px dotted #999;
  border-radius: 8rpx;
  width: 192rpx;
  height: 108rpx;
  margin: 32rpx 16rpx 24rpx;
  position: relative;

  .delete{
    width: 32rpx;
    height: 32rpx;
    background: #B8B8B8;
    border-radius: 32rpx;
    color: #fff;
    line-height: 32rpx;
    text-align: center;
    position: absolute;
    right: -16rpx;
    top: -16rpx;
  }

  .img{
    width: 100%;    
    height: 100%;
  }
}

.footer-btn{
  width: 686rpx;
  height: 82rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 500;
  margin: 0 8rpx;
}

.green-bg {
  background: $--ym-bg-primary;
  color: #fff;
}
</style>