<template>
  <view>
    <view class="ym-card user-card">
      <view class="user-info">
        <image class="user-info-bg" :src="config.ADMIN_ASSETS_URL + 'info-bg.png'"></image>
        <view class="user-info-title flex jc-between">
          <view class="flex-1 content">
            <view class="u-m-b-20">
              <text class="fs-32 text-color-primary bold">{{authenticInfo.name}}</text>
            </view>
            <view class="user-info-group ">
              <image src="../../../assets/certification/address.png" class="icon" />
              <!-- <text class="label">所属地区：</text> -->
              <text class="word-break">{{authenticInfo.belongProvinceStr}}{{authenticInfo.belongCityStr}}</text>
            </view>
            <view class="user-info-group ">
              <image src="../../../assets/certification/enterprise.png" class="icon" />
              <!-- <text  class="label">所属机构：</text> -->
              <text class="word-break">{{authenticInfo.investInstitution  || '未填写'}}</text>
            </view>
              <view class="user-info-group ">
              <image src="../../../assets/certification/pos.png" class="icon" />
              <!-- <text  class="label">职位：</text> -->
              <text class="word-break">{{authenticInfo.position  || '未填写'}}</text>
            </view>
            <view class="user-info-group ">
              <image src="../../../assets/certification/phone.png" class="icon" />
              <!-- <text  class="label">联系电话：</text> -->
              <text class="word-break">{{authenticInfo.phone || '未填写'}}</text>
            </view>
            <view class="user-info-group ">
              <image src="../../../assets/certification/email.png" class="icon" />
              <!-- <text  class="label">联系邮箱：</text> -->
              <text class="word-break">{{authenticInfo.email  || '未填写'}}</text>
            </view>
          </view>   
          <view class="user-icon">
            <image :src="assets(authenticInfo.avatar)" ></image> 
          </view>
        </view>
      </view>
    </view>

    <view class="ym-card">
      <view class="introduce u-p-32 bg-white  u-m-b-20">
        <view class="text-color-primary fs-28 u-m-b-10 bold">个人简介</view>
        <view class="introduce-desc text-color-secondary fs-24" v-html="contentHtml"></view>
      </view>
    </view>

    <view class="ym-card">
     <view class="introduce u-p-32 bg-white  u-m-b-20">
        <view class="text-color-primary fs-28 u-m-b-10 bold u-p-b-32">投资偏好</view>
        <view class="flex jc-between u-m-b-32">
           <text class="text-color-third fs-24 label">关注地区</text>
           <view class="text-color-secondary fs-24 value flex-1">
             {{mapJoin(authenticInfo.focusAreasStr, 'cityIdStr')}}
            </view>
        </view>
          <view class="flex jc-between u-m-b-32">
           <text class="text-color-third fs-24 label" >投资领域</text>
           <view class="text-color-secondary fs-24 value flex-1">
              {{mapJoin(authenticInfo.investFieldsStr, 'itemName')}}
            </view>
        </view>
          <view class="flex jc-between u-m-b-32">
           <text class="text-color-third fs-24 label">投资轮次</text>
            <view class="text-color-secondary fs-24 value flex-1">
               {{mapJoin(authenticInfo.investRoundsStr, 'itemName')}}
            </view>
        </view>
          <view class="flex jc-between">
           <text class="text-color-third fs-24 label">单笔投额</text>
           <text class="text-color-secondary fs-24">{{authenticInfo.investment}}</text>
        </view>
      </view>
    </view>
    <view class="ym-card">
      <view class="u-p-32 bg-white">
        <view class="text-color-primary fs-28 u-m-b-10 bold u-p-b-32">自我承诺签名</view>
        <view class="flex ai-center jc-center">
            <image class="signature" mode="widthFix" :src="assets(authenticInfo.signatureUrl)" @click="previewImg(authenticInfo.signatureUrl, [])"></image>
        </view>
      </view>
    </view>

    <view class="ym-card">
      <view class="u-p-32 bg-white  u-m-b-80">
        <view class="text-color-primary fs-28 u-m-b-10 bold u-p-b-32">确权信息</view>
        <view class="progress-wrap">
          <view class="progress-item" v-for="(item, index) in authenticInfo.assistProcess" :key="item.id">
              <view class=" flex ai-center">
                  <image src="../../../assets/mine/chain.png" class="u-m-r-20 chain"></image>
                  <text class="text-color-primary bold">{{item.process}}</text>
              </view>
              <view class="progress-info">
                <view class="flex jc-between info-item">
                  <text class="text-color-third fs-24 label">{{index==0 ? '发起人' : '确权人'}}</text>
                  <text class="text-color-secondary fs-24">{{item.representativeIdStr}}</text>
                </view>
                <view class="flex jc-between info-item">
                  <text class="text-color-third fs-24 label">{{index==0 ? '发起时间' : '确权时间'}}</text>
                  <text class="text-color-secondary fs-24">{{time.formatTime(item.createTime)}}</text>
                </view>
                <!-- <view class="flex jc-between info-item">
                  <text class="text-color-third fs-24 label">存证哈希</text>
                  <text class="text-color-secondary fs-24">{{item.hash}}</text>
                </view> -->
              </view>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-btn-wrap fs-32" v-if="status=='assisting'">
      <view class="footer-inner safe">
        <view class="end-btn" @click="handleAgree">帮Ta确权</view>
        </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// http://vue3-hellouniapp.dcloud.net.cn/
