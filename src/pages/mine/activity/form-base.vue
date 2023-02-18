<template>
  <view class="form-view">

    <view class="message" v-if="messageShow">
      提示：
      <text class="message-link" @click="copyLink">复制链接</text>
      登录乡产投盟PC网站编辑更方便
      <text class="message-close" @click="closeMsg"> × </text>
    </view>

    <view class="card">
      <view class="card-title">活动封面图</view>
      <view class="card-box">
        <view class="card-box-left">
          <view class="card-box-left-title"><text class="require">*</text>上传封面</view>
          <view class="card-box-left-des">建议长宽比：16:9</view>
        </view>
        <view class="view-cover"  @click="goCover">
          <image mode="aspectFit" v-if="coverImg" :src="assets(coverImg)"></image>
          <image mode="aspectFit"  src="../../../assets/certification/add.png"></image>
        </view>
      </view>
      
    </view>
    			
    <view class="card">
      <view class="card-title">基本信息</view>
      <view class="form-card">
        <view class="form-card-group">
          <text class="form-card-group-label"><text class="require">*</text>活动标题</text>
          <u-input class="form-card-group-input" maxlength="25" trim="true" input-align="right" v-model="params.title"    border="false" placeholder="请输入"></u-input>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label"><text class="require">*</text>活动地址</text>
          <u-input class="form-card-group-input" maxlength="100" trim="true" input-align="right" v-model="params.address"    border="false" placeholder="请输入"></u-input>
          <!-- <view class="form-card-group-label-error">请填写活动标题</view> -->
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label"><text class="require">*</text>活动开始时间</text>
          <view class="form-card-group-datetime" style="flex-grow:0"> 
            <uni-datetime-picker placeholder="请选择活动开始时间" return-type="timestamp" v-model="params.beginTime" class="datetime-input" :border="false" :clear-icon="false" type="datetime" hide-second></uni-datetime-picker>
          </view>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label"><text class="require">*</text>活动结束时间</text>
          <view class="form-card-group-datetime" style="flex-grow:0"> 
            <uni-datetime-picker placeholder="请选择活动结束时间" return-type="timestamp" v-model="params.endTime" class="datetime-input" :border="false" :clear-icon="false" type="datetime" hide-second></uni-datetime-picker>
          </view>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">指导单位</text>
          <u-input class="form-card-group-input" maxlength="100" trim="true" input-align="right" v-model="params.director"    border="false" placeholder="请输入"></u-input>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label"><text class="require">*</text>主办方</text>
          <u-input class="form-card-group-input" maxlength="100" trim="true" input-align="right" v-model="params.organizer"    border="false" placeholder="请输入"></u-input>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">承办方</text>
          <u-input class="form-card-group-input" maxlength="100" trim="true" input-align="right" v-model="params.undertaker"    border="false" placeholder="请输入"></u-input>
        </view>
        <view class="form-card-group">
          <text class="form-card-group-label">支持单位</text>
          <u-input class="form-card-group-input" maxlength="100" trim="true" input-align="right" v-model="params.supporter"    border="false" placeholder="请输入"></u-input>
        </view>
      </view>
    </view>

    <view class="footer-btn flex-center green-bg" @click="submitBase">保存并继续</view>

    <view class="touch">
      <view class="touch-title">提示</view>
      <view class="touch-group"><view class="touch-group-icon"></view>通过电脑端乡产投盟网站发活动更方便快捷</view>
      <view class="touch-group"><view class="touch-group-icon"></view>发布活动后，即可开始报名，直至活动开始时间前两个小时，报名结束，并开启签到，请谨慎填写活动开始和结束时间</view>
    </view>

    <!-- <ym-footer style="z-index: 1">
      <view class="footer-btn flex-center green-bg">保存并继续</view>
    </ym-footer> -->
    
  </view>

</template>

<script lang="ts" setup>
import { ref, onLoad, reactive, useService, useConfig, requireCheck, operateConfirm} from '@/utils/commonUse'
import dayjs from 'dayjs'
import assets from '@/utils/assets'

const config = useConfig()
const service = useService()
const coverImg = ref('')
const type = ref('')
const params: any = reactive({
  id: '',
  image: '',
  title: '',
  beginTime: '',
  endTime: '',
  address: '', // 活动地点
  organizer: '', //主办方
})


// 反显界面
const getDrafDetail = async () => {
  let data = await service.activity.getDraftDetail({id: params.id})
  if (data === null) {
    return
  }
  coverImg.value = data.image
  Object.assign(params, data)
}


onLoad(async (options) => {
  params.id = options.id
  await getDrafDetail()
})

// 检查时间
function checkTime() {
  const beginTime = dayjs(params.beginTime)
  const endTime = dayjs(params.endTime)
  const currentTiem = dayjs()

  // 活动开始时间必须大于当前时间两小时以上
  const expectBegin = dayjs(currentTiem).add(2, 'hour')
  if(!beginTime.isAfter(expectBegin) ){
    requireCheck('活动开始时间必须大于当前时间两小时以上')
    return true
  }
  // 结束时间必须大于开始时间
  if(beginTime.isAfter(endTime)){
    requireCheck('结束时间必须大于开始时间')
    return true
  }
  return false  
}

