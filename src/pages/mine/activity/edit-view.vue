<template>
  <view class="form-view">
    
    <view class="card">
      <view class="card-title">基本信息
        <view class="card-title-right" @click="goBase"><image src="../../../assets/certification/go-edit.png"/></view>
      </view>
      <view class="form-card">
        <view class="form-card-group">
          <text class="form-card-group-label">封面</text>
          <view class="view-cover"><image mode="aspectFit" :src="assets(params.image) || projectDefaultImg"></image></view>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">活动标题</text>
          <text class="form-card-group-value">{{params.title}}</text>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">活动地址</text>
          <text class="form-card-group-value">{{params.address }}</text>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">活动开始时间</text>
          <text class="form-card-group-value">{{dayjs(params.beginTime).format('YYYY-MM-DD HH:mm') }}</text>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">活动结束时间</text>
          <text class="form-card-group-value">{{dayjs(params.endTime).format('YYYY-MM-DD HH:mm')}}</text>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">指导单位</text>
          <text class="form-card-group-value">{{params.director || '-'}}</text>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">主办方</text>
          <text class="form-card-group-value">{{params.organizer}}</text>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">承办方</text>
          <text class="form-card-group-value">{{params.undertaker || '-'}}</text>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">支持单位</text>
          <text class="form-card-group-value">{{params.supporter || '-'}}</text>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="card-title">详情介绍
        <view class="card-title-right" @click="goIntroduce"><image class="edit" src="../../../assets/certification/go-edit.png"/></view>
      </view>
      <view class="form-card" v-html="contentHtml">
      </view>
      <view class="form-picture" v-for="(item, i) in params.pictures" :key="i">
        <image @click="previewImg(item)" :src="assets(item)" mode="widthFix"></image>
      </view>
    </view>
    <view style="height:260rpx"></view>
    <ym-footer>
      <view class="footer-btn flex-center green-bg" @click="confirmForm">提交</view>
    </ym-footer>

  </view>

</template>

<script lang="ts" setup>
import { ref, onLoad, reactive, useService, requireCheck, operateConfirm, onShow} from '@/utils/commonUse'
import projectDefaultImg from '@/assets/mine/project-default.png'
import assets from '@/utils/assets'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { previewImg  } from "@/utils/preview";

const service = useService()
const type = ref('')
const params: any = reactive({
  id: '',
  image: '',
  title: '',
  beginTime: '',
  endTime: '',
  address: '', // 活动地点
  organizer: '', //主办方
  content: '',
  pictures: []
})
const contentHtml = computed(()=> params.content? params.content.replace(/\n/g, '<br/>'):'')

/* 反显表单，从本地store中读取存储草稿，若不存在，则根据id查详情 */
const getDetail = async () => {
  let detail = uni.getStorageSync('editActivity')
  if(detail && detail.id === params.id){
    Object.assign(params, detail)
  }else{
    let data = await service.activity.getActivityInfo({id: params.id})
    Object.assign(params, data)
    uni.setStorageSync('editActivity', params)
  }
}

onLoad(async (options) => {
  params.id = options.id
  type.value = options.type || ''
})
onShow(() => {
  getDetail()
})

const goBase = () => {
  uni.navigateTo({url: './edit-base?id=' + params.id})
}

const goIntroduce = () => {
  uni.navigateTo({url: './edit-introduce?id=' + params.id})
}

// 提交表单
const confirmForm = () => {
  if(requireCheck('请补全活动详情', params.content)) return
  operateConfirm('提交活动', async () => {
    return await service.activity.updateActivity(params)
  }, function () {
    uni.redirectTo({ url: './form-success' })
  })
}


</script>

<style lang="scss" scoped>
.card{
  margin: 20rpx 0 32rpx;
  padding: 0 32rpx;
  background-color: #fff;

  .card-title{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 36rpx;
    padding: 48rpx 0;
    color: #333;
    font-weight: bold;
    border-bottom: 1rpx solid #ECE7E3;
    

    &::before{
      content: "";
      width: 8rpx;
      height: 36rpx;
      background: $--ym-bg-primary;
      border-radius: 8rpx;
      position: absolute;
      left: -32rpx;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 4rpx;
      
    }

    .card-title-right{
      width: 76rpx;
      height: 76rpx;
      image{
        margin: 20rpx;
        width: 36rpx;
        height: 36rpx;
      }
    }

    
  }

  .form-card{
      
      font-size: 26rpx;
      font-weight: 400;
      color: #666666;
      line-height: 40rpx;
      margin-top: 20rpx;

    .form-card-group{
      margin-bottom: 32rpx;
      justify-content: space-between;
      align-items: center;
      display: flex;
      max-width: 686rpx;

      .form-card-group-label{
        flex: 0 0 200rpx;
        margin-right: 24rpx;
        font-size: 26rpx;
        color: #999;
      }

      .form-card-group-value{
        word-break: break-all;
        flex-grow: 1;
        font-size: 26rpx;
        color: #666;
        text-align: right;
        max-width: 558rpx;
        word-break: break-all;
      }
    }
  }

  .form-picture{
    width: 684rpx;
    border-radius: 6rpx;
    margin: 32rpx 0;

    image{
      width: 684rpx;
    }
  }
}

.view-cover{
  width: 192rpx;
  height: 116rpx;
  border-radius: 6rpx;
  overflow: hidden;
  background: #F7F7F7;

  image{
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
  margin: 32rpx;
}

.green-bg {
  background: $--ym-bg-primary;
  color: #fff;
}
</style>