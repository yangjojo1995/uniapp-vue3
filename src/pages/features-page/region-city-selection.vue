<template>
  <view class="region-city-selection">
    <ym-region-city-panel
      v-model="data.value"
      :title="data.title"
      :border="false"
      :limit="data.limit"
      @checked-citys="handleCheckedCitys">
    </ym-region-city-panel>
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
  title: undefined as string | undefined,
  limit: 1
})

onLoad((props: any) => {
  if (props.limit) data.limit = Number(props.limit || 1)
  if (props.title) data.title = decodeURIComponent(props.title)
  if (props.value) data.value = data.limit > 1 ? String(props.value).split(',') : String(props.value)
})

let checkedCitys = ref([] as any[])
const handleCheckedCitys = (citys: any[]) => {
  checkedCitys.value = citys
}

const handleSumbit = () => {
  if (checkedCitys.value == null || checkedCitys.value.length === 0 || checkedCitys.value === undefined ) {
     uni.showToast({
      icon: 'none',
      title: '请至少选一个城市'
    })
    return
  }
  uni.$emit('features-page/region-city-selection:confirm', checkedCitys.value)
  uni.navigateBack({ delta: 1 })
}

onUnload(() => {
  uni.$off('features-page/region-city-selection:confirm')
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
