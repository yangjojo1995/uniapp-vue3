<template>
  <view class="region-city-selection">
    <ym-invite-panel
      v-model:managers="data.manger"
      v-model:organization="data.organization"
      :title="data.title"
      :border="false"
      :limit="data.limit"
      :limit2="data.limit2"
      :min="data.min"
      :min2="data.min2"
      :excludeManager="data.excludeManager"
      :excludeOrganization="data.excludeOrganization"
      @checked-managers="handleCheckedManager"
      @checked-organizations="handleCheckedOrganization"

      >
    </ym-invite-panel>
    <view class="region-city-selection__footer">
      <ym-button type="primary" @click="handleSumbit">确定</ym-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad, onUnload } from "@dcloudio/uni-app"

const data = reactive({
  value: undefined as string | string[] | undefined,
  managers: undefined as string | string[] | undefined,
  organizations: undefined as string | string[] | undefined,
  title: undefined as string | undefined,
  excludeManager: [],
  excludeOrganization: [],
  limit: undefined, //最大经理
  limit2: undefined,//最大机构
  min: undefined, //最少选择多少个投资经理
  min2: undefined//最少选择多少个投资机构

})

onLoad((props: any) => {
  if (props.managers)  data.excludeManager = props.managers.split(',')
  if (props.organizations) data.excludeOrganization = props.organizations.split(',')
  if (props.title) data.title = decodeURIComponent(props.title)
  if (props.limit) data.limit = props.limit
  if (props.limit2) data.limit2 = props.limit2
  if (props.min) data.min = props.min
  if (props.min2) data.min2 = props.min2
})

let checkedMangers = ref([] as any[])
let checkedOrganizations = ref([] as any[])

const handleCheckedManager = (managers: any[]) => {
  console.log('page:',managers)
  checkedMangers.value = managers
}
const handleCheckedOrganization = (organizations: any[]) => {
   console.log('page:',organizations)
  checkedOrganizations.value = organizations
}

const handleSumbit = () => {
  uni.$emit('features-page/invite:confirm', {mangers:checkedMangers.value,organization:checkedOrganizations.value})
  uni.navigateBack({ delta: 1 })
}
onUnload(() => {
  uni.$off('features-page/invite:confirm')
})
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
