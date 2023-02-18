<template>
  <view class="detail">

    <ym-empty v-if="hideActivity" title="活动已下架" mode="list"></ym-empty>

    <ym-activity-detail v-else :item="detail"></ym-activity-detail>

    <ym-footer>
      
      <!-- 报名中 -->
      <template v-if="detail.status==='apply'">
        <view class="footer-btn flex-center disable-bg" v-if="detail.applyStatus==1">已报名</view>
        <view class="footer-btn flex-center green-bg" v-else @click="goApply">报名</view>
      </template>

      <!-- 进行中 -->
      <template v-if="detail.status==='progress'">
        <view class="flex jc-between ai-center wrap">
          <view class="btn flex-center disable-bg" v-if="detail.applyStatus==1" >已报名</view>
          <!-- <view class="btn flex-center green-bg" v-else  @click="goApply">报名</view> -->
          <view class="flex-center disable-bg" :class="detail.applyStatus == 1? 'btn': 'footer-btn'" v-if="detail.signInStatus==1" >已签到</view>
          <view class="flex-center green-bg" :class="detail.applyStatus == 1? 'btn': 'footer-btn'" v-else  @click="goSign">签到</view>
        </view>
      </template>

      <template v-if="detail.status==='end'">
        <view class="footer-btn flex-center disable-bg">已结束</view>
      </template>
      
    </ym-footer>

  </view>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import urlParams from '@/utils/urlParams'
export default defineComponent({
  data () {
    return {
      shareOptions: {},
    }
  },
  async onLoad (props: any) {
    const scene = urlParams(props.scene) // 二维码的参数
    const result = await this.$service.activity.getActivity({ id: scene.id || props.id })
    this.shareOptions = {
      title: result.title,
      path: undefined,
      imageUrl: undefined
    }
  }
})
</script>

<script setup lang="ts">
import { getToken } from '@/plugins/app-core'
import { reactive, onLoad, useService, ref } from '@/utils/commonUse'
import { onShow } from "@dcloudio/uni-app";
const service = useService()
const id = ref('')

let detail: any = reactive({})
const goApply = async () => {
  const token = await getToken()
  if (!token) {
    uni.navigateTo({
      url: `/pages/login/login?from=activity`
    })
  } else {
    if (detail.enableParticipate) {
       uni.navigateTo({
        url: `/pages/activity/apply?activityId=${detail.id}&activityName=${detail.title}`
      })
    } else {
      uni.showToast({
        icon: 'none',
        title: '自己不能报名自己发起的活动'
      })
      return
    }
   
  }

}
const goSign = async() => {
  const token = await getToken()
  if (!token) {
     uni.navigateTo({
      url: `/pages/login/login?from=activity`
    })
  } else {
    if (detail.enableParticipate) {
      uni.navigateTo({
        url: `/pages/activity/signin?activityId=${detail.id}&activityName=${detail.title}&applyStatus=${detail.applyStatus}&applyId=${detail.applyId}&`
      })
    } else {
       uni.showToast({
        icon: 'none',
        title: '自己不能签到自己发起的活动'
      })
      return
    }
  }
}
const addActivityViewNumber = async (id:any) => {
  const result = await  service.activity.addActivityViewNumber({id: id})
}

onLoad(async (options: Record<string, string | undefined>) => {

  if (options.scene) {
    let str =decodeURIComponent(options.scene)
    let arr = str.replace(/&share/g,'').split('=')
     addActivityViewNumber(arr[1])
     id.value = arr[1]
  } else {
    if (typeof options.id !== 'string') {
      uni.showToast({ title: '项目id值非法', icon: 'none' });
      return
    }
    addActivityViewNumber(options.id)
     id.value = options.id
  }
})

let hideActivity = ref(false) // 是否隐藏活动
onShow(async() => {
  try{
    const result = await service.activity.getActivity({ id: id.value })
    Object.assign(detail, result)
    hideActivity.value = false
  }catch(e){
    hideActivity.value = true
  }
  
})
</script>

<style lang="scss" scoped>

.detail{
  background: #F7F7F7;
  padding-bottom: 146rpx;
}

.footer-btn{
  width: 686rpx;
  height: 82rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 500;
  margin: 0 8rpx;
}
.wrap{
  width: 686rpx;
}
.btn{
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 500;
  padding:26rpx 0;
  width:332rpx;
  text-align: center;
}

.green-bg {
  background: $--ym-bg-primary;
  color: #fff;
}

.disable-bg{
  background: #E9E9E9;
  color: #FFFFFF;
}

.orange {
  color: #FA7109;
}

.blue {
  color: #0077FF;
}

</style>
