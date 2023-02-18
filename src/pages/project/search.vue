<template>
  <ym-page-search :logs="logs" :cancel-back="true" @confirm="handleConfirm"></ym-page-search>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@/plugins/app-core'

const logs = ref([
  { label: '唐三彩', value: '唐三彩' },
  { label: '动植物化石', value: '动植物化石' },
  { label: '动植物标准', value: '动植物标准' },
  { label: '三国青铜器', value: '三国青铜器' },
  { label: '文房用品', value: '文房用品' },
  { label: '唐三彩', value: '唐三彩2' }
])

const handleConfirm = async function (value: string) {
  if (!value) return
  router.push({ path: '/pages/project/list', query: { search: value } })
}
</script>

<style lang="scss" scoped>
</style>
