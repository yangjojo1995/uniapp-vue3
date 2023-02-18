<template>
  <view >
      <view class="u-p-x-32 u-p-y-30 bg-white u-m-b-20 stricky">
        <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#12C287"></uni-segmented-control>
      </view>
      <!-- <ym-cooperation-item @item-click="goDetail(item)" v-for="item,index in managerPagingLazy.list " :key="index" :item="item"></ym-cooperation-item> -->
      <view class="cooperation-wrap"> 
        <ym-list-card @click="goDetail(item)" v-for="item,index in managerPagingLazy.list " :key="index" :name="item.name" :thumb="item.avatar">
          <template #name-left>
            <ym-tag class="tag" :type="tagMap[item.status]">{{item.statusStr}}</ym-tag>
          </template>
          <template #content>
            <view class="list-item">类型：{{item.type==='1' ? '项目确权' : '投资经理确权'}} </view>
            <view class="list-item">申请时间：{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm')  }}</view>
            <view class="list-item" v-if="item.expireReason && item.status==='invalid'" >失效原因：{{ item.expireReason }}</view>
          </template>
        </ym-list-card>
        <ym-load-more :status="managerPagingLazy.loadStatus"></ym-load-more>
      </view>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, reactive } from 'vue'
import { onPullDownRefresh, onReachBottom, onShow } from "@dcloudio/uni-app";
import { useService } from '@/plugins/app-core'
import { PagingLazy } from '@/utils/paging'

const service = useService()
const search: any = ref('')
const current = ref(0)
const statuMap: any = { 0: 'assisting', 1: 'assisted', 2: 'revoke', 3: 'invalid', 4: '', } // 状态参数转换
const tagMap: any = {assisting: 'warning', assisted: 'primary', revoke: 'purple', invalid: 'info'} // 标签参数转换


const managerPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const result = await service.mine.queryAssistAuthenticList({page, size, name:search.value, status: statuMap[current.value] })
  return {
    total: result.total,
    records: result.records
  }
}))


onShow(async () => {
  await managerPagingLazy.refresh()
})

onPullDownRefresh(async () => {
  await managerPagingLazy.refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  managerPagingLazy.next()
})

const goDetail = (item: any):void => {
  if(item.status === 'revoke' || item.status === 'invalid') return 
  if( item.type === '1'){
    //  type： 1项目确权
    uni.navigateTo({url: `./bpDetail?assistId=${item.assistId}&bindId=${item.bindId}`})
  }else{
    //  type：0身份认证
    uni.navigateTo({url: `./detail?assistId=${item.assistId}`})  
  }
}

const items = ['待确权', '已确权', '已撤销', '已失效', '全部']
const onClickItem = function (e: any) {
  if (current.value != e.currentIndex) {
    current.value = e.currentIndex
    managerPagingLazy.refresh()
  }
}

</script>

<style lang="scss" scoped>
.stricky{
  z-index: 99;
}
.list-item{
  font-size: 26rpx;
  font-weight: 400;
  color: #666666;
  margin: 8rpx 0 ;
}
</style>
