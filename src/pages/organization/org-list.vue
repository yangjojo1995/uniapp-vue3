<template>
  <!-- 本页为机构列表，从 h5 地图页跳转过来的机构统计，地图上筛选出的机构有多少家，则本页就显示多少家 -->
  <orgList class="page-list" :listPagingLazy="listPagingLazy"></orgList>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { onLoad, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
import { useService, useConfig, useRouter, getUserInfo } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'
import orgList from './components/list.vue'
const router = useRouter()
const service = useService()

let param = {}
const factor = Math.trunc(Math.random() * 32)
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.organization.getOrganizationRecords({ page, size, factor, statues: ["accept"], ...param })
  for (const item of records) {
    item.tags = [
      // (item.focusAreas || '').split(',').map((val: string) => val.trim()).join('、'),
      (item.investFieldsStr || []).map((item: any) => item.itemName).join('、'),
      (item.investRoundsStr || []).map((item: any) => item.itemName).join('、')
    ]
  }
  return { total, records }
}))

// 从 h5 调用的微信跳转，会将各种特殊的类型转为字符串
function checkUrlParam(str: string|undefined){
  if(str === 'null' || str === 'undefined') return false
  return !!str
}

onLoad(async (query) => {
  param = {
    ...checkUrlParam(query.investField) && {investField: query.investField},
    ...checkUrlParam(query.investRound) && {investRound: query.investRound},
    ...checkUrlParam(query.province) && {province: query.province},
    ...checkUrlParam(query.city) && {city: query.city},
  }
  listPagingLazy.load()
})

onPullDownRefresh(async () => {
  await listPagingLazy.refresh()
  uni.stopPullDownRefresh();
})

onReachBottom(() => {
  listPagingLazy.next()
})


</script>

<style lang="scss" scoped>
.page-list {
  margin-top: 20rpx;
}

.fullname {
  color: #333333 !important;
}


.list-item-content {
  $line: 2;
  $line-height: 40rpx;

  font-size: 26rpx;
  font-weight: 400;
  color: #666666;
  max-height: ($line-height * $line);
  line-height: $line-height;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  white-space: pre-wrap;
  margin-bottom: 8rpx;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
