<template>
  <view class="region-city-selection">
    <ym-invite-panel2
      v-model:managers="data.managers"
      v-model:organizations="data.organizations"
      v-model:guide="data.guide"
      :border="false"
      :limit="data.limit"
      :projectId="data.projectId"
      :limit2="data.limit2"
      :limit3="data.limit3"
      :excludeManager="data.excludeManager"
      :excludeOrganization="data.excludeOrganization"
      @checked-managers="handleCheckedManager"
      @checked-organizations="handleCheckedOrganization"
      @checked-guide="handleCheckedGuide"

      >
    </ym-invite-panel2>
    <view class="region-city-selection__footer">
      <ym-button type="primary" @click="handleSumbit">确定</ym-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad, onUnload } from "@dcloudio/uni-app"
import { useService } from '@/plugins/app-core'
const service = useService()

const data = reactive({
  value: undefined as string | string[] | undefined,
  managers: undefined as string | string[] | undefined,
  organizations: undefined as string | string[] | undefined,
  guide: undefined as string | string[] | undefined,
  notIn: undefined as string | undefined,
  limit: undefined, //可选择最大经理数
  limit2: undefined, //可选择最大机构数
  limit3: undefined, //可选择最大机构数
  projectId: '' as string //项目id
})

onLoad(async (props: any) => {
    if (props.id)  data.projectId = props.id
})

let checkedMangers = ref([] as any[])
let checkedOrganizations = ref([] as any[])
let checkedGuide = ref([] as any[])

const handleCheckedManager = (managers: any[]) => {
  console.log('page:',managers)
  checkedMangers.value = managers
}
const handleCheckedOrganization = (organizations: any[]) => {
   console.log('page:',organizations)
  checkedOrganizations.value = organizations
}
const handleCheckedGuide = (guide: any[]) => {
   console.log('page:',guide)
  checkedGuide.value = guide
}

const handleSumbit = async () => {
  try{
    const ids = [
                  ...checkedMangers.value.map((item:any) => item.id), 
                  ...checkedOrganizations.value.map((item:any) => item.id), 
                  ...checkedGuide.value.map((item:any) => item.id)
                ]
                
    await service.project.inviteConfirm({ id: data.projectId, representativeIds: ids })
   
    uni.showToast({
      icon: 'none',
      title: '邀请成功',
      duration: 1000
    })
    setTimeout(()=>{
      uni.navigateBack({ delta: 1 })
    },1000)
  } catch(e){
    console.log(e)
  }
}
</script>

<style lang="scss" scoped>
.region-city-selection {
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 146rpx;
  padding-top: 20rpx;
  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 146rpx;
    padding: 30rpx 100rpx;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 30rpx #999999;
  }
}
</style>
