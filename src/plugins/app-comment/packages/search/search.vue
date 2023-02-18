<template>
  <ac-search :logs="logs" :cancel-back="true" :focus="focus" @delete-log-all="handleDeleteLogAll" @confirm="handleConfirm"></ac-search>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { onLoad, onShow, onHide } from "@dcloudio/uni-app"
import { acUseService, useRouter } from '../../src/lib/app-core'
const acService = acUseService()
const router = useRouter()

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

const logs = ref([
  // { label: '唐三彩', value: '唐三彩' }
] as { label: string, value: string }[])

const focus = ref(false)
onShow(async function () {
  focus.value = true
})
onHide(() => {
  focus.value = false
})

const updateLogs = async function () {
  const { records } = await acService.history.getRecord({
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
  await acService.history.create({ type: propsData.type, keyWord: value })
  await updateLogs()
  router.push({ path: propsData.path, query: { [propsData.key]: value } })
}

const handleDeleteLogAll = async function () {
  await acService.history.removeAll({ type: propsData.type })
  logs.value = []
}
</script>

<style lang="scss" scoped>
</style>