const submitBase = () => {
  if(requireCheck('请选择活动封面', params.image)) return
  if(requireCheck('请输入活动标题', params.title, )) return
  if(requireCheck('请输入活动地址', params.address, )) return
  if(requireCheck('请输入开始时间', params.beginTime, )) return
  if(requireCheck('请输入结束时间', params.endTime, )) return
  if(requireCheck('请输入主办方', params.organizer, )) return
  if(checkTime()) return
  operateConfirm('提交', async () => {
    return await service.activity.createActivity(params)
  }, function () {
    uni.navigateTo({ url: `./form-view?id=${params.id}` })
  })
}

const goCover = () => {
  uni.$once('uAvatarCropper', async (path) => {
    let result = await service.app.uploadFile({
      filePath: path
    })
    let file = JSON.parse(result.data)
    params.image = file.data.url ? file.data.url : ''
    coverImg.value = file.data.url ? config.ASSETS_BASE_URL + file.data.url : ''
  })
  uni.navigateTo({
    url: '/pages/cropper/cropper_bak?destWidth=' + 360 + '&rectWidth=' + 360 + '&ratio=' + 0.56
  })
}

// 顶部提示
const messageShow = ref(true)
const closeMsg = () => {
  messageShow.value = false
}
const copyLink = () => {
  uni.setClipboardData({
    data: 'https://gdxctm.cn/login',
    success: function () {
		uni.showToast({
			title:'复制成功',
			icon:'none'
		})
    }
  })
}

</script>

<style lang="scss" scoped>
.form-view{
  overflow: hidden;
}

.message {
  font-size: 24rpx;
  padding: 16rpx 32rpx 0rpx;
  position: relative;

  .message-link{
    color: #2440b3;
    text-decoration:underline;
    margin-right: 4rpx;
  }

  .message-close{
    position: absolute;
    right: 32rpx;
    font-size: 36rpx;
    display: inline-block;
    height: 32rpx;
    width: 32rpx;
    text-align: center;
    line-height: 32rpx;
  }
}

.card{
  margin: 20rpx 0;
  padding: 0 32rpx;
  background-color: #fff;

  .card-title{
    position: relative;
    display: flex;
    width: 100%;
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
    image{
      width: 36rpx;
      height: 36rpx;
    }
  }

  .card-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 56rpx 0;
    align-items: center;
    
    .card-box-left{
      width: 360rpx;
      flex-grow: 1;

      .card-box-left-title{
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
        margin-bottom: 16rpx;
      }

      .card-box-left-des{
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
      }
    }

    
  }

  .form-card{
    overflow: hidden;
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
      position: relative;

      .form-card-group-label{
        flex: 0 0 200rpx;
        margin-right: 24rpx;
        font-size: 26rpx;
        color: #999;
      }

      .form-card-group-input {
        color: #303133;
        font-size: 26rpx;
        flex: 1;
        padding-right: 30rpx;
      }

      .form-card-group-value{
        word-break: break-all;
        flex-grow: 1;
        font-size: 26rpx;
        color: #666;
        text-align: right;
      }

      .form-card-group-label-error{
        color: #FF4536;
        font-size: 24rpx;
        position: absolute;
        transform: scale(0.8);
        bottom: -12px;
        left: -8px;
      }

      .form-card-group-datetime{
        color: #303133;
        font-size: 26rpx;
        flex-grow: 0;
        width: 360rpx;
      }
    }
  }
}

.touch{
  background: #FFF2DE;
  padding: 32rpx;
  margin: 20rpx 0 160rpx;

  .touch-title{
    font-size: 28rpx;
    font-weight: 500;
    color: #FF9F00;
    margin: 8rpx 0 12rpx;
  }

  .touch-group{
    font-size: 24rpx;
    font-weight: 400;
    color: #FF9F00;
    margin: 16rpx 0;

    .touch-group-icon{
      width: 10rpx;
      height: 10rpx;
      border-radius: 10rpx;
      background: #FF9F00;
      display: inline-block;
      margin-right: 16rpx;
      margin: 6rpx;
    }
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


::v-deep.datetime-input{
  padding: 0;
  text-align: right;

  .uni-date-x.uni-date-single{
    .uni-icons{
      display: none;
    }
  }

  .uni-date__x-input{
    padding: 0;
  }
  .uni-icons.uniui-calendar{
    display: hidden;
  }
}

.view-cover{
  width: 192rpx;
  height: 116rpx;
  border-radius: 6rpx;
  overflow: hidden;
  background: #F7F7F7;
  border: 1px dotted #999;

  image{
    width: 100%;
    height: 100%;
  }
}
</style>