// https://uniapp.dcloud.io/component/uniui/uni-ui.html
import assets from '@/utils/assets'
import time from '@/utils/time'
import { ref, reactive, computed } from 'vue'
import { onPullDownRefresh, onReachBottom,onLoad } from "@dcloudio/uni-app";
import { useService, useConfig, useRouter, setToken, setUserInfo } from '@/plugins/app-core'
import { previewImg  } from "@/utils/preview";

const keyword = ref('')
const detail = reactive({})
const service = useService()
const config = useConfig()
const statusStr = ref('')
let authenticInfo:any = reactive({})
const contentHtml = computed(()=>authenticInfo.summary?authenticInfo.summary.replace(/\n/g, '<br/>'):'')
function mapJoin (array: Array<{ [key: string]: any }>, key: string) {
  if (!!array && array.length!==0) {
   return array.map((item) => item[key]).join('、')
  } else {
    return ''
  }
}

// 确权状态
const status: any = ref('')
onLoad(async (options:any) => {
  const result = await service.mine.getAssistAuthenticInfo({assistId: options.assistId})
  Object.assign(authenticInfo,result)
  
  const assistData = await service.mine.getAssistStatus({assistId: options.assistId})
  status.value = assistData.status
})

async function operateProject(api: () => Promise<string>, operate: string){
  uni.showLoading({title: `${operate}中`})
  if( String(await api()) === 'true'){
    uni.showToast({title: `${operate}成功`});
    setTimeout(()=>{
      uni.navigateBack({})
    },1500)
  }else{
    uni.showToast({title: `${operate}失败，请稍后重试`});
  }
}


 const handleAgree = () => {
  uni.showModal({
    title: '提示',
    content: '确认协助确权吗',
    showCancel: true,
    success: function (res) {
      if (res.confirm) {
        operateProject(async ()=>{
          return await service.mine.agreeAssist({assistId: authenticInfo.assistId})
        }, '协助确权')
      }
    }
  })
 }

</script>

<style lang="scss" scoped>
.ym-card.user-card{
  background: transparent;
}
.user-info{
  padding: 32rpx 24rpx;
  position: relative;
  height: 332rpx;
  box-sizing: border-box;
  border-radius: 12rpx;
  border: 2rpx solid #fff;
  

  .user-info-bg{
    width: 702rpx;
    height: 332rpx;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
  }

  .user-info-group{
    font-size: 26rpx;
    font-weight: 400;
    color: #333333;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10rpx;
  }
}
.icon{
  width:32rpx;
  height:32rpx;
  min-width:32rpx;
  margin-right: 20rpx;
}
.user-icon{
  width: 92rpx;
  min-width: 92rpx;
  height: 92rpx;

  image{
    display: block;
    height:100%;
    width: 100%;
    border-radius: 50%;
  }
}
.introduce-desc{
  line-height: 40rpx;
  word-break: break-all;
}
.bold{
  font-weight: bold;
}
.label{
  min-width: 120rpx;
}
.value{
  word-break: break-all;
  text-align: right;
  letter-spacing: 1rpx;
}
.value-item{
  padding:0 16rpx;
  position: relative;
   &:after{
     content: '';
     width:1rpx;
     height:20rpx;
     background-color: #C6C6C6;
     position: absolute;
     right:0;
     top:50%;
     transform: translateY(-50%);
  }
  &:last-child {
    padding-right:0;
  }
 
}
.no-content{
  &:after {
    content: none;
  }
}
.chain{
  width: 32rpx;
  height:32rpx;
}
.progress-item{
  font-size: 24rpx;
}
.progress-info{
  padding:16rpx 0 16rpx 52rpx;
  margin:12rpx 0;
  position: relative;
  &:before{
    content: '';
    width:1rpx;
    height:100%;
    background-color: #B0F2D2;
    position: absolute;
    left:16rpx;
    top:0;
  }
}
.info-item{
  margin-bottom:20rpx;
}

.end-btn{
  padding:25rpx 106rpx;
  border-radius: 60rpx;
  background: $--ym-bg-primary;
  text-align: center;
  color: #fff;
}
.label{
  min-width:120rpx;
}
.content{
  max-width: 500rpx;
}
.signature{
  width:400rpx;
}
</style>
