<template>
  <view class="page-search">
    <u-sticky>
      <ym-search-bar
        v-model="searchValue"
        :maxlength="100"
        :focus="false"
        :placeholder="'请输入关键字搜索'"
        :cancel-back="true"
        clear-button="auto"
        cancel-button="always"
        @confirm="handleSearchConfirm"
        @cancel="handleSearchCancel">
      </ym-search-bar>
    </u-sticky>

    <view class="u-p-x-32 u-p-t-20">
      <view class="bg-white u-m-b-20 u-p-x-30 u-p-y-40 flex jc-between ai-center" v-for="item,index in listPagingLazy.list" :key="index" @click="selectChange(index,item)">
        <view class="avatar-icon u-m-r-20" >
            <image :src="assets(item.avatar) || '../../../assets/mine/default.png'"/>
        </view>
        <view class="flex-1 ai-strech flex flex-column jc-between u-m-r-30" >
          <view class="fs-30 text-color-primary u-m-b-10 bold">{{item.name}}</view>
        </view>
        <view class="checkbox">
          <view class="check-inner" :class="item.checked? 'checked-active' : ''">
            <u-icon name="checkmark" size="12" color="#fff"></u-icon>
          </view>
        </view>
      </view>
    </view>
    <view style="padding-bottom:220rpx;"></view>
    <ym-footer>
        <view class="w-100 flex jc-between ai-center">
          <view class="invite-btn text-center flex-1 next-btn" @click="goSubmit">提交</view>
        </view>
    </ym-footer>
  </view>
</template>

<script setup lang="ts">

import {ref,reactive,watch} from 'vue'
import { onLoad ,onReachBottom} from "@dcloudio/uni-app";
import { useService } from '@/plugins/app-core'
import {assets} from '@/utils/assets'
import { PagingLazy } from '@/utils/paging'
let searchValue = ref('')
const service =useService()

// 取消搜索
const handleSearchCancel = function () {
  return uni.navigateBack({ delta: 1 })
}
const selectChange = (index:number,item:any) => {

  if ( listPagingLazy.list[index].checked) {
    listPagingLazy.list[index].checked = false
  } else {
    listPagingLazy.list.forEach((item:any) => {
      item.checked = false
    })
    listPagingLazy.list[index].checked = true
  }

}
watch(() => searchValue.value, (value) => {
  listPagingLazy.refresh()
})
const goSubmit = async () => {
  const arr:any = []
  let investManagerId = ''
  const selectBoolean =listPagingLazy.list.some((item:any) => {
    investManagerId = item.id
    return item.checked === true
  })
  if (!selectBoolean) {
    uni.showToast({
      icon: 'none',
      title: '请至少选择一个投资经理'
    })
  } else {
    uni.showLoading({})
    try {
      const result = await service.organization.applyRelation({investManagerId:investManagerId})
      setTimeout(() => {
        uni.hideLoading()
        uni.navigateTo({url:'/pages/mine-identity/organization-manage/state'})
      }, 500)

    } catch (error) {
    }
  }
}
const filterData = reactive({
  statues: ["assisted"],
  sortField: 'update_time',
  asc: false
})
// 分页
const listPagingLazy = reactive(new PagingLazy(async function (page, size) {
  const { total, records }  = await service.manager.getManagerRecords({ page, size, name: searchValue.value, ...filterData  })
    for (const item of records) {
    item.checked =  false
  }
  return { total, records }
}))
watch(() =>searchValue.value, (value) => {
  listPagingLazy.refresh()
})
onLoad(async (query) => { 
  listPagingLazy.load()
})


onReachBottom(() => {
  listPagingLazy.next()
})


</script>

<style lang="scss" scoped>
.check-inner{
  width:36rpx;
  height:36rpx;
  background-color: #fff;
  border-radius: 50%;
  border:1rpx solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checked-active{
  width:36rpx;
  height:36rpx;
  background-color: #01BA76;
  border-radius: 50%;
  border:1rpx solid #01BA76;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-search {
  min-height: 100vh;
}

.search-group {
  padding: 32rpx 32rpx;
  background-color: #ffffff;
  &__name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    line-height: 36rpx;
    margin-bottom: 40rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}



.avatar-icon{
    width:108rpx;
    height:108rpx;
    border-radius: 50%;
    overflow: hidden;
    image{
      width:100%;
      height:100%;
    }
  }

  .invite-btn {
    background: $--ym-bg-primary;
    color: #fff;
    padding:24rpx 0;
    border-radius: 50%;
     border-radius: 60rpx;
  }

</style>
