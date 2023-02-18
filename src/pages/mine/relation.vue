<template>
  <view class="map" v-if="url">
   <web-view :src="url" bindmessage=""></web-view>
  </view>
</template>

<script lang="ts" setup>
import { getToken } from '@/plugins/app-core'
import config from '@/config/index'
import {ref, Ref} from 'vue'
import { onLoad } from "@dcloudio/uni-app";

let url: Ref<string> = ref('')
onLoad(async (options) => {
  // let token = await getToken()
  console.log(options.id)
  uni.getSystemInfo({
	success: function (res) {
      let path = `${config.ORG_GRAPH_URL}?id=${options.id}&width=${res.screenWidth}&height=${res.screenHeight}`
      console.log(path)
      // https://admin.gdxctm-dev.dreamkey.cn/orgGraph.html?id=1537314874256744449&width=375&height=667
      url.value = path
    }
  });
})

</script>

<style>

</style>