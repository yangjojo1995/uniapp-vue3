<template>
  <ym-page-search :logs="logs" :cancel-back="true" :focus="focus" @delete-log-all="handleDeleteLogAll" @confirm="handleConfirm"></ym-page-search>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { onLoad, onShow, onHide } from "@dcloudio/uni-app"
import { router, useService } from '@/plugins/app-core'
const service = useService()

const propsData = reactive({
  title: '搜索',
  type: '',
  value: '',
  path: '/',
  key: 'search',
})

onLoad((props: any) => {
  if (props.title) propsData.title = decodeURIComponent(props.title)
  if (props.type) propsData.type = decodeURIComponent(props.type)
  if (props.value) propsData.value = decodeURIComponent(props.value)
  if (props.path) propsData.path = decodeURIComponent(props.path)
  if (props.key) propsData.key = decodeURIComponent(props.key)
  uni.setNavigationBarTitle({ title: propsData.title })
})

const logs = ref([] as { label: string, value: string }[])

const focus = ref(false)
onShow(async function () {
  focus.value = true
})
onHide(() => {
  focus.value = false
})

const updateLogs = async function () {
  const { records } = await service.history.getRecord({
    type: propsData.type,
    page: 1,
    size: 200
  })
  logs.value = records.map(item => {
    return { label: item.keyWord, value: item.keyWord }
  })
}

onShow(updateLogs)

const handleConfirm = async function (value: string) {
  if (!value) return
  value = value.replace(/^\s+|\s+$/g, '')
  await service.history.create({ type: propsData.type, keyWord: value })
  await updateLogs()
  router.push({ path: propsData.path, query: { [propsData.key]: value } })
}

const handleDeleteLogAll = async function () {
  await service.history.removeAll({ type: propsData.type })
  logs.value = []
}
</script>

<style lang="scss" scoped>
</style>
