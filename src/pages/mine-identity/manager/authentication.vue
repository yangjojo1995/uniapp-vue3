<template>
  <view class="u-p-x-64 safe">
     <view class="text-center u-m-b-60">
        <image src="../../../assets/certification/wait.png" class="icon"></image>
        <view class="fs-36 text-color-primary u-p-t-44 u-p-b-30 bold">等待确权</view>
        <view class="fs-26 text-color-secondary">已提交认证确权，等待投资人确权</view>
        <view class="fs-26 text-color-secondary ">需要至少{{min2}}个投资机构或{{min}}位投资经理为您的身份确权</view>
     </view>  
      <view class="bg-white u-p-x-32 u-p-t-40 u-p-b-12 wrap">
          <view class="fs-24 text-color-primary bold u-p-b-30">已邀请投资经理：</view>
          <view class="manager-list">
              <view class="flex jc-between ai-center u-m-b-30" v-for="item,index in manager" :key="index">
                 <view class="fs-24 text-color-secondary flex-1">{{item.name}}</view>
                   <view class="fs-24" :class="item.status === '确权中'? 'default-color': 'theme-color'">
                    <image src="../../../assets/certification/wait.png" v-if="item.status === '确权中'"></image>
                    <image src="../../../assets/certification/authed.png"  v-if="item.status === '已确权'"></image>
                    <text>{{item.status}}</text>
                 </view>
              </view>
          </view>
          <view class="fs-24 text-color-primary bold  u-p-b-30">已邀请投资机构：</view>
          <view class="flex jc-between ai-center u-m-b-30" v-for="item,index in organization" :key="index">
                <view class="fs-24 text-color-secondary flex-1">{{item.name}}</view>
                <view class="fs-24" :class="item.status === '确权中'? 'default-color': 'theme-color'">
                 <image src="../../../assets/certification/wait.png" v-if="item.status === '确权中'"></image>
                  <image src="../../../assets/certification/authed.png"  v-if="item.status === '已确权'"></image>
                  <text>{{item.status}}</text>
                </view>
            </view>
      </view>

      <view class="next-btn u-m-t-60 u-m-b-20" @click="goInvite" v-if="!(organizationIds== limit2 && managerIds==limit)">添加确权人</view>
      <view class="next-btn text-color-primary back" @click="goHome">返回首页</view>
      <view class="u-p-b-60"></view>
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
const config = useConfig()
let cooperationRecord = reactive({})
let manager:any = reactive([])
let organization:any = reactive([])
let managerIds:any = reactive([])
let organizationIds:any = reactive([])
let limit:any = ref()
let limit2:any = ref()
let min:any = ref()
let min2:any = ref()
const goInvite = () => {
  uni.$once('features-page/invite:confirm', async (data:any) => {
    targetInvestManagers = data.mangers
    targetInvestInstitutions = data.organization
    addCooperation()
  })
  uni.navigateTo({
    url: '/pages/features-page/invite?managers='+managerIds.join(',')+ '&organizations='+organizationIds.join(',') + '&limit='+limit.value+'&limit2='+limit2.value+ '&min='+min.value+'&min2='+min2.value
  })
}
const goHome = () => {
  uni.switchTab({
    url: '/pages/index'
  })
}

const getDetail = async () => {
  const result =await service.certification.getCooperationRecord({size:20})
  if (result !=null) {
    let managerTemp:any = []
    let organizationTemp:any  = []
    result.records.forEach((item:any)=> {
      if (item.roleType == 1) {
        managerTemp.push(item)
      } else {
        organizationTemp.push(item)
      }
    })
    // manager = []
    Object.assign(manager, managerTemp)
    // managerIds = []
    managerIds = managerTemp.map((item:any) => item.representativeId)
    Object.assign(organization, organizationTemp)
    organizationIds = organizationTemp.map((item:any) => item.representativeId)
  }

}
let targetInvestManagers:any = ref([])
let targetInvestInstitutions:any = ref([])
const addCooperation = async () => {
  try {
    const result =  await service.certification.addCooperation({
      targetInvestManagers:targetInvestManagers.map((item:any) => item.id),
      targetInvestInstitutions: targetInvestInstitutions.map((item:any) => item.id)
    })
  } catch (error) {
    
  }
 

}

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


onShow(() => {
  getDictionaryLimit('assist_number')
  getDetail()
})

</script>

<style lang="scss" scoped>
.wrap{
  border-radius: 12rpx;
}
.icon{
  width: 160rpx;
  height:160rpx;
  margin: 124rpx auto 0;
}
.theme-color{
  color:#12C287;
  image{
    width:24rpx;
    height:24rpx;
    margin-right: 8rpx;
  }
}
.default-color{
  color:#0076FF;
   image{
    width:24rpx;
    height:24rpx;
    margin-right: 8rpx;
  }
}
.text-center{
  text-align: center;
}
.back{
  background: #FFFFFF;
  border-radius: 50px;
  border: 1rpx solid #E9E9E9;
  box-shadow: none!important;
 
}
</style>