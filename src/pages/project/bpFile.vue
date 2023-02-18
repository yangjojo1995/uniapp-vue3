<template>
  <view class="bp-page">
    <view class="bp-content" v-if="bpInfo.id">
      <view class="bp-content-box" v-for="item in bpInfo.pictures" :key="item">
        <image :src="assets(item)+'?original=true'" mode="widthFix" :lazy-load="true" :thumb-lazy-load="true" @click="previewImg(item, bpInfo.pictures)"></image>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, onLoad, onShow, useService, ref } from '@/utils/commonUse'
import assets from '@/utils/assets'
import { previewImg  } from "@/utils/preview";

const service = useService()

let bpInfo: any = reactive({
  id: '',
  bpName: '',
  pictures: []
})
onLoad(async (options: Record<string, string | undefined>) => {
  if (typeof options.bpId !== 'string') {
    console.error('id值非法')
    return
  }
  let latest: any = options.latest
  const result = await service.collectBp.getBpFile({bpId: options.bpId, ...!!latest && {latest: latest}})
  Object.assign(bpInfo, result)
  uni.setNavigationBarTitle({ title: result.bpName }) 
})

</script>

<style lang="scss" scoped>
.bp-page{

}
.bp-content{
  width: 100%;

  .bp-content-box{
    width: 100%;
    margin: 0;
    
    image{
      margin: 0;
      width: 100%;
    }
  }
}


</style>
