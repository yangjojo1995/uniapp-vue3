<template>
  <view class="agreementHtml" style="line-height: 28px;">
    <rich-text :nodes="content"> </rich-text>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue'
import { useService } from '@/plugins/app-core'
const service = useService()


let content = ref('')
onMounted(async () => {
  const result = await service.user.getSignatureInfo({type: '0'})
  content.value = result.content
})

</script>

<style lang="scss" scoped>
.agreementHtml{
  padding: 32rpx;
  font-size: 24rpx;
}

</style>