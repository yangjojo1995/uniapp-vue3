<template>
  <view class="recommended">
    <view @click="checked(item)" v-for="item in list" :key="item.id" class="recommended-item" :class="{checked: item.checked}">
      {{item.groupName}}
    </view>
    <ym-empty v-if="list.length === 0" text="暂无数据" mode="list"></ym-empty>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { Ref, ref } from 'vue'
import { useService } from '@/plugins/app-core'
const service = useService()
const unionId = ref('')
interface org {
  id?: string,
  checked?: boolean
}
const checkedId = ref('')
const list: Ref<Array<org>> = ref([]) 
onLoad(async(options) => {
  unionId.value = options.unionId || ''
  list.value = await service.certification.getRecommendList({})
  if(options.orgId){
    checkedId.value = options.orgId
    for(let key in list.value){
      if(list.value[key].id === checkedId.value){
        list.value[key].checked = true
        break
      }
    }
  }
})

// 保存草稿
let isSubmit = ref(false)
async function submitSaveDraft(params: org){
  if(isSubmit.value){
    false
  }
  isSubmit.value = true
	uni.showLoading({})
  const result = await service.certification.addEnterpriseDraft({
    id: unionId.value,
    orgId: params.id
  })
  setTimeout(() => {
    isSubmit.value = false
    uni.hideLoading()
    uni.navigateBack({
      delta:1 
    })
  })
}

// 选中单位
function checked(item: org){
  let param = { id: item.id }
  if(item.checked){
    item.checked = false
    param.id = ''
  }else{
    param.id = item.id
  }
  submitSaveDraft(param)
}


</script>

<style lang="scss" scoped>
.recommended{
  min-height: calc(100vh - 20rpx);
}
.recommended-item{
  height: 128rpx;
  box-sizing: border-box;
  margin: 24rpx 32rpx;
  line-height: 128rpx;
  background: #fff;
  border-radius: 12rpx;
  color: #333;
  padding: 0 32rpx;

  &.checked{
    border: 1px solid #00CD85;
  }
}
</style>
