<template>
  <view >
      <view v-if="type==='yq' || type==='qq'" class="u-p-x-32 u-p-y-30 bg-white u-m-b-20 stricky">
        <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#12C287"></uni-segmented-control>
      </view>
      <view class="cooperation-wrap">
        <ym-cooperation-item @item-click="goDetail(item)" v-for="item,index in pagingLazy.list " :key="index" :item="item"></ym-cooperation-item>
        <ym-empty v-if="pagingLazy.isEmpty" text="暂无数据" mode="list"></ym-empty>
        <ym-load-more :status="pagingLazy.loadStatus"></ym-load-more>
      </view>
  </view>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'
import { onPullDownRefresh, onReachBottom, onShow, onLoad } from "@dcloudio/uni-app";
import { useService } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'

const service = useService()
const representativeId: any = ref('')
const current = ref(0)
const type = ref('')

const pagingLazy = reactive(new PagingLazy(async function (page, size) {
  let changeMap: any = { 0: 1, 1: 0 }
  let direction: number =  current.value
  direction = changeMap[direction]
  const result = await service.certification.getRelationList({page, size, type: type.value, representativeId: representativeId.value, direction: direction})
  return {
    total: result.total,
    records: result.records
  }
}))

let items: any = ref([])
onLoad(async (options) => {
  representativeId.value = String(options.id)
  type.value = String(options.type)
  switch (type.value) {
    case 'qq': 
      items.value = ['协助确权', '被确权']
      uni.setNavigationBarTitle({ title: '确权关系' })
      break;
    case 'gk':
      uni.setNavigationBarTitle({ title: '所属关系' })
      break;
    case 'yq':  
      items.value = ['邀请', '被邀请']
      uni.setNavigationBarTitle({ title: '邀请关系' })
      break;
    case 'gl':
      uni.setNavigationBarTitle({ title: '管理关系' })
    default: break;
  }
})

onShow(async () => {
  await pagingLazy.refresh()
})

onPullDownRefresh(async () => {
  await pagingLazy.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  pagingLazy.next()
})

const goDetail = (item: any):void => {
  // 角色类型0普通用户1投资经理2投资机构3企业4指导单位
  let url = ''
  switch (item.accountRole) {
    case 0:
      // url = '/pages/'
      break
    case 1:
      url =
        '/pages/manager/detail?id=' +
        encodeURIComponent(item.id)
      break
    case 2:
      url =
        '/pages/organization/detail?id=' +
        encodeURIComponent(item.id)
      break
    case 3:
      url =
        '/pages/company/detail?id=' +
        encodeURIComponent(item.id)
      break
    case 4:
      url =
        '/pages/observer/detail?id=' +
        encodeURIComponent(item.id)
      break
  }
   if (url) {
    uni.navigateTo({
      url: url
    })
  }
  // if( current.value === 0){
  //   //  type： 1BP确权
  //   uni.navigateTo({url: `./bpDetail?assistId=${item.assistId}&bindId=${item.bindId}&status=${item.status}`})
  // }else{
  //   //  type：0身份认证
  //   uni.navigateTo({url: `./detail?assistId=${item.assistId}&statusStr=${item.statusStr}`})  
  // }
 
}

const onClickItem = function (e: any) {
  if (current.value != e.currentIndex) {
    current.value = e.currentIndex
    pagingLazy.refresh()
  }
}

</script>

<style lang="scss" scoped>


</style>
