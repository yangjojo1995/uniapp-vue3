<template>
  <view class="map" v-if="url">
   <web-view :src="url"></web-view>
  </view>
</template>

<script setup lang="ts">
import { getToken } from '@/plugins/app-core'
import config from '@/config/index'
import {ref, Ref} from 'vue'
import { onLoad } from "@dcloudio/uni-app";

let url: Ref<string> = ref('')
onLoad(async () => {
  let token = await getToken()
  url.value = `${config.ORG_MAP_URL}?token=${token}`
  // url.value = `http://192.168.16.214:8080/orgMap.html?token=${token}`
})

</script>

<style lang="scss" scoped>
.map{
  background: #fff;
  height: 100vh;
}
</style>
