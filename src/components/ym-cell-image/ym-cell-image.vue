<template>
  <ym-cell
    :icon="props.icon"
    :label="props.label"
    :align="props.align"
    :forward="true"
    :padding="props.padding"
    :border="props.border"
    @click="handleClick">
    <image class="cell-content-image" :src="assets(props.modelValue || src)" />
  </ym-cell>
</template>

<script setup lang="ts">
import { useService } from '@/plugins/app-core'
import assets from '@/utils/assets'

const service = useService()

const props = withDefaults(defineProps<{
  icon?: string
  label?: string
  src?: string
  modelValue?: string
  align?: 'left' | 'right'
  forward?: boolean
  padding?: boolean,
  border?: boolean
}>(), {
  align: 'right',
  padding: true,
  border: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const handleClick = (event: any) => {
   uni.$once('uAvatarCropper',async (path) => {
     let result = await service.app.uploadFile({
       filePath: path
     })
     let file = JSON.parse(result.data)
     emit('update:modelValue', file.data.url)
  })
  uni.navigateTo({
    url: '/pages/cropper/cropper?destWidth='+320+'&rectWidth='+320
  })
}
</script>

<style lang="scss" scoped>
.cell-content-image {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}
</style>